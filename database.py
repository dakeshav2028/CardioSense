"""
database.py — SQLAlchemy + SQLite setup.

Login-ready design:
  user_id is a plain VARCHAR now → later add a ForeignKey to a
  'users' table with hashed passwords / OAuth tokens.
  Zero schema change required for existing predictions.
"""

from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime
from sqlalchemy.orm import DeclarativeBase, sessionmaker
from datetime import datetime, timezone
import os

# ── Dynamic Database URL ────────────────────────────────────
DATABASE_URL = os.environ.get("DATABASE_URL", "sqlite:///./heart_risk.db")

# SQLAlchemy 1.4+ requires "postgresql://" instead of "postgres://"
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


# ── Prediction table ─────────────────────────────────────────
class Prediction(Base):
    __tablename__ = "predictions"

    id         = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id    = Column(String(64), index=True, nullable=False)
    timestamp  = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    age        = Column(Integer)
    risk_score = Column(Float)
    risk_level = Column(String(16))

    # ── Clinical snapshot (denormalized for simplicity) ───────
    trestbps   = Column(Integer)
    chol       = Column(Integer)
    thalach    = Column(Integer)
    oldpeak    = Column(Float)
    fbs        = Column(Integer)
    exang      = Column(Integer)
    cp         = Column(Integer)
    ca         = Column(Integer)

    # ── Future auth upgrade: just uncomment below and add migration ──
    # auth_user_id = Column(String(128), ForeignKey("users.id"), nullable=True)


def create_tables():
    """Creates all tables on startup — safe to call multiple times."""
    Base.metadata.create_all(bind=engine)


def get_db():
    """FastAPI dependency — yields a DB session, closes after request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
