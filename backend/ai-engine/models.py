"""
GeoShield AI — SQLAlchemy ORM Models
Language: Python
"""

from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime
from sqlalchemy.sql import func
from database import Base


class Incident(Base):
    __tablename__ = "incidents"

    id          = Column(Integer, primary_key=True, index=True)
    title       = Column(String, nullable=False)
    location    = Column(String)
    district    = Column(String)
    severity    = Column(String)
    latitude    = Column(Float)
    longitude   = Column(Float)
    description = Column(String)
    reported_by = Column(String, default="GeoShield System")
    resolved    = Column(Boolean, default=False)
    created_at  = Column(DateTime, server_default=func.now())


class Alert(Base):
    __tablename__ = "alerts"

    id         = Column(Integer, primary_key=True, index=True)
    type       = Column(String)
    title      = Column(String, nullable=False)
    message    = Column(String)
    district   = Column(String)
    state      = Column(String)
    level      = Column(String)
    source     = Column(String, default="GeoShield AI")
    active     = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())


class DispatchLog(Base):
    __tablename__ = "dispatch_log"

    id          = Column(Integer, primary_key=True, index=True)
    action      = Column(String, nullable=False)
    team        = Column(String)
    road_id     = Column(String)
    incident_id = Column(Integer)
    operator    = Column(String, default="GeoShield Operator")
    timestamp   = Column(DateTime, server_default=func.now())


class RiskScore(Base):
    __tablename__ = "risk_scores"

    id            = Column(Integer, primary_key=True, index=True)
    district      = Column(String)
    rainfall      = Column(Float)
    soil_moisture = Column(Float)
    slope_angle   = Column(Float)
    risk_score    = Column(Float)
    risk_level    = Column(String)
    computed_at   = Column(DateTime, server_default=func.now())
