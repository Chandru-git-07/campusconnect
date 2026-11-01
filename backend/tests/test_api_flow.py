from datetime import datetime, timedelta
from fastapi.testclient import TestClient
from app.main import app
from app.matching_engine import evaluate_match_safety
from app.models import TravelRequest

client = TestClient(app)

def test_deterministic_safety_engine():
    now = datetime.utcnow()
    r1 = TravelRequest(user_id=1, earliest_departure=now, latest_arrival=now + timedelta(hours=2))
    r2 = TravelRequest(user_id=2, earliest_departure=now + timedelta(minutes=10), latest_arrival=now + timedelta(hours=2))
    assert evaluate_match_safety([r1, r2])["is_safe"] is True
    ru = TravelRequest(user_id=3, earliest_departure=now, latest_arrival=now + timedelta(minutes=40))
    assert evaluate_match_safety([r1, ru])["is_safe"] is False

def test_auth_and_requests_flow():
    email = f"test_{datetime.utcnow().timestamp()}@srmist.edu.in"
    reg = client.post("/auth/register", json={"email": email, "name": "Test", "password": "pass123"})
    assert reg.status_code == 201
    token = client.post("/auth/login", json={"email": email, "password": "pass123"}).json()["access_token"]
    now = datetime.utcnow()
    req = client.post("/requests", headers={"Authorization": f"Bearer {token}"}, json={"origin": "Gate 1", "destination": "Central Railway Station", "earliest_departure": now.isoformat(), "latest_arrival": (now + timedelta(hours=3)).isoformat(), "luggage_count": 1})
    assert req.status_code == 201
