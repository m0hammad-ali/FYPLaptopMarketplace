"""
FastAPI Recommendation Service.

Endpoints:
    GET  /health         — service status + data load status
    POST /recommend      — get top-K laptop recommendations
"""

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import Optional
import numpy as np
import pandas as pd
import requests
import os

from app.preprocess import preprocess_laptops
from app.similarity import weighted_cosine_similarity, euclidean_distance
from app.user_profile import build_user_vector


app = FastAPI(title="Recommendation Service", version="1.0.0")

CATALOG_SERVICE_URL = os.getenv("CATALOG_SERVICE_URL", "http://catalog-service:5002")

# In-memory state (populated on startup)
state = {
    "df": None,
    "feature_cols": None,
    "scaler": None,
    "encoder": None,
    "laptop_vectors": None,
    "laptop_records": None,
}


class UserPreferences(BaseModel):
    # Mode and usage
    mode: str = Field("pro", description="voice | simple | pro")
    usage: str = Field("everyday", description="gaming | office | ultrabook | workstation | everyday")

    # Core filters (always required)
    budget: float = Field(200000, description="Max price in PKR")
    top_k: int = Field(5, ge=1, le=20)

    # Optional categorical preferences
    brand_preference: str = "Any"
    storage_type_preference: str = "Any"

    # Optional numeric overrides (Pro mode)
    cpu_min_benchmark: float = 0
    gpu_min_benchmark: float = 0
    ram_min_gb: int = 0
    storage_min_gb: int = 0
    weight_max_kg: float = 100
    battery_min_wh: int = 0

    # Metric selection (used in Day 12 evaluation)
    metric: str = Field("cosine", description="cosine | euclidean")


def fetch_laptops():
    """Fetch all laptops from Catalog Service."""
    try:
        r = requests.get(f"{CATALOG_SERVICE_URL}/laptops", timeout=15)
        r.raise_for_status()
        return r.json()
    except Exception as e:
        print(f"[ERROR] Failed to fetch from catalog: {e}")
        return []


@app.on_event("startup")
def load_data():
    """Load and preprocess laptops from Catalog Service on startup."""
    print("[STARTUP] Fetching laptops from catalog...")
    laptops = fetch_laptops()

    if not laptops:
        print("[WARNING] No laptops fetched. /recommend will return 503.")
        return

    result = preprocess_laptops(laptops)
    if result[0] is None:
        print("[ERROR] Preprocessing returned empty result.")
        return

    df, feature_cols, scaler, encoder, records = result

    state["df"] = df
    state["feature_cols"] = feature_cols
    state["scaler"] = scaler
    state["encoder"] = encoder
    state["laptop_vectors"] = df[feature_cols].values
    state["laptop_records"] = records

    print(f"[STARTUP] Loaded {len(records)} laptops. Features: {len(feature_cols)}")


@app.get("/health")
def health():
    loaded = state["df"] is not None
    return {
        "status": "ok",
        "service": "recommendation-service",
        "data_loaded": loaded,
        "laptop_count": len(state["laptop_records"] or []),
    }


@app.post("/recommend")
def recommend(prefs: UserPreferences):
    if state["df"] is None:
        raise HTTPException(status_code=503, detail="Data not loaded. Try again in a moment.")

    records = state["laptop_records"]
    vectors = state["laptop_vectors"]
    feature_cols = state["feature_cols"]

    # ---- Step 1: Apply hard filters ----
    mask = np.ones(len(records), dtype=bool)
    for i, r in enumerate(records):
        if r["price_pkr"] > prefs.budget:
            mask[i] = False
        if r["cpu_benchmark"] < prefs.cpu_min_benchmark:
            mask[i] = False
        if r["gpu_benchmark"] < prefs.gpu_min_benchmark:
            mask[i] = False
        if r["ram_gb"] < prefs.ram_min_gb:
            mask[i] = False
        if r["storage_gb"] < prefs.storage_min_gb:
            mask[i] = False
        if r["weight_kg"] > prefs.weight_max_kg:
            mask[i] = False
        if r["battery_wh"] < prefs.battery_min_wh:
            mask[i] = False

    idxs = np.where(mask)[0]
    if len(idxs) == 0:
        return {"recommendations": [], "total_matched": 0, "mode": prefs.mode}

    filtered_vectors = vectors[idxs]
    filtered_records = [records[i] for i in idxs]

    # ---- Step 2: Build user vector ----
    user_vector, weights = build_user_vector(
        prefs.dict(),
        state["scaler"],
        state["encoder"],
        feature_cols,
    )

    # ---- Step 3: Compute similarity ----
    if prefs.metric == "euclidean":
        distances = euclidean_distance(user_vector, filtered_vectors)
        scores = 1.0 / (1.0 + distances)
    else:
        scores = weighted_cosine_similarity(user_vector, filtered_vectors, weights)

    # ---- Step 4: Sort and take top K ----
    top_k = min(prefs.top_k, len(scores))
    top_indices = np.argsort(scores)[::-1][:top_k]

    # ---- Step 5: Build response ----
    recommendations = []
    for i in top_indices:
        rec = filtered_records[int(i)]
        score = float(scores[int(i)])
        if not np.isfinite(score):
            score = 0.0
        recommendations.append({
            "id": rec["id"],
            "brand": rec["brand"],
            "model": rec["model"],
            "category": rec["category"],
            "cpu_model": rec["cpu_model"],
            "cpu_benchmark": rec["cpu_benchmark"],
            "gpu_model": rec["gpu_model"],
            "gpu_benchmark": rec["gpu_benchmark"],
            "ram_gb": rec["ram_gb"],
            "storage_gb": rec["storage_gb"],
            "storage_type": rec["storage_type"],
            "display_size": rec["display_size"],
            "weight_kg": rec["weight_kg"],
            "battery_wh": rec["battery_wh"],
            "price_pkr": rec["price_pkr"],
            "similarity_score": round(score, 4),
        })

    return {
        "recommendations": recommendations,
        "total_matched": len(idxs),
        "mode": prefs.mode,
        "metric": prefs.metric,
    }
