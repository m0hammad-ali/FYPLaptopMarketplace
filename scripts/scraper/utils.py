"""Utility functions for the scraper."""

import time
import random
import logging
from config import HEADERS, MIN_DELAY_SECONDS, MAX_DELAY_SECONDS, REQUEST_TIMEOUT

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    datefmt='%H:%M:%S',
)
log = logging.getLogger(__name__)


def polite_delay():
    """Sleep between requests to avoid overloading the server."""
    delay = random.uniform(MIN_DELAY_SECONDS, MAX_DELAY_SECONDS)
    log.debug(f'Waiting {delay:.1f}s before next request')
    time.sleep(delay)


def safe_get(session, url, retries=3):
    """
    Perform a GET request with retries and error handling.
    Returns Response object or None on failure.
    """
    for attempt in range(1, retries + 1):
        try:
            response = session.get(url, headers=HEADERS, timeout=REQUEST_TIMEOUT)
            if response.status_code == 200:
                return response
            log.warning(f'HTTP {response.status_code} for {url} (attempt {attempt})')
        except Exception as e:
            log.warning(f'Request failed (attempt {attempt}): {e}')
        if attempt < retries:
            time.sleep(2 ** attempt)
    return None


def clean_text(text):
    """Normalize whitespace in scraped text."""
    if not text:
        return ''
    return ' '.join(text.strip().split())


def parse_price_pkr(text):
    """Extract numeric price from a string like 'Rs. 120,000'."""
    if not text:
        return None
    digits = ''.join(c for c in text if c.isdigit())
    return int(digits) if digits else None


def guess_brand(model_name):
    """Extract brand from a model name string."""
    known_brands = [
        'HP', 'Dell', 'Lenovo', 'Asus', 'Acer', 'Apple',
        'MSI', 'Razer', 'Samsung', 'Toshiba', 'Sony', 'Microsoft',
        'Huawei', 'Xiaomi', 'Infinix', 'Realme',
    ]
    for brand in known_brands:
        if brand.lower() in model_name.lower():
            return brand
    return 'Unknown'


def guess_category(model_name):
    """Classify a laptop into a category based on model name keywords."""
    name = model_name.lower()

    gaming_keywords = ['rog', 'legion', 'nitro', 'tuf', 'predator',
                       'omen', 'strix', 'katana', 'raider', 'helios']
    ultrabook_keywords = ['macbook air', 'xps', 'zenbook', 'spectre',
                          'yoga', 'swift', 'envy', 'thinkpad x1']
    workstation_keywords = ['macbook pro', 'precision', 'zbook',
                            'thinkpad p', 'proart', 'creator']
    office_keywords = ['thinkpad', 'probook', 'latitude', 'elitebook',
                       'ideapad', 'vivobook']

    for kw in gaming_keywords:
        if kw in name:
            return 'gaming'
    for kw in workstation_keywords:
        if kw in name:
            return 'workstation'
    for kw in ultrabook_keywords:
        if kw in name:
            return 'ultrabook'
    for kw in office_keywords:
        if kw in name:
            return 'office'
    return 'everyday'
