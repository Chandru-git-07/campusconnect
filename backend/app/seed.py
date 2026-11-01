from datetime import datetime, timedelta
from app.database import SessionLocal, Base, engine
from app import models
from app.auth import get_password_hash

def seed_demo_data():
    Base.metadata.drop_all(bind=engine); Base.metadata.create_all(bind=engine); db = SessionLocal()
    u1 = models.User(email="alice@srmist.edu.in", name="Alice", hashed_password=get_password_hash("password123"))
    u2 = models.User(email="bob@srmist.edu.in", name="Bob", hashed_password=get_password_hash("password123"))
    db.add_all([u1, u2]); db.commit()
    t = datetime.utcnow() + timedelta(hours=2)
    db.add_all([models.TravelRequest(user_id=u1.id, origin="Gate 1", destination="Station", earliest_departure=t, latest_arrival=t+timedelta(hours=3)), models.TravelRequest(user_id=u2.id, origin="Gate 1", destination="Station", earliest_departure=t, latest_arrival=t+timedelta(hours=3))])
    db.commit(); db.close(); print("Demo seed data created successfully!")

if __name__ == "__main__": seed_demo_data()
