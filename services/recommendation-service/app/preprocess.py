"""
Preprocessing module.

Fetches laptops from the catalog service and builds a feature matrix
suitable for cosine similarity computation.

Pipeline:
    1. Fetch JSON from Catalog Service
    2. Flatten nested 'Specification' object
    3. Fill missing numeric values with column median
    4. MinMax scale numeric features to [0, 1]
    5. OneHot encode categorical features
    6. Compute derived features (performance_index, portability, price_performance)
    7. Sanitize NaN/inf values
"""

import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler, OneHotEncoder


def preprocess_laptops(laptops):
    """
    Build feature matrix from raw laptop JSON.

    Args:
        laptops: list of dicts from Catalog Service.
                 Each has {id, brand, model, release_year, category, Specification: {...}}

    Returns:
        (df, feature_cols, scaler, encoder, records)
        or (None, None, None, None, None) if input is empty
    """
    if not laptops:
        return None, None, None, None, None

    # ---- Step 1: Flatten nested specification data ----
    flat = []
    for laptop in laptops:
        spec = laptop.get("Specification", {}) or {}
        flat.append({
            "id": laptop["id"],
            "brand": laptop.get("brand", "Unknown"),
            "model": laptop.get("model", "Unknown"),
            "category": laptop.get("category", "everyday"),
            "cpu_benchmark": spec.get("cpu_benchmark", 0) or 0,
            "gpu_benchmark": spec.get("gpu_benchmark", 0) or 0,
            "ram_gb": spec.get("ram_gb", 8) or 8,
            "storage_gb": spec.get("storage_gb", 256) or 256,
            "storage_type": spec.get("storage_type", "SSD") or "SSD",
            "display_size": spec.get("display_size", 14.0) or 14.0,
            "weight_kg": spec.get("weight_kg", 1.5) or 1.5,
            "battery_wh": spec.get("battery_wh", 50) or 50,
            "price_pkr": spec.get("price_pkr", 100000) or 100000,
            "cpu_model": spec.get("cpu_model", ""),
            "gpu_model": spec.get("gpu_model", ""),
        })

    df = pd.DataFrame(flat)

    # ---- Step 2: Handle missing values in numeric columns ----
    numeric_cols = [
        "cpu_benchmark", "gpu_benchmark", "ram_gb", "storage_gb",
        "display_size", "weight_kg", "battery_wh", "price_pkr",
    ]
    for col in numeric_cols:
        df[col] = pd.to_numeric(df[col], errors="coerce")
        if df[col].isna().any():
            df[col] = df[col].fillna(df[col].median())

    # ---- Step 3: MinMax scale numeric features ----
    scaler = MinMaxScaler()
    scaled = scaler.fit_transform(df[numeric_cols])
    # Guard against zero-variance columns producing NaN
    scaled = np.nan_to_num(scaled, nan=0.0, posinf=1.0, neginf=0.0)
    df[numeric_cols] = scaled

    # ---- Step 4: OneHot encode categorical features ----
    cat_cols = ["brand", "category", "storage_type"]
    for col in cat_cols:
        df[col] = df[col].fillna("unknown").astype(str)

    encoder = OneHotEncoder(sparse_output=False, drop="first", handle_unknown="ignore")
    encoded = encoder.fit_transform(df[cat_cols])
    encoded_cols = encoder.get_feature_names_out(cat_cols)
    encoded_df = pd.DataFrame(encoded, columns=encoded_cols)
    df = pd.concat([df, encoded_df], axis=1)

    # ---- Step 5: Derived features ----
    df["performance_index"] = (df["cpu_benchmark"] + df["gpu_benchmark"]) / 2
    # Portability = inverse of weight (lighter is better)
    df["portability"] = 1.0 / df["weight_kg"].replace(0, np.nan)
    df["portability"] = df["portability"].fillna(0)
    # Price-performance = higher perf per rupee is better
    df["price_performance"] = df["performance_index"] / (df["price_pkr"] + 1e-6)

    # ---- Step 6: Assemble final feature list ----
    feature_cols = (
        numeric_cols
        + list(encoded_cols)
        + ["performance_index", "portability", "price_performance"]
    )

    # ---- Step 7: Final NaN/inf safety net ----
    df[feature_cols] = (
        df[feature_cols]
        .replace([np.inf, -np.inf], 0)
        .fillna(0)
    )

    return df, feature_cols, scaler, encoder, flat
