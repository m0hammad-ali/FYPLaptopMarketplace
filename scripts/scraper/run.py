"""
Main scraper entry point.
Runs all scrapers, deduplicates, enriches, and saves to JSON.
"""

import json
import os
from scrape_priceoye import scrape_priceoye
from scrape_whatmobile import scrape_whatmobile
from enrich import enrich_all
from config import OUTPUT_JSON, OUTPUT_ENRICHED, TARGET_COUNT
from utils import log


def deduplicate(laptops):
    """Remove duplicates based on normalized brand+model key."""
    seen = set()
    unique = []
    for laptop in laptops:
        key = f"{laptop['brand']}-{laptop['model']}".lower().strip()
        if key not in seen:
            seen.add(key)
            unique.append(laptop)
    return unique


def main():
    log.info('=' * 60)
    log.info('Laptop Scraper - Starting')
    log.info('=' * 60)

    os.makedirs('output', exist_ok=True)
    all_laptops = []

    # Source 1: priceoye.pk
    log.info('')
    log.info('--- Source 1: priceoye.pk ---')
    try:
        priceoye_laptops = scrape_priceoye(pages=6)
        log.info(f'priceoye.pk returned {len(priceoye_laptops)} laptops')
        all_laptops.extend(priceoye_laptops)
    except Exception as e:
        log.error(f'priceoye.pk scraper failed: {e}')

    # Source 2: whatmobile.com.pk
    log.info('')
    log.info('--- Source 2: whatmobile.com.pk ---')
    try:
        whatmobile_laptops = scrape_whatmobile(pages=6)
        log.info(f'whatmobile.com.pk returned {len(whatmobile_laptops)} laptops')
        all_laptops.extend(whatmobile_laptops)
    except Exception as e:
        log.error(f'whatmobile.com.pk scraper failed: {e}')

    log.info('')
    log.info(f'Total scraped (before dedup): {len(all_laptops)}')

    # Deduplicate
    unique_laptops = deduplicate(all_laptops)
    log.info(f'After deduplication: {len(unique_laptops)}')

    # Trim to target count
    if len(unique_laptops) > TARGET_COUNT:
        unique_laptops = unique_laptops[:TARGET_COUNT]
        log.info(f'Trimmed to {TARGET_COUNT} laptops')

    # Save raw
    with open(OUTPUT_JSON, 'w', encoding='utf-8') as f:
        json.dump(unique_laptops, f, indent=2, ensure_ascii=False)
    log.info(f'Saved raw data to {OUTPUT_JSON}')

    # Enrich with specifications
    enriched = enrich_all(unique_laptops)

    # Save enriched
    with open(OUTPUT_ENRICHED, 'w', encoding='utf-8') as f:
        json.dump(enriched, f, indent=2, ensure_ascii=False)
    log.info(f'Saved enriched data to {OUTPUT_ENRICHED}')

    # Print summary
    log.info('')
    log.info('=' * 60)
    log.info('SUMMARY')
    log.info('=' * 60)
    log.info(f'Total laptops: {len(enriched)}')

    by_source = {}
    by_category = {}
    by_brand = {}
    for l in enriched:
        by_source[l['source']] = by_source.get(l['source'], 0) + 1
        by_category[l['category']] = by_category.get(l['category'], 0) + 1
        by_brand[l['brand']] = by_brand.get(l['brand'], 0) + 1

    log.info(f'By source: {by_source}')
    log.info(f'By category: {by_category}')
    log.info(f'Top brands: {dict(sorted(by_brand.items(), key=lambda x: -x[1])[:5])}')
    log.info('')


if __name__ == '__main__':
    main()
