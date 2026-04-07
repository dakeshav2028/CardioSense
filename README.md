<div align="center">
  <img src="frontend/public/icons.svg" alt="CardioSense Logo" width="120" />
  <h1>🫀 CardioSense</h1>
  <p><strong>A Modern, Machine Learning-Powered Cardiovascular Risk Predictor</strong></p>

  [![React](https://img.shields.io/badge/React-18-blue.svg?style=flat&logo=react)](https://reactjs.org/)
  [![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688.svg?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)
  [![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E.svg?style=flat&logo=supabase)](https://supabase.com/)
  [![SHAP](https://img.shields.io/badge/Explainable_AI-SHAP-FF5722.svg?style=flat)](https://shap.readthedocs.io/en/latest/)

</div>

<br>

## 🚀 Overview

CardioSense is a full-stack, end-to-end clinical assessment tool designed to predict cardiovascular disease risk with high accuracy. Moving beyond traditional "black-box" AI, CardioSense utilizes **SHAP (SHapley Additive exPlanations)** to provide transparent, human-readable insights revealing exactly *why* a specific risk score was calculated.

The platform pairs a robust Python/FastAPI machine learning engine with a stunning, highly-animated frontend built on React and Vite. 

> **Live Demo:** [View on Vercel](#) *(Add your Vercel link here!)*

---

## ✨ Key Features

*   **Intelligent Prediction Engine:** Powered by a tuned XGBoost/Random Forest pipeline trained on thousands of clinical records (combining UCI, Kaggle, and Framingham datasets).
*   **Explainable AI (XAI):** Generates real-time SHAP waterfall charts dynamically, translating dense model weights into easy-to-understand clinical feedback.
*   **Longitudinal Tracking:** Connects to a Supabase PostgreSQL database to save patient records, allowing users to track their cardiovascular risk trends over time via interactive Recharts.
*   **Modern, Accessible UI:** Features a sleek dark-mode glassmorphism design. Complex medical jargon (`trestbps`, `thalach`, etc.) is simplified into plain English with smart tooltips.
*   **Dynamic Clinical Forms:** Intelligent "Not Known/Skip" fallbacks ensure the backend handles missing or omitted data gracefully using median smart defaults.

---

## 🛠️ Architecture & Tech Stack

### Frontend (User Interface)
*   **Framework:** React 18 + Vite
*   **Styling:** Custom CSS with Glassmorphism dynamics and fully responsive grids
*   **Animations:** Framer Motion for buttery-smooth multi-step conditional form transitions
*   **Data Vis:** Recharts for longitudinal score tracking
*   **Deployment:** Vercel

### Backend (API & Inference)
*   **Framework:** FastAPI + Uvicorn
*   **Machine Learning:** Scikit-Learn, XGBoost
*   **Explainability:** SHAP TreeExplainer
*   **Database ORM:** SQLAlchemy
*   **Deployment:** Render

### Data Layer
*   **Database:** Supabase (PostgreSQL)
*   **Local Fallback:** SQLite (for local development)

---

## 💻 Running Locally

To run CardioSense on your own machine, you will need two terminal windows open—one for the Python server, and one for the React application.

### 1. Setup the Backend
Navigate to the root directory and activate the virtual environment:
```bash
# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate  # On Windows

# Install all locked dependencies
pip install -r requirements.txt

# Start the FastAPI server (runs on http://localhost:8000)
uvicorn app:app --reload --port 8000
```

### 2. Setup the Frontend
Open a second terminal, navigate into the `frontend` folder:
```bash
cd frontend

# Install Node modules
npm install

# Start the Vite development server
npm run dev
```
Navigate to `http://localhost:5173` in your browser to view the application!

---

## 🌍 Production Environment
CardioSense is configured with native environment parsing. 
*   **Database:** If `DATABASE_URL` is detected in the environment (e.g., via Supabase), the backend automatically switches from SQLite to PostgreSQL via `psycopg2-binary`.
*   **Frontend Routing:** If `VITE_API_URL` is set inside Vercel, the React app automatically re-routes its Axios calls to your cloud container instead of localhost.

---

<div align="center">
  <p>Built with ❤️ for better heart health.</p>
</div>
