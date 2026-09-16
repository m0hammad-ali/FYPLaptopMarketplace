"""
User profile builder.

Converts user preferences into:
  - user_vector: shape (n_features,) — desired feature values
  - weights: shape (n_features,) — importance of each feature

Supports three literacy modes:
  - 'voice': minimal input (only usage + budget)
  - 'simple': plain-language input (usage, budget, portability)
  - 'pro': full technical input (all fields)
"""

import numpy as np


# Default desired values per usage type (in raw units, before scaling)
USAGE_DEFAULTS = {
    "gaming": {
        "cpu_benchmark": 25000,
        "gpu_benchmark": 18000,
        "ram_gb": 16,
        "storage_gb": 512,
        "display_size": 15.6,
        "weight_kg": 2.3,
        "battery_wh": 70,
    },
    "office": {
        "cpu_benchmark": 16000,
        "gpu_benchmark": 3000,
        "ram_gb": 16,
        "storage_gb": 512,
        "display_size": 14.0,
        "weight_kg": 1.5,
        "battery_wh": 55,
    },
    "ultrabook": {
        "cpu_benchmark": 15000,
        "gpu_benchmark": 3000,
        "ram_gb": 16,
        "storage_gb": 512,
        "display_size": 13.5,
        "weight_kg": 1.2,
        "battery_wh": 70,
    },
    "workstation": {
        "cpu_benchmark": 25000,
        "gpu_benchmark": 15000,
        "ram_gb": 32,
        "storage_gb": 1024,
        "display_size": 15.0,
        "weight_kg": 1.8,
        "battery_wh": 75,
    },
    "everyday": {
        "cpu_benchmark": 12000,
        "gpu_benchmark": 2500,
        "ram_gb": 8,
        "storage_gb": 256,
        "display_size": 15.6,
        "weight_kg": 1.8,
        "battery_wh": 45,
    },
}

# Feature weights per usage type
USAGE_WEIGHTS = {
    "gaming": {
        "gpu_benchmark": 2.0,
        "performance_index": 1.5,
        "price_performance": 1.2,
    },
    "office": {
        "cpu_benchmark": 1.8,
        "ram_gb": 1.5,
        "price_performance": 1.3,
    },
    "ultrabook": {
        "portability": 2.0,
        "battery_wh": 1.5,
        "weight_kg": 1.5,
    },
    "workstation": {
        "cpu_benchmark": 2.0,
        "ram_gb": 1.5,
        "gpu_benchmark": 1.5,
    },
    "everyday": {
        "price_performance": 1.5,
    },
}

# Numeric feature order (must match preprocess.py)
NUMERIC_FEATURES = [
    "cpu_benchmark", "gpu_benchmark", "ram_gb", "storage_gb",
    "display_size", "weight_kg", "battery_wh", "price_pkr",
]


def build_user_vector(prefs, scaler, encoder, feature_cols):
    """
    Build user vector and weights in the same feature space as laptops.

    Args:
        prefs: dict with user preferences (may include 'mode')
        scaler: MinMaxScaler fitted on laptop numeric features
        encoder: OneHotEncoder fitted on laptop categorical features
        feature_cols: list of feature column names

    Returns:
        (user_vector, weights)
    """
    mode = prefs.get("mode", "pro")
    usage = prefs.get("usage", "everyday")
    budget = prefs.get("budget", 200000)

    # ---- Build desired raw values ----
    desired = USAGE_DEFAULTS.get(usage, USAGE_DEFAULTS["everyday"]).copy()

    # Budget tightens the target price
    desired["price_pkr"] = budget * 0.85

    # Allow explicit overrides (Pro mode)
    for key in NUMERIC_FEATURES:
        if key in prefs and prefs[key] is not None and prefs[key] > 0:
            desired[key] = prefs[key]

    # In simple/voice mode, budget is the only numeric input
    if mode in ("voice", "simple"):
        desired["price_pkr"] = budget * 0.85

    # ---- Scale desired numeric values with the same scaler ----
    raw = [desired[col] for col in NUMERIC_FEATURES]
    try:
        scaled = scaler.transform([raw])[0]
    except Exception:
        scaled = np.zeros(len(NUMERIC_FEATURES))
    scaled = np.nan_to_num(scaled, nan=0.0, posinf=1.0, neginf=0.0)

    # ---- Initialize user vector and weights ----
    user_vector = np.zeros(len(feature_cols))
    weights = np.ones(len(feature_cols))

    # Set numeric values
    for i, col in enumerate(NUMERIC_FEATURES):
        if col in feature_cols:
            user_vector[feature_cols.index(col)] = scaled[i]

    # ---- Derived features ----
    cpu_s = scaled[NUMERIC_FEATURES.index("cpu_benchmark")]
    gpu_s = scaled[NUMERIC_FEATURES.index("gpu_benchmark")]
    wt_s = scaled[NUMERIC_FEATURES.index("weight_kg")]
    price_s = scaled[NUMERIC_FEATURES.index("price_pkr")]

    perf = (cpu_s + gpu_s) / 2.0
    port = 1.0 / (wt_s + 1e-6)
    price_perf = perf / (price_s + 1e-6)

    if "performance_index" in feature_cols:
        user_vector[feature_cols.index("performance_index")] = perf
    if "portability" in feature_cols:
        user_vector[feature_cols.index("portability")] = port
    if "price_performance" in feature_cols:
        user_vector[feature_cols.index("price_performance")] = price_perf

    # ---- Apply usage-based weights ----
    usage_w = USAGE_WEIGHTS.get(usage, {})
    for feature, w in usage_w.items():
        if feature in feature_cols:
            weights[feature_cols.index(feature)] = w

    # Lower weight on price — budget is a hard filter, not a similarity driver
    if "price_pkr" in feature_cols:
        weights[feature_cols.index("price_pkr")] = 0.5

    # ---- Categorical preferences ----
    brand_pref = prefs.get("brand_preference", "Any")
    if brand_pref and brand_pref != "Any":
        col = f"brand_{brand_pref}"
        if col in feature_cols:
            user_vector[feature_cols.index(col)] = 1.0
            weights[feature_cols.index(col)] = 2.0

    storage_pref = prefs.get("storage_type_preference", "Any")
    if storage_pref and storage_pref != "Any":
        col = f"storage_type_{storage_pref}"
        if col in feature_cols:
            user_vector[feature_cols.index(col)] = 1.0

    return user_vector, weights
