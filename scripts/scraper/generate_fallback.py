"""
Fallback dataset generator.
Creates 120 realistic laptops with PKR prices.
Use if the web scraper is blocked or fails.
"""

import json
import random

BRANDS = ['HP', 'Dell', 'Lenovo', 'Asus', 'Acer', 'Apple', 'MSI', 'Razer']

MODEL_PREFIXES = {
    'HP': ['Pavilion', 'Envy', 'Spectre', 'Omen', 'ProBook'],
    'Dell': ['XPS', 'Inspiron', 'Latitude', 'G15', 'Vostro'],
    'Lenovo': ['ThinkPad', 'IdeaPad', 'Legion', 'Yoga', 'LOQ'],
    'Asus': ['Zenbook', 'Vivobook', 'ROG Strix', 'TUF', 'ProArt'],
    'Acer': ['Aspire', 'Nitro', 'Predator', 'Swift', 'Extensa'],
    'Apple': ['MacBook Air', 'MacBook Pro'],
    'MSI': ['Prestige', 'Modern', 'Katana', 'Raider', 'Stealth'],
    'Razer': ['Blade 14', 'Blade 15', 'Blade 16'],
}

CATEGORIES = {
    'HP': ['everyday', 'office', 'ultrabook', 'gaming'],
    'Dell': ['everyday', 'office', 'gaming', 'workstation'],
    'Lenovo': ['office', 'everyday', 'gaming', 'ultrabook'],
    'Asus': ['ultrabook', 'everyday', 'gaming', 'workstation'],
    'Acer': ['everyday', 'gaming', 'office'],
    'Apple': ['ultrabook', 'workstation'],
    'MSI': ['gaming', 'workstation', 'ultrabook'],
    'Razer': ['gaming'],
}


def generate():
    laptops = []
    for i in range(120):
        brand = random.choice(BRANDS)
        prefix = random.choice(MODEL_PREFIXES[brand])
        model_num = random.choice([13, 14, 15, 16, 17])
        suffix = random.choice(['', ' Plus', ' Pro', ' Max', ' G' + str(random.randint(2, 9))])
        model = f'{prefix} {model_num}{suffix}'
        category = random.choice(CATEGORIES[brand])

        base_prices = {
            'everyday': (80000, 200000),
            'office': (120000, 300000),
            'ultrabook': (180000, 400000),
            'gaming': (200000, 550000),
            'workstation': (300000, 700000),
        }
        low, high = base_prices[category]
        price = random.randint(low, high)

        laptops.append({
            'brand': brand,
            'model': model,
            'category': category,
            'price_pkr': price,
            'source': 'fallback',
            'source_url': f'https://example.com/{brand.lower()}/{model.lower().replace(" ", "-")}',
        })

    with open('output/laptops_raw.json', 'w', encoding='utf-8') as f:
        json.dump(laptops, f, indent=2, ensure_ascii=False)

    print(f'Generated {len(laptops)} fallback laptops')


if __name__ == '__main__':
    generate()
