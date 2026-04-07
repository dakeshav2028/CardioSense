"""
schemas.py — Pydantic models for request/response validation.

Design note: user_id is a plain string (name) now.
Future upgrade path → replace str with UUID and wire it to
an auth system (JWT/OAuth2) without touching the DB schema.
"""

from pydantic import BaseModel, Field, field_validator
from typing import Optional
from datetime import datetime


# ─────────────────────────────────────────────
# INPUT — what the frontend sends to /predict
# ─────────────────────────────────────────────
class PredictRequest(BaseModel):
    # ── Identification (login-ready: swap str → UUID later) ──
    user_id: str = Field(..., min_length=1, max_length=64, example="john_doe",
                         description="User identifier — will link to auth system in future")

    # ── Demographics ──────────────────────────────────────────
    age: int = Field(..., ge=18, le=100, example=55)
    sex: int = Field(..., ge=0, le=1, example=1,
                     description="0 = Female, 1 = Male")

    # ── Clinical measurements ─────────────────────────────────
    trestbps: int = Field(..., ge=80, le=220, example=130,
                          description="Resting blood pressure (mmHg)")
    chol: int = Field(..., ge=100, le=600, example=250,
                      description="Serum cholesterol (mg/dL)")
    fbs: int = Field(..., ge=0, le=1, example=0,
                     description="Fasting blood sugar > 120 mg/dL (1=yes)")
    thalach: int = Field(..., ge=60, le=220, example=150,
                         description="Maximum heart rate achieved")
    oldpeak: float = Field(..., ge=0.0, le=10.0, example=1.5,
                           description="ST depression induced by exercise")

    # ── Symptoms / test results ───────────────────────────────
    cp: int = Field(..., ge=0, le=3, example=0,
                    description="Chest pain type (0=typical angina, 1=atypical, 2=non-anginal, 3=asymptomatic)")
    restecg: int = Field(..., ge=0, le=2, example=0,
                         description="Resting ECG results")
    exang: int = Field(..., ge=0, le=1, example=0,
                       description="Exercise induced angina (1=yes)")
    slope: int = Field(..., ge=0, le=2, example=1,
                       description="Slope of peak exercise ST segment")
    ca: int = Field(..., ge=0, le=4, example=0,
                    description="Number of major vessels colored by fluoroscopy")
    thal: int = Field(..., ge=0, le=3, example=2,
                      description="Thalassemia (0=normal, 1=fixed defect, 2=reversible defect, 3=unknown)")

    @field_validator('user_id')
    @classmethod
    def strip_user_id(cls, v):
        return v.strip()


# ─────────────────────────────────────────────
# OUTPUT — what /predict returns
# ─────────────────────────────────────────────
class RecommendationItem(BaseModel):
    category: str
    finding: str
    action: str
    priority: str  # "High" | "Medium" | "Low"


class ShapFeature(BaseModel):
    feature: str
    value: float


class PredictResponse(BaseModel):
    user_id: str
    risk_score: float              # 0–100
    risk_level: str                # Low / Moderate / High / Critical
    alert: Optional[str]           # cardiologist warning if score ≥ 80
    recommendations: list[RecommendationItem]
    shap_features: list[ShapFeature]  # top 10 SHAP contributors


# ─────────────────────────────────────────────
# HISTORY — for trend chart
# ─────────────────────────────────────────────
class HistoryEntry(BaseModel):
    id: int
    user_id: str
    timestamp: datetime
    age: int
    risk_score: float
    risk_level: str

    class Config:
        from_attributes = True  # allows SQLAlchemy ORM → Pydantic


class HistoryResponse(BaseModel):
    user_id: str
    count: int
    entries: list[HistoryEntry]
