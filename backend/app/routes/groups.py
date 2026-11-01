from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import models
from app.auth import get_current_user

router = APIRouter(prefix="/groups")

@router.get("/proposals")
def get_props(u: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(models.GroupProposal).join(models.GroupMember).filter_by(user_id=u.id).all()

@router.post("/{id}/accept")
def accept_prop(id: int, u: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    m = db.query(models.GroupMember).filter_by(group_id=id, user_id=u.id).first()
    if not m: raise HTTPException(404)
    m.accepted = True; m.group.status = "ACCEPTED"; db.commit()
    return {"status": "ACCEPTED"}

@router.get("/{id}/split")
def split(id: int, u: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    g = db.query(models.GroupProposal).filter_by(id=id).first()
    c = len(g.members) if g and g.members else 1
    return {"group_id": id, "total_fare": 600.0, "member_count": c, "fare_per_member": round(600.0/c, 2), "savings_per_member": round(600.0 - 600.0/c, 2)}
