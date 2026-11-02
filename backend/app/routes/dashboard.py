from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app import models
from app.auth import get_current_user

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/")
def get_dashboard(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    # Calculate live metrics dynamically from the database
    total_users = db.query(models.User).count()
    total_groups = db.query(models.GroupProposal).count() if hasattr(models, "GroupProposal") else 0
    total_requests = db.query(models.TravelRequest).count() if hasattr(models, "TravelRequest") else 0

    return {
        "status": "success",
        "user": {
            "id": current_user.id,
            "name": current_user.name,
            "email": current_user.email
        },
        "stats": {
            "total_users": total_users,
            "total_groups": total_groups,
            "total_requests": total_requests
        }
    }