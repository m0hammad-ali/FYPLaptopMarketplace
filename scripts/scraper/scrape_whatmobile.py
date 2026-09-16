"""Scraper for whatmobile.com.pk - Pakistani mobile/laptop marketplace."""

import requests
from bs4 import BeautifulSoup
from utils import (
    safe_get, polite_delay, clean_text, parse_price_pkr,
    guess_brand, guess_category, log,
)
from config import SOURCES


def scrape_whatmobile(pages=6):
    """
    Scrape laptops from whatmobile.com.pk.
    Returns list of dicts: {brand, model, category, price_pkr, source_url, source}
    """
    session = requests.Session()
    laptops = []
    base_url = SOURCES['whatmobile']['laptops']

    for page in range(1, pages + 1):
        url = f'{base_url}?page={page}'
        log.info(f'[whatmobile] Fetching page {page}')

        response = safe_get(session, url)
        if not response:
            log.warning(f'[whatmobile] Failed to fetch page {page}')
            continue

        soup = BeautifulSoup(response.text, 'html.parser')

        # Try multiple selectors
        items = (
            soup.select('ul.laptops-list li')
            or soup.select('.product-list .product-item')
            or soup.select('table.items tr')
            or soup.select('div.laptop-item')
        )

        if not items:
            log.warning(f'[whatmobile] No items on page {page}')
            with open(f'output/debug_whatmobile_p{page}.html', 'w', encoding='utf-8') as f:
                f.write(response.text)
            continue

        for item in items:
            try:
                name_el = item.select_one('a')
                price_el = item.select_one('.price, .product-price, td:last-child')

                if not name_el or not price_el:
                    continue

                name = clean_text(name_el.get_text())
                price = parse_price_pkr(clean_text(price_el.get_text()))

                if not name or not price:
                    continue
                if price < 40000 or price > 1500000:
                    continue

                href = name_el.get('href', '')
                source_url = (
                    href if href.startswith('http')
                    else f'{SOURCES["whatmobile"]["base"]}{href}'
                )

                laptops.append({
                    'brand': guess_brand(name),
                    'model': name,
                    'category': guess_category(name),
                    'price_pkr': price,
                    'source_url': source_url,
                    'source': 'whatmobile',
                })
            except Exception as e:
                log.debug(f'Item parse error: {e}')
                continue

        log.info(f'[whatmobile] Page {page} done. Total: {len(laptops)}')
        polite_delay()

    return laptops
