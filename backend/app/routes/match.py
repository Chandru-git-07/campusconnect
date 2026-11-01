from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from collections import defaultdict
from app.database import get_db
from app import models
from app.auth import get_current_user
from app.matching_engine import evaluate_match_safety, calculate_fare_split
from app.muse_spark import MuseSparkService

router = APIRouter(prefix="/match")

@router.post("/run")
def run_matching(u: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    reqs = db.query(models.TravelRequest).filter_by(status="PENDING").all()
    routes = defaultdict(list)
    for r in reqs: routes[(r.origin.lower(), r.destination.lower())].append(r)
    props, rejs = [], []
    for _, rlist in routes.items():
        if len(rlist) < 2: continue
        ev = evaluate_match_safety(rlist)
        exp = MuseSparkService.explain_match(ev["is_safe"], ev["reason"], rlist[0].origin, rlist[0].destination)
        if ev["is_safe"]:
            p = models.GroupProposal(origin=rlist[0].origin, destination=rlist[0].destination, scheduled_departure=ev["scheduled_departure"], estimated_arrival=ev["estimated_arrival"], total_fare=600.0, is_safe=True, explanation=exp, status="PROPOSED")
            db.add(p); db.commit(); db.refresh(p)
            for r in rlist:
                r.status = "MATCHED"
                db.add(models.GroupMember(group_id=p.id, user_id=r.user_id, request_id=r.id, fare_share=calculate_fare_split(600.0, len(rlist))))
            db.commit()
            props.append({"group_id": p.id, "is_safe": True, "explanation": exp})
        else:
            rejs.append({"reason": ev["reason"], "explanation": exp})
    return {"status": "success", "generated_proposals": props, "rejected_matches": rejs}
