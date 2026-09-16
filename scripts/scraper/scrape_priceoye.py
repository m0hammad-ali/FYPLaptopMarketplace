"""Scraper for priceoye.pk - Pakistan's price comparison site."""

import requests
from bs4 import BeautifulSoup
from utils import (
    safe_get, polite_delay, clean_text, parse_price_pkr,
    guess_brand, guess_category, log,
)
from config import SOURCES


def scrape_priceoye(pages=6):
    """
    Scrape laptops from priceoye.pk across multiple pages.
    Returns list of dicts: {brand, model, category, price_pkr, source_url, source}
    """
    session = requests.Session()
    laptops = []
    base_url = SOURCES['priceoye']['laptops']

    for page in range(1, pages + 1):
        url = f'{base_url}?page={page}'
        log.info(f'[priceoye] Fetching page {page}')

        response = safe_get(session, url)
        if not response:
            log.warning(f'[priceoye] Failed to fetch page {page}')
            continue

        soup = BeautifulSoup(response.text, 'html.parser')

        # Try multiple selectors (site HTML may vary)
        cards = (
            soup.select('.productBox')
            or soup.select('.product-box')
            or soup.select('[data-testid="product-card"]')
            or soup.select('div.product-item')
        )

        if not cards:
            log.warning(f'[priceoye] No product cards on page {page}')
            # Debug: save HTML for inspection
            with open(f'output/debug_priceoye_p{page}.html', 'w', encoding='utf-8') as f:
                f.write(response.text)
            continue

        for card in cards:
            try:
                name_el = card.select_one('.productTitle, .product-title, h3, h4, a')
                price_el = card.select_one('.price-box, .price, [data-testid="price"]')
                link_el = card.select_one('a[href]')

                if not name_el or not price_el:
                    continue

                name = clean_text(name_el.get_text())
                price = parse_price_pkr(clean_text(price_el.get_text()))

                if not name or not price:
                    continue
                if price < 40000 or price > 1500000:
                    continue

                href = link_el['href'] if link_el else ''
                source_url = (
                    href if href.startswith('http')
                    else f'{SOURCES["priceoye"]["base"]}{href}'
                )

                laptops.append({
                    'brand': guess_brand(name),
                    'model': name,
                    'category': guess_category(name),
                    'price_pkr': price,
                    'source_url': source_url,
                    'source': 'priceoye',
                })
            except Exception as e:
                log.debug(f'Card parse error: {e}')
                continue

        log.info(f'[priceoye] Page {page} done. Total: {len(laptops)}')
        polite_delay()

    return laptops
