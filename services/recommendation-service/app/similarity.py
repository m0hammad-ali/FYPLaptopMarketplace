"""
Similarity metrics for the recommendation engine.

- weighted_cosine_similarity: primary metric
- euclidean_distance: baseline for comparison (used in Day 12 evaluation)
"""

import numpy as np


def weighted_cosine_similarity(user_vector, laptop_vectors, weights):
    """
    Compute weighted cosine similarity between user vector and all laptops.

    Formula:
        sim(A, B) = (A·w) · (B·w) / (||A·w|| * ||B·w||)

    Higher values = more similar.

    Args:
        user_vector: shape (n_features,)
        laptop_vectors: shape (n_laptops, n_features)
        weights: shape (n_features,)

    Returns:
        scores: shape (n_laptops,), values in [0, 1]
    """
    weighted_user = user_vector * weights
    weighted_laptops = laptop_vectors * weights

    dot = np.dot(weighted_laptops, weighted_user)
    norm_user = np.linalg.norm(weighted_user)
    norm_laptops = np.linalg.norm(weighted_laptops, axis=1)

    denom = norm_user * norm_laptops
    denom = np.where(denom == 0, 1e-10, denom)

    scores = dot / denom
    # Guard against NaN/inf (would crash JSON serialization)
    scores = np.nan_to_num(scores, nan=0.0, posinf=1.0, neginf=0.0)
    return scores


def euclidean_distance(user_vector, laptop_vectors):
    """
    Compute Euclidean distance between user vector and all laptops.

    Lower values = more similar.
    Used as baseline for comparison in Day 12 evaluation.
    """
    diff = laptop_vectors - user_vector
    distances = np.linalg.norm(diff, axis=1)
    distances = np.nan_to_num(distances, nan=1e6, posinf=1e6, neginf=1e6)
    return distances
