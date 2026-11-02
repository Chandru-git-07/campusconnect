from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas
from app import auth as auth_utils

router = APIRouter(prefix="/auth")

@router.post("/register", status_code=201)
def register(u: schemas.UserRegister, db: Session = Depends(get_db)):
    if db.query(models.User).filter_by(email=u.email).first():
        raise HTTPException(400, "Exists")
    user = models.User(email=u.email, name=u.name, hashed_password=auth_utils.get_password_hash(u.password))
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@router.post("/login")
def login(u: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter_by(email=u.email).first()
    if not user or not auth_utils.verify_password(u.password, user.hashed_password):
        raise HTTPException(401, "Invalid")
    return {
        "access_token": auth_utils.create_access_token({"sub": str(user.id)}), 
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email
        }
    }

@router.get("/me")
def get_current_user_profile(current_user: models.User = Depends(auth_utils.get_current_user)):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email
    }