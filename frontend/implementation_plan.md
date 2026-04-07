# Deployment Plan for Heart Disease Predictor

We have successfully completed development! Now it's time to transition the project from our local development environment into production so others can access it on the public internet. 

A modern Full-Stack application like this requires two distinct deployment targets: 
1. A server environment for the Python/FastAPI backend.
2. A static hosting environment for the React/Vite frontend.

## Proposed Changes

### 1. Backend Preparation (FastAPI)
The backend needs a few configuration files so hosting platforms know how to install and run the Python code.
*   **[NEW] `requirements.txt`**: We will generate this using `pip freeze` to lock all dependencies (FastAPI, xgboost, shap, scikit-learn, etc.).
*   **[NEW] `Procfile`**: Used by platforms like Heroku/Render to define the start command: `web: uvicorn app:app --host 0.0.0.0 --port $PORT`
*   **[NEW] `.gitignore`**: Ensure our virtual environment and raw `.csv` datasets aren't uploaded to production unexpectedly.

### 2. Frontend Preparation (React + Vite)
The frontend needs to know where the backend lives automatically based on the environment.
*   **[MODIFY] `frontend/src/config.js` or `App.jsx`**: Change the hardcoded `http://localhost:8000` to use an environment variable (e.g. `import.meta.env.VITE_API_URL`) so that in production, it points to your deployed backend URL.

### 3. Proposed Deployment Architecture
I recommend the following setup which is entirely **free**, developer-friendly, and very standard for this tech stack:

*   **Frontend**: Deploy to **Vercel** or **Netlify**. Both perfectly integrate with Vite and will give you a neat `.vercel.app` or `.netlify.app` URL.
*   **Backend**: Deploy to **Render.com**. Render natively supports Python web services and has a free tier that is excellent for hosting FastAPI ML models.

---

## 🚨 Open Questions

> [!CAUTION]
> **Database Persistence**
> Currently, the application uses an SQLite database (`heart_risk.db`) stored as a local file. On free hosting tiers like Render, the file system is "ephemeral"—meaning every time the server restarts, the database is wiped clean. 
> *   **Option A:** Accept this consequence. (Fine if this is just a portfolio piece or demo).
> *   **Option B:** Swap SQLite for a free cloud Postgres database (e.g., Supabase or Neon). I can handle the migration easily using SQLAlchemy. Which do you prefer?

> [!IMPORTANT]
> **Deployment Platforms**
> Are you comfortable using **Render** (for the backend) and **Vercel** (for the frontend)? Have you used them before, or would you prefer a different platform (like Railway, Heroku, or PythonAnywhere)?

## Verification Plan
1. Launch local builds of the frontend to verify environment variables load correctly.
2. Confirm the exact package versions in `requirements.txt`.
3. Provide you with the step-by-step UI instructions for pushing code to GitHub and clicking "Deploy" on the hosting sites.
