from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    requests = relationship("TravelRequest", back_populates="user")
    memberships = relationship("GroupMember", back_populates="user")

class TravelRequest(Base):
    __tablename__ = "travel_requests"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    origin = Column(String, nullable=False)
    destination = Column(String, nullable=False)
    earliest_departure = Column(DateTime, nullable=False)
    latest_arrival = Column(DateTime, nullable=False)
    luggage_count = Column(Integer, default=1)
    status = Column(String, default="PENDING")
    raw_query = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    user = relationship("User", back_populates="requests")

class GroupProposal(Base):
    __tablename__ = "group_proposals"
    id = Column(Integer, primary_key=True, index=True)
    origin = Column(String, nullable=False)
    destination = Column(String, nullable=False)
    scheduled_departure = Column(DateTime, nullable=False)
    estimated_arrival = Column(DateTime, nullable=False)
    total_fare = Column(Float, default=600.0)
    is_safe = Column(Boolean, default=True)
    explanation = Column(String, nullable=True)
    status = Column(String, default="PROPOSED")
    created_at = Column(DateTime, default=datetime.utcnow)
    members = relationship("GroupMember", back_populates="group")

class GroupMember(Base):
    __tablename__ = "group_members"
    id = Column(Integer, primary_key=True, index=True)
    group_id = Column(Integer, ForeignKey("group_proposals.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    request_id = Column(Integer, ForeignKey("travel_requests.id"), nullable=False)
    accepted = Column(Boolean, default=False)
    fare_share = Column(Float, default=0.0)
    group = relationship("GroupProposal", back_populates="members")
    user = relationship("User", back_populates="memberships")
