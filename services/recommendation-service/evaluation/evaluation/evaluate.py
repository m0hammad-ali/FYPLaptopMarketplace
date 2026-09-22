"""
Precision@K evaluation using CATEGORY as ground truth.

For each usage type, the relevant laptops are all catalog laptops
whose category matches the intended usage.

Mapping:
    gaming      -> gaming
    office      -> office
    ultrabook   -> ultrabook
    workstation -> workstation
    everyday    -> everyday
"""

import json
import requests
import sys
import os

API_URL = os.getenv("API_URL", "http://localhost:5004/recommend")
CATALOG_URL = os.getenv("CATALOG_URL", "http://catalog-service:5002/laptops")

USAGE_TO_CATEGORY = {
    "gaming": "gaming",
    "office": "office",
    "ultrabook": "ultrabook",
    "workstation": "workstation",
    "everyday": "everyday",
}


def precision_at_k(recommended_ids, relevant_ids, k):
    top_k = recommended_ids[:k]
    if not top_k:
        return 0.0
    hits = sum(1 for r in top_k if r in relevant_ids)
    return hits / len(top_k)


def recall_at_k(recommended_ids, relevant_ids, k):
    top_k = recommended_ids[:k]
    if not relevant_ids:
        return 0.0
    hits = sum(1 for r in top_k if r in relevant_ids)
    return hits / len(relevant_ids)


def fetch_catalog():
    r = requests.get(CATALOG_URL, timeout=15)
    return r.json()


def build_category_map(laptops):
    """Map category -> set of laptop IDs."""
    cat_map = {}
    for l in laptops:
        cat = l.get("category", "unknown")
        cat_map.setdefault(cat, set()).add(l["id"])
    return cat_map


def evaluate(metric="cosine"):
    catalog = fetch_catalog()
    cat_map = build_category_map(catalog)
    print(f"Catalog: {len(catalog)} laptops in {len(cat_map)} categories")
    for c, ids in sorted(cat_map.items()):
        print(f"  {c}: {len(ids)} laptops")

    with open("validation_set.json") as f:
        validation = json.load(f)

    totals = {"precision@3": 0.0, "precision@5": 0.0, "recall@3": 0.0, "recall@5": 0.0}
    per_query = []

    for i, item in enumerate(validation, 1):
        query = {**item["query"], "metric": metric}
        usage = query["usage"]
        target_cat = USAGE_TO_CATEGORY.get(usage, "everyday")
        relevant = cat_map.get(target_cat, set())

        try:
            response = requests.post(API_URL, json=query, timeout=15)
            recs = response.json().get("recommendations", [])
        except Exception as e:
            print(f"Query {i} error: {e}")
            continue

        rec_ids = [r["id"] for r in recs]

        p3 = precision_at_k(rec_ids, relevant, 3)
        p5 = precision_at_k(rec_ids, relevant, 5)
        r3 = recall_at_k(rec_ids, relevant, 3)
        r5 = recall_at_k(rec_ids, relevant, 5)

        totals["precision@3"] += p3
        totals["precision@5"] += p5
        totals["recall@3"] += r3
        totals["recall@5"] += r5

        per_query.append({
            "query": i,
            "usage": usage,
            "target_category": target_cat,
            "relevant_count": len(relevant),
            "top_3": rec_ids[:3],
            "top_5": rec_ids[:5],
            "precision@3": round(p3, 3),
            "precision@5": round(p5, 3),
            "recall@3": round(r3, 3),
            "recall@5": round(r5, 3),
        })

        print(f"  Query {i} ({usage}): P@3={p3:.2f}  P@5={p5:.2f}  R@3={r3:.2f}  R@5={r5:.2f}")

    n = len(validation)
    averages = {k: round(v / n, 3) for k, v in totals.items()}

    return averages, per_query


if __name__ == "__main__":
    metric = sys.argv[1] if len(sys.argv) > 1 else "cosine"

    print(f"=== Evaluating with metric: {metric} ===")
    avg, per_query = evaluate(metric)

    print("\n=== Summary ===")
    for k, v in avg.items():
        print(f"  {k}: {v}")

    output = {"metric": metric, "averages": avg, "per_query": per_query}
    with open(f"evaluation_results_{metric}.json", "w") as f:
        json.dump(output, f, indent=2)

    print(f"\nSaved to evaluation_results_{metric}.json")
