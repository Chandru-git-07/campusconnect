# CampusConnect Backend
FastAPI deadline-aware ride-pooling matching backend with Muse Spark intelligence.

## Setup Instructions

1. Navigate to backend:
   ```cmd
   cd backend
python -m venv venv
venv\Scriptsctivate
pip install -r requirements.txt
copy .env.example .env
pytest -v
python -m app.seed
uvicorn app.main:app --reload
