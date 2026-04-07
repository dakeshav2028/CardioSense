# Production Deployment Walkthrough

I have successfully prepared the entire codebase for deployment! Here is exactly how to get your app live on the internet using the exact tech stack we discussed.

## What was Changed
1. **Requirements locked:** Generarted `requirements.txt` tracking exactly our Python versions and XGBoost models.
2. **PostgreSQL added:** Installed `psycopg2-binary` and upgraded the `database.py` file to seamlessly connect to Supabase instead of SQLite when isolated in production.
3. **Frontend API variables:** Modified the React UI (`Predict.jsx`, `TrendChart.jsx`) to point at dynamic environments.
4. **Deploy files:** Created `.gitignore` and a `Procfile` required by backend hosts.

---

## 🚀 Step 1: Upload to GitHub

First, you need to sync your local folder to GitHub.

1. Create a completely empty, public or private repository on **GitHub.com**.
2. Open your terminal in the `heart_diseases` folder.
3. Run the following commands:
```bash
git init
git add .
git commit -m "Ready for production deploy"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

---

## 🗄️ Step 2: Database (Supabase)

1. Go to [Supabase](https://supabase.com/) and create a free project.
2. Go to **Project Settings** (gear icon) → **Database**.
3. Scroll down to Find your **Connection String (URI)**.
4. Ensure it starts with `postgresql://...` and copy it down. (Replace `[YOUR-PASSWORD]` with the password you set).

---

## ⚙️ Step 3: Backend Server (Render)

1. Go to [Render](https://render.com/) and create a free account.
2. Click **New +** and select **Web Service**.
3. Select "Build and deploy from a Git repository", connect your GitHub account, and select the repo you made in Step 1.
4. **Configuration Details:**
   - **Name:** Whatever you want (e.g. `heart-risk-api`)
   - **Environment:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app:app --host 0.0.0.0 --port $PORT`
5. **Environment Variables:**
   - Add a new variable:
     - **Key:** `DATABASE_URL`
     - **Value:** *Paste the Supabase Connection String here*
6. Click **Create Web Service**. 

Render will now build your Python environment and launch FastAPI. **Copy the URL Render gives you when it's done (e.g., `https://heart-risk-api.onrender.com`).**

---

## 🖥️ Step 4: Frontend UI (Vercel)

Finally, we deploy the React application.

1. Go to [Vercel](https://vercel.com/) and create a free account.
2. Click **Add New Project**.
3. Import the same GitHub repository you created in Step 1.
4. **Configuration Details:**
   - **Framework Preset:** Vercel should auto-detect **Vite**.
   - **Root Directory:** Edit this and select the `frontend` folder (very important!).
5. **Environment Variables:**
   - Add a new variable:
     - **Key:** `VITE_API_URL`
     - **Value:** *Paste the Render URL from Step 3 here* (Make sure there is no trailing slash)
6. Click **Deploy**.

Vercel will quickly build the React app and give you a sleek, public URL you can instantly share with the world!
