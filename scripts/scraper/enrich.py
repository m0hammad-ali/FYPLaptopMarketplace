"""
Enrich scraped laptops with specifications.
Adds variation within categories so cosine vs Euclidean metrics
produce meaningfully different rankings.
"""

import random
from utils import log


CATEGORY_BASE = {
    'gaming': {
        'cpu_model': 'Intel Core i7 (12th Gen)',
        'cpu_benchmark': 24000,
        'gpu_model': 'NVIDIA RTX 3060',
        'gpu_benchmark': 16000,
        'ram_gb': 16,
        'storage_gb': 512,
        'storage_type': 'NVMe SSD',
        'display_size': 15.6,
        'weight_kg': 2.3,
        'battery_wh': 70,
    },
    'ultrabook': {
        'cpu_model': 'Intel Core i7 (13th Gen)',
        'cpu_benchmark': 17000,
        'gpu_model': 'Intel Iris Xe',
        'gpu_benchmark': 4000,
        'ram_gb': 16,
        'storage_gb': 512,
        'storage_type': 'NVMe SSD',
        'display_size': 13.5,
        'weight_kg': 1.3,
        'battery_wh': 60,
    },
    'workstation': {
        'cpu_model': 'Intel Core i9 (13th Gen)',
        'cpu_benchmark': 26000,
        'gpu_model': 'NVIDIA RTX 4060',
        'gpu_benchmark': 18000,
        'ram_gb': 32,
        'storage_gb': 1024,
        'storage_type': 'NVMe SSD',
        'display_size': 15.0,
        'weight_kg': 1.8,
        'battery_wh': 75,
    },
    'office': {
        'cpu_model': 'Intel Core i5 (12th Gen)',
        'cpu_benchmark': 15000,
        'gpu_model': 'Intel Iris Xe',
        'gpu_benchmark': 3000,
        'ram_gb': 16,
        'storage_gb': 512,
        'storage_type': 'NVMe SSD',
        'display_size': 14.0,
        'weight_kg': 1.5,
        'battery_wh': 55,
    },
    'everyday': {
        'cpu_model': 'Intel Core i5 (11th Gen)',
        'cpu_benchmark': 12000,
        'gpu_model': 'Intel UHD Graphics',
        'gpu_benchmark': 2500,
        'ram_gb': 8,
        'storage_gb': 256,
        'storage_type': 'SATA SSD',
        'display_size': 15.6,
        'weight_kg': 1.8,
        'battery_wh': 45,
    },
}


def enrich_laptop(laptop):
    """Add specs with realistic per-laptop variation."""
    category = laptop.get('category', 'everyday')
    specs = CATEGORY_BASE[category].copy()

    # Add random variation (±25%) to numeric features
    # Use a seed based on laptop ID for reproducibility
    seed = laptop.get('id', 0) or hash(laptop.get('model', '')) % 100000
    rng = random.Random(seed)

    def vary(value, pct=0.25):
        """Multiply value by a random factor in [1-pct, 1+pct]."""
        factor = rng.uniform(1 - pct, 1 + pct)
        return int(value * factor)

    specs['cpu_benchmark'] = vary(specs['cpu_benchmark'], 0.25)
    specs['gpu_benchmark'] = vary(specs['gpu_benchmark'], 0.25)
    specs['weight_kg'] = round(specs['weight_kg'] * rng.uniform(0.85, 1.15), 2)
    specs['battery_wh'] = vary(specs['battery_wh'], 0.20)
    specs['display_size'] = round(specs['display_size'] + rng.uniform(-0.5, 0.5), 1)

    # RAM variation (discrete steps)
    if rng.random() < 0.3:
        specs['ram_gb'] = specs['ram_gb'] * 2 if specs['ram_gb'] <= 16 else specs['ram_gb']

    # Storage variation
    if rng.random() < 0.4:
        specs['storage_gb'] = specs['storage_gb'] * 2

    # Apple silicon override
    if laptop.get('brand') == 'Apple':
        if 'pro' in laptop['model'].lower():
            specs['cpu_model'] = 'Apple M2 Pro'
            specs['cpu_benchmark'] = vary(24000, 0.10)
            specs['gpu_model'] = 'Apple M2 Pro GPU'
            specs['gpu_benchmark'] = vary(15000, 0.10)
        else:
            specs['cpu_model'] = 'Apple M2'
            specs['cpu_benchmark'] = vary(17000, 0.10)
            specs['gpu_model'] = 'Apple M2 GPU'
            specs['gpu_benchmark'] = vary(10000, 0.10)

    laptop['specification'] = specs
    laptop['release_year'] = 2023
    return laptop


def enrich_all(laptops):
    """Enrich every laptop in the list."""
    log.info(f'Enriching {len(laptops)} laptops with variation...')
    enriched = [enrich_laptop(l.copy()) for l in laptops]
    log.info(f'Enrichment complete')
    return enriched
