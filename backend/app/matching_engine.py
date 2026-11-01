from datetime import datetime, timedelta
from typing import List, Dict, Any
from app.models import TravelRequest

BUFFER_MINUTES = 30
TRANSIT_TIME_MINUTES = 45
VEHICLE_CAPACITY = 4

def evaluate_match_safety(requests: List[TravelRequest]) -> Dict[str, Any]:
    if len(requests) > VEHICLE_CAPACITY:
        return {"is_safe": False, "reason": f"Capacity exceeded. Max limit is {VEHICLE_CAPACITY} riders.", "scheduled_departure": None, "estimated_arrival": None}
    scheduled_departure = max(r.earliest_departure for r in requests)
    estimated_arrival = scheduled_departure + timedelta(minutes=TRANSIT_TIME_MINUTES)
    for req in requests:
        safe_deadline_limit = req.latest_arrival - timedelta(minutes=BUFFER_MINUTES)
        if estimated_arrival > safe_deadline_limit:
            return {"is_safe": False, "reason": f"Rider {req.user_id} deadline violation: Arrival violates required buffer deadline.", "scheduled_departure": scheduled_departure, "estimated_arrival": estimated_arrival}
    return {"is_safe": True, "reason": "Timing and capacity criteria verified. 30-minute safety buffer respected.", "scheduled_departure": scheduled_departure, "estimated_arrival": estimated_arrival}

def calculate_fare_split(total_fare: float, count: int) -> float:
    if count == 0:
        return 0.0
    return round(total_fare / count, 2)
