import json
from pathlib import Path

import joblib
import pandas as pd
from flask import Flask, jsonify, request

BASE_DIR = Path(__file__).resolve().parent
MODEL_DIR = BASE_DIR / "models"

regressor = joblib.load(MODEL_DIR / "rent_regressor.joblib")
classifier = joblib.load(MODEL_DIR / "rent_classifier.joblib")
metadata = json.loads((MODEL_DIR / "columns.json").read_text())

app = Flask(__name__)


@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    return response


@app.get("/health")
def health():
    return jsonify({"status": "ok"})


@app.get("/models")
def models():
    return jsonify(metadata)


@app.post("/predict")
def predict():
    payload = request.get_json(silent=True) or {}
    errors = []

    try:
        bedrooms = int(payload.get("bedrooms"))
    except (TypeError, ValueError):
        bedrooms = None
        errors.append("bedrooms must be an integer")

    try:
        size = float(payload.get("size"))
    except (TypeError, ValueError):
        size = None
        errors.append("size must be a number")

    city = str(payload.get("city") or "").strip()
    furnishing = str(payload.get("furnishing") or "").strip()

    if bedrooms is not None and not 1 <= bedrooms <= 10:
        errors.append("bedrooms must be between 1 and 10")
    if size is not None and not 100 <= size <= 20000:
        errors.append("size must be between 100 and 20000")
    if city not in metadata["choices"]["city"]:
        errors.append("area is not supported")
    if furnishing not in metadata["choices"]["furnishing"]:
        errors.append("furnishing is not supported")

    if errors:
        return jsonify({"error": "Invalid input", "details": errors}), 400

    row = pd.DataFrame([{"bedrooms": bedrooms, "size": size, "city": city, "furnishing": furnishing}])
    predicted_rent = max(0.0, float(regressor.predict(row)[0]))
    category = str(classifier.predict(row)[0])

    return jsonify(
        {
            "predicted_rent": round(predicted_rent, 2),
            "category": category,
            "currency": metadata.get("currency", "KES"),
            "selected_models": metadata["selected_models"],
            "thresholds": metadata["thresholds"],
        }
    )


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
