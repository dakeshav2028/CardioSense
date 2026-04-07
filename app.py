"""
app.py — FastAPI backend for Heart Disease Risk Predictor.

Endpoints:
  POST /predict        → risk score + SHAP + recommendations
  GET  /history/{uid}  → trend data for a user
  GET  /docs           → auto-generated Swagger UI (free!)
"""

import os, joblib
import numpy as np
import pandas as pd
import shap

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from schemas import PredictRequest, PredictResponse, HistoryResponse, HistoryEntry, ShapFeature
from database import create_tables, get_db, Prediction
from recommender import get_recommendations

# ── Load artefacts once at startup ───────────────────────────
BASE = os.path.dirname(__file__)

model      = joblib.load(os.path.join(BASE, "best_rf_model.pkl"))
scaler     = joblib.load(os.path.join(BASE, "scaler.pkl"))
explainer  = joblib.load(os.path.join(BASE, "shap_explainer.pkl"))
feat_cols  = joblib.load(os.path.join(BASE, "feature_columns.pkl"))

# ── App setup ────────────────────────────────────────────────
app = FastAPI(
    title="Heart Disease Risk Predictor API",
    description="ML-powered cardiovascular risk scoring with SHAP explainability",
    version="1.0.0"
)

# Allow React dev server (and future production domain) to call the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup():
    create_tables()


# ── Helper: build a feature DataFrame from request ───────────
def build_feature_df(data: PredictRequest) -> pd.DataFrame:
    raw = {
        "age":      data.age,
        "sex":      data.sex,
        "cp":       data.cp,
        "trestbps": data.trestbps,
        "chol":     data.chol,
        "fbs":      data.fbs,
        "restecg":  data.restecg,
        "thalach":  data.thalach,
        "exang":    data.exang,
        "oldpeak":  data.oldpeak,
        "slope":    data.slope,
        "ca":       data.ca,
        "thal":     data.thal,
    }
    df = pd.DataFrame([raw])

    # Convert categoricals to match the training data's float-based one-hot encoding (e.g. sex_1.0, cp_0.0)
    categorical_cols = ['sex', 'cp', 'fbs', 'restecg', 'exang', 'slope', 'thal']
    for col in categorical_cols:
        df[col] = df[col].astype(float).astype(str)

    # One-hot encode
    df = pd.get_dummies(df, columns=categorical_cols)

    # Align with training feature set (adds missing cols as 0, drops unexpected ones)
    df = df.reindex(columns=feat_cols, fill_value=0)

    # Scale only the features the scaler was trained on
    df_scaled = df.copy()
    num_cols = list(scaler.feature_names_in_)
    df_scaled[num_cols] = scaler.transform(df_scaled[num_cols])
    return df, df_scaled


# ── POST /predict ─────────────────────────────────────────────
@app.post("/predict", response_model=PredictResponse, tags=["Prediction"])
def predict(request: PredictRequest, db: Session = Depends(get_db)):
    """
    Accepts patient input → returns risk score, SHAP explanation,
    and personalised recommendations. Saves result to DB.
    """
    df_raw, df_scaled = build_feature_df(request)

    # Risk probability
    risk_prob = float(model.predict_proba(df_scaled)[0][1])

    # SHAP values
    try:
        shap_vals = explainer.shap_values(df_scaled)
        # For binary classifiers shap_values returns [neg, pos]
        if isinstance(shap_vals, list):
            sv = shap_vals[1][0]
        else:
            sv = shap_vals[0]

        # Top 10 features by absolute SHAP value
        pairs = sorted(zip(feat_cols, sv), key=lambda x: abs(x[1]), reverse=True)[:10]
        shap_features = [ShapFeature(feature=f, value=round(float(v), 4)) for f, v in pairs]
    except Exception:
        shap_features = []

    # Recommendations
    input_dict = request.model_dump()
    rec_result = get_recommendations(input_dict, risk_prob)

    # Save to DB
    record = Prediction(
        user_id    = request.user_id,
        age        = request.age,
        risk_score = rec_result["risk_score"],
        risk_level = rec_result["risk_level"],
        trestbps   = request.trestbps,
        chol       = request.chol,
        thalach    = request.thalach,
        oldpeak    = request.oldpeak,
        fbs        = request.fbs,
        exang      = request.exang,
        cp         = request.cp,
        ca         = request.ca,
    )
    db.add(record)
    db.commit()

    return PredictResponse(
        user_id         = request.user_id,
        risk_score      = rec_result["risk_score"],
        risk_level      = rec_result["risk_level"],
        alert           = rec_result["alert"],
        recommendations = rec_result["recommendations"],
        shap_features   = shap_features,
    )


# ── GET /history/{user_id} ────────────────────────────────────
@app.get("/history/{user_id}", response_model=HistoryResponse, tags=["History"])
def get_history(user_id: str, db: Session = Depends(get_db)):
    """
    Returns all past predictions for a user_id (used for trend chart).

    Future upgrade: replace user_id path param with JWT token → decode → fetch.
    """
    records = (
        db.query(Prediction)
        .filter(Prediction.user_id == user_id)
        .order_by(Prediction.timestamp.asc())
        .all()
    )
    if not records:
        raise HTTPException(status_code=404, detail=f"No history found for user '{user_id}'")

    entries = [HistoryEntry.model_validate(r) for r in records]
    return HistoryResponse(user_id=user_id, count=len(entries), entries=entries)


# ── GET / (health check) ──────────────────────────────────────
@app.get("/", tags=["Health"])
def root():
    return {"status": "ok", "message": "Heart Disease Risk Predictor API is running 🫀"}
