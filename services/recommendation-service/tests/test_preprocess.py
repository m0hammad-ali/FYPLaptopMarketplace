import sys
import os
import numpy as np

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.preprocess import preprocess_laptops


def make_laptop(id, brand, category, cpu, gpu, ram, price):
    return {
        "id": id,
        "brand": brand,
        "model": f"Model {id}",
        "category": category,
        "Specification": {
            "cpu_benchmark": cpu,
            "gpu_benchmark": gpu,
            "ram_gb": ram,
            "storage_gb": 512,
            "storage_type": "NVMe SSD",
            "display_size": 15.6,
            "weight_kg": 2.0,
            "battery_wh": 60,
            "price_pkr": price,
            "cpu_model": "Test CPU",
            "gpu_model": "Test GPU",
        },
    }


def test_preprocess_empty_input():
    df, cols, scaler, encoder, records = preprocess_laptops([])
    assert df is None
    print("  ✓ test_preprocess_empty_input")


def test_preprocess_returns_features():
    laptops = [
        make_laptop(1, "HP", "gaming", 20000, 15000, 16, 250000),
        make_laptop(2, "Dell", "office", 15000, 3000, 16, 180000),
        make_laptop(3, "Lenovo", "ultrabook", 14000, 3000, 8, 200000),
    ]
    df, cols, scaler, encoder, records = preprocess_laptops(laptops)
    assert df is not None
    assert len(cols) > 0
    assert len(records) == 3
    print(f"  ✓ test_preprocess_returns_features ({len(cols)} features, 3 laptops)")


def test_preprocess_no_nan():
    laptops = [
        make_laptop(1, "HP", "gaming", 20000, 15000, 16, 250000),
        make_laptop(2, "Dell", "office", 15000, 3000, 16, 180000),
    ]
    df, cols, *_ = preprocess_laptops(laptops)
    assert not df[cols].isna().any().any(), "Feature matrix must not contain NaN"
    print("  ✓ test_preprocess_no_nan")


def run_all():
    print("Running preprocess tests...")
    test_preprocess_empty_input()
    test_preprocess_returns_features()
    test_preprocess_no_nan()
    print("\n✅ All preprocess tests passed")


if __name__ == "__main__":
    run_all()
