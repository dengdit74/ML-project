# House Rent Predictor

A full-stack machine learning project that predicts monthly house rent in **Kenya shillings (KES)** for Nairobi neighbourhoods and classifies it as **affordable**, **average** or **expensive**. It includes exploratory/training notebooks, a Flask prediction API, and a React + Vite frontend. The bundled data is an illustrative sample, not live market listings.

## Project structure

```text
house-rent-predictor/
├── data/
│   ├── rent.csv
│   └── clean_rent.csv
├── notebooks/
│   ├── 01_explore_and_clean.ipynb
│   └── 02_train_models.ipynb
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   └── models/
│       ├── rent_regressor.joblib
│       ├── rent_classifier.joblib
│       └── columns.json
├── frontend/
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── api.js
│       ├── styles.css
│       └── components/
│           ├── PredictForm.jsx
│           ├── ResultCard.jsx
│           └── ModelComparison.jsx
├── README.md
└── .gitignore
```

## Requirements

- Python 3.9+
- Node.js 20.19+ or 22.12+ (for Vite 8)
- npm

## Run the backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python app.py
```

The API runs at `http://localhost:5000`.

## Run the frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. The Vite dev server proxies `/api` to the Flask backend, so no extra configuration is needed locally.

For a production build:

```bash
npm run build
npm run preview
```

If the API is hosted elsewhere, set `VITE_API_URL` before starting Vite, for example:

```bash
VITE_API_URL=http://localhost:5000 npm run dev
```

## API

### `POST /predict`

```bash
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d '{"bedrooms": 2, "size": 1000, "city": "Runda", "furnishing": "Furnished"}'
```

Example response:

```json
{
  "category": "expensive",
  "currency": "KES",
  "predicted_rent": 129450.5,
  "selected_models": {
    "classifier": "Neural Network",
    "regressor": "Neural Network"
  },
  "thresholds": {
    "affordable_max": 15500.0,
    "average_max": 87500.0
  }
}
```

Other endpoints: `GET /health` and `GET /models`.

## Machine learning workflow

1. `01_explore_and_clean.ipynb` generates a deterministic sample of Nairobi listings for Kasarani, Kayole, Kileleshwa, Kitengela, Muthaiga and Runda, with monthly rents in KES. Replace this step with a real listings CSV when one is available.
2. The same notebook renames columns, keeps bedrooms, size, area, furnishing and rent, removes invalid rows, and trims the 1st/99th percentiles of size and rent.
3. `02_train_models.ipynb` creates category labels from rent terciles: up to KSh 15,500 is affordable, up to KSh 87,500 is average, above that is expensive.
4. Ridge, Lasso, KNN and an MLP neural network are compared for regression; Naive Bayes, KNN and an MLP neural network are compared for classification.
5. The best model of each type is refit on all cleaned rows and exported with `joblib`. Feature order, choices, currency, thresholds and comparison scores are stored in `columns.json`.

Held-out scores from the committed artifacts:

| Task | Model | Score |
| --- | --- | --- |
| Regression (R²) | Neural Network | 0.9495 |
| Classification (accuracy) | Neural Network | 0.9466 |

## Re-train the models

The trained artifacts are already included. To regenerate them:

```bash
jupyter nbconvert --to notebook --execute --inplace notebooks/01_explore_and_clean.ipynb
jupyter nbconvert --to notebook --execute --inplace notebooks/02_train_models.ipynb
```

Or open the notebooks in Jupyter and run all cells in order.
