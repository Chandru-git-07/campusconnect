from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routes import auth, requests, match, groups, dashboard

Base.metadata.create_all(bind=engine)
app = FastAPI(title="CampusConnect Backend API")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"],)
for r in [auth.router, requests.router, match.router, groups.router, dashboard.router]: app.include_router(r)

@app.get("/")
def root(): return {"message": "CampusConnect backend is running"}
