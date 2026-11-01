from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.auth import get_current_user

router = APIRouter(prefix="/dashboard")

@router.get("/stats")
def stats(u = Depends(get_current_user), db: Session = Depends(get_db)):
    return {"total_rides_matched": 1, "total_money_saved_inr": 400.0, "carbon_saved_kg": 4.2, "active_proposals": 1}
