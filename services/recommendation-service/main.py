from fastapi import FastAPI
import os

app = FastAPI(title="Recommendation Service")


@app.get("/health")
def health():
    return {"status": "ok", "service": "recommendation-service"}


@app.post("/recommend")
def recommend(prefs: dict):
    return {"message": "Recommendation engine coming soon", "received": prefs}
