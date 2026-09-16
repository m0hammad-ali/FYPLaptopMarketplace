"""
Scraper configuration.
All URLs, headers, and rate limits are centralized here.
"""

# HTTP headers - mimic a real browser
HEADERS = {
    'User-Agent': (
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
        'AppleWebKit/537.36 (KHTML, like Gecko) '
        'Chrome/120.0.0.0 Safari/537.36'
    ),
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    'Connection': 'keep-alive',
}

# Rate limiting (in seconds)
MIN_DELAY_SECONDS = 2
MAX_DELAY_SECONDS = 4
REQUEST_TIMEOUT = 15
MAX_RETRIES = 3

# Target laptop count
TARGET_COUNT = 120

# Sources
SOURCES = {
    'priceoye': {
        'base': 'https://priceoye.pk',
        'laptops': 'https://priceoye.pk/laptops',
    },
    'whatmobile': {
        'base': 'https://www.whatmobile.com.pk',
        'laptops': 'https://www.whatmobile.com.pk/laptops',
    },
}

# Output paths
OUTPUT_JSON = 'output/laptops_raw.json'
OUTPUT_ENRICHED = 'output/laptops_enriched.json'
