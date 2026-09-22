import numpy as np
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.similarity import weighted_cosine_similarity, euclidean_distance


def test_identical_vectors_give_similarity_one():
    """Cosine similarity of a vector with itself should be 1.0."""
    v = np.array([1.0, 2.0, 3.0])
    weights = np.ones(3)
    scores = weighted_cosine_similarity(v, np.array([v]), weights)
    assert abs(scores[0] - 1.0) < 1e-6, f"Expected 1.0, got {scores[0]}"
    print("  ✓ test_identical_vectors_give_similarity_one")


def test_orthogonal_vectors_give_zero():
    """Orthogonal vectors should have 0 similarity."""
    user = np.array([1.0, 0.0, 0.0])
    laptops = np.array([[0.0, 1.0, 0.0]])
    scores = weighted_cosine_similarity(user, laptops, np.ones(3))
    assert abs(scores[0]) < 1e-6, f"Expected 0.0, got {scores[0]}"
    print("  ✓ test_orthogonal_vectors_give_zero")


def test_weighted_effect():
    """Weighted cosine should change rankings vs unweighted."""
    user = np.array([0.9, 0.1])
    laptops = np.array([[0.5, 0.5], [0.1, 0.9]])
    weights = np.array([3.0, 0.1])
    scores = weighted_cosine_similarity(user, laptops, weights)
    assert scores[0] > scores[1], "Weighted similarity should favor first laptop"
    print("  ✓ test_weighted_effect")


def test_euclidean_identical():
    v = np.array([1.0, 2.0, 3.0])
    d = euclidean_distance(v, np.array([v]))
    assert d[0] < 1e-6
    print("  ✓ test_euclidean_identical")


def test_nan_safety():
    """NaN in user vector should not produce NaN scores."""
    user = np.array([1.0, np.nan, 3.0])
    laptops = np.array([[1.0, 2.0, 3.0]])
    scores = weighted_cosine_similarity(user, laptops, np.ones(3))
    assert np.isfinite(scores[0]), f"Score should be finite, got {scores[0]}"
    print("  ✓ test_nan_safety")


def run_all():
    print("Running similarity tests...")
    test_identical_vectors_give_similarity_one()
    test_orthogonal_vectors_give_zero()
    test_weighted_effect()
    test_euclidean_identical()
    test_nan_safety()
    print("\n✅ All similarity tests passed")


if __name__ == "__main__":
    run_all()
