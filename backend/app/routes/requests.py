from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas
from app.auth import get_current_user
from app.muse_spark import MuseSparkService

router = APIRouter(prefix="/requests")

@router.post("", status_code=201)
def create_req(r: schemas.TravelRequestCreate, u: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    dest, lug = r.destination, r.luggage_count
    if r.natural_prompt:
        ex = MuseSparkService.parse_travel_prompt(r.natural_prompt)
        dest = dest or ex["destination"]
    req = models.TravelRequest(user_id=u.id, origin=r.origin, destination=dest, earliest_departure=r.earliest_departure, latest_arrival=r.latest_arrival, luggage_count=lug, raw_query=r.natural_prompt)
    db.add(req); db.commit(); db.refresh(req)
    return req

@router.get("/me")
def my_reqs(u: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(models.TravelRequest).filter_by(user_id=u.id).all()
