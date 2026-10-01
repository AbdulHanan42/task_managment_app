# Task Management

FastAPI, SQLAlchemy, and PostgreSQL API with a Vue 3/Vite frontend.

## Clone and run locally

Prerequisites: Python 3.10 or newer, Node.js 22 or newer, npm, and a PostgreSQL database.

1. Clone the repository and enter its directory:

   ```powershell
   git clone https://github.com/<owner>/<repository>.git
   cd <repository>
   ```

2. Create and activate a Python virtual environment, then install the backend dependencies:

   ```powershell
   py -m venv .venv
   .venv\Scripts\Activate.ps1
   pip install -r requirements.txt
   ```

   On macOS or Linux, activate it with `source .venv/bin/activate` instead.

3. Copy `.env.example` to `.env`, then edit it. Set `DB_CONNECTION` to your PostgreSQL URL and set `SECRET_KEY` to a unique random value. For example, generate one with `python -c "import secrets; print(secrets.token_hex(32))"`. Keep `.env` private; it is ignored by Git. SMTP settings are optional.

   ```powershell
   Copy-Item .env.example .env
   ```

4. Start the API. It creates missing tables on startup:

   ```powershell
   uvicorn main:app --reload
   ```

   The API and interactive documentation are available at `http://127.0.0.1:8000` and `http://127.0.0.1:8000/docs`.

5. In another terminal, configure and start the frontend:

   ```powershell
   cd frontend
   Copy-Item .env.example .env
   npm install
   npm run dev
   ```

   Open the local URL printed by Vite. `VITE_API_URL` defaults to `http://127.0.0.1:8000`; add the frontend origin to `CORS_ORIGINS` in the backend `.env` if you change the Vite port.

## Deploy on Render

The repository includes a Render Blueprint at `render.yaml`. To deploy, push the repository to GitHub, create a new Blueprint from that repository in Render, and apply the Blueprint. It provisions a PostgreSQL database, a Python API web service, and a static frontend site. The Blueprint configures the API URL and CORS origin for the named Render services and generates the API secret key.

The API starts with `uvicorn main:app --host 0.0.0.0 --port $PORT`; its current startup creates missing tables from the SQLAlchemy models. The frontend is built with `npm install && npm run build` and published from `frontend/dist`. Optional SMTP environment variables can be added to the API service in Render if registration emails are needed.

Render service names determine the default public hostnames in `render.yaml`. If you change the service names, update the API URL and CORS origin values there to match. Render's free PostgreSQL plan may have expiration or usage limits; choose a persistent plan for production data.

## Dependencies

- Backend: `requirements.txt`
- Frontend: `frontend/package.json`

The current Alembic history is not a complete initial migration for an empty database. The deployed API relies on SQLAlchemy `create_all` at startup; do not run `alembic upgrade head` against a fresh database until an initial schema migration is added.