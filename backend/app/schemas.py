from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

class UserRegister(BaseModel):
    email: str
    name: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserOut(BaseModel):
    id: int
    email: str
    name: str
    class Config:
        from_attributes = True

class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TravelRequestCreate(BaseModel):
    origin: str
    destination: str
    earliest_departure: datetime
    latest_arrival: datetime
    luggage_count: int = 1
    natural_prompt: Optional[str] = None

class TravelRequestOut(BaseModel):
    id: int
    user_id: int
    origin: str
    destination: str
    earliest_departure: datetime
    latest_arrival: datetime
    luggage_count: int
    status: str
    class Config:
        from_attributes = True

class GroupMemberOut(BaseModel):
    user_id: int
    user_name: str
    accepted: bool
    fare_share: float

class GroupProposalOut(BaseModel):
    id: int
    origin: str
    destination: str
    scheduled_departure: datetime
    estimated_arrival: datetime
    total_fare: float
    is_safe: bool
    explanation: Optional[str]
    status: str
    members: List[GroupMemberOut]
    class Config:
        from_attributes = True

class FareSplitOut(BaseModel):
    group_id: int
    total_fare: float
    member_count: int
    fare_per_member: float
    standard_solo_fare: float
    savings_per_member: float

class DashboardStatsOut(BaseModel):
    total_rides_matched: int
    total_money_saved_inr: float
    carbon_saved_kg: float
    active_proposals: int
