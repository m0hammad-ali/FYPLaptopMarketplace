"""
Precision@K evaluation for the recommendation engine.

For each validation query:
1. Call /recommend
2. Compare returned IDs to ground-truth relevant IDs
3. Compute Precision@3, Precision@5, Recall@3, Recall@5

Output: evaluation_results.json
"""

import json
import requests
import sys
import os

API_URL = os.getenv("API_URL", "http://localhost:5004/recommend")


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


def evaluate(metric="cosine"):
    with open("validation_set.json") as f:
        validation = json.load(f)

    totals = {
        "precision@3": 0.0,
        "precision@5": 0.0,
        "recall@3": 0.0,
        "recall@5": 0.0,
    }

    per_query_results = []

    for i, item in enumerate(validation, 1):
        query = {**item["query"], "metric": metric}
        relevant = set(item["relevant_ids"])

        try:
            response = requests.post(API_URL, json=query, timeout=15)
            if response.status_code != 200:
                print(f"Query {i} failed: HTTP {response.status_code}")
                continue
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

        per_query_results.append({
            "query": i,
            "relevant": sorted(relevant),
            "top_3": rec_ids[:3],
            "top_5": rec_ids[:5],
            "precision@3": round(p3, 3),
            "precision@5": round(p5, 3),
            "recall@3": round(r3, 3),
            "recall@5": round(r5, 3),
        })

        print(f"  Query {i}: P@3={p3:.2f}  P@5={p5:.2f}  R@3={r3:.2f}  R@5={r5:.2f}")

    n = len(validation)
    averages = {k: round(v / n, 3) for k, v in totals.items()}

    return averages, per_query_results


if __name__ == "__main__":
    metric = sys.argv[1] if len(sys.argv) > 1 else "cosine"

    print(f"=== Evaluating with metric: {metric} ===")
    avg, per_query = evaluate(metric)

    print("\n=== Summary ===")
    for k, v in avg.items():
        print(f"  {k}: {v}")

    output = {
        "metric": metric,
        "averages": avg,
        "per_query": per_query,
    }

    output_file = f"evaluation_results_{metric}.json"
    with open(output_file, "w") as f:
        json.dump(output, f, indent=2)

    print(f"\nSaved to {output_file}")
