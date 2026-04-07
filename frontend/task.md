# Deployment Implementation Checklist

- `[x]` **Backend Configuration**
  - `[x]` Install `psycopg2-binary` for Supabase compatibility
  - `[x]` Generate `requirements.txt`
  - `[x]` Update `database.py` to support `DATABASE_URL` env variable
  - `[x]` Create `Procfile`
- `[x]` **Frontend Configuration**
  - `[x]` Refactor hardcoded API URLs to use `import.meta.env.VITE_API_URL`
- `[x]` **Validation**
  - `[x]` Verify local execution still works with fallback environments
  - `[x]` Provide step-by-step deploy instructions using GitHub, Render, Supabase and Vercel.
