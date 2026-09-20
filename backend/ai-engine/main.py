"""
GeoShield AI — Python FastAPI Main Application
Language: Python
Port: 8000

Services:
  - POST /score       → AI landslide/flood risk scoring
  - GET  /weather     → District weather data
  - GET  /incidents   → Fetch incidents from SQLite
  - POST /incidents   → Create new incident
  - GET  /alerts/db   → Fetch alerts from SQLite
  - GET  /health      → Health check
"""

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
from pydantic import BaseModel
from typing import Optional
import random
import datetime

from database import init_db, get_db
from risk_model import RiskInput, compute_risk_score, classify_level

# ─── App Setup ───────────────────────────────────────────────────────────────
app = FastAPI(
    title="GeoShield AI Engine",
    description="Python FastAPI — AI Risk Scoring, Weather & SQLite Data Service",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup():
    init_db()


# ─── Pydantic Schemas ─────────────────────────────────────────────────────────
class ScoreRequest(BaseModel):
    rainfall: float
    soil_moisture: float
    slope_angle: float
    elevation: Optional[float] = 500.0
    district: Optional[str] = "Unknown"

class IncidentCreate(BaseModel):
    title: str
    location: Optional[str] = None
    district: Optional[str] = None
    severity: Optional[str] = "MODERATE"
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    description: Optional[str] = None
    reported_by: Optional[str] = "Field Reporter"


# ─── Health ──────────────────────────────────────────────────────────────────
@app.get("/health")
def health():
    return {"status": "ok", "service": "GeoShield AI Engine", "lang": "Python/FastAPI"}


# ─── AI Risk Scoring ─────────────────────────────────────────────────────────
@app.post("/score")
def score_risk(req: ScoreRequest, db: Session = Depends(get_db)):
    """Compute AI landslide + flood risk score and persist to DB."""
    inp = RiskInput(
        rainfall=req.rainfall,
        soil_moisture=req.soil_moisture,
        slope_angle=req.slope_angle,
        elevation=req.elevation,
    )
    result = compute_risk_score(inp)

    # Persist to risk_scores table
    db.execute(text("""
        INSERT INTO risk_scores (district, rainfall, soil_moisture, slope_angle, risk_score, risk_level)
        VALUES (:district, :rainfall, :soil_moisture, :slope_angle, :risk_score, :risk_level)
    """), {
        "district": req.district,
        "rainfall": req.rainfall,
        "soil_moisture": req.soil_moisture,
        "slope_angle": req.slope_angle,
        "risk_score": result["landslide_risk"],
        "risk_level": result["risk_level"],
    })
    db.commit()

    return {"district": req.district, **result}


# ─── Weather Data ─────────────────────────────────────────────────────────────
DISTRICTS_WEATHER = [
    {"id": "gangtok", "name": "Gangtok", "state": "Sikkim", "temp": 18, "humidity": 94,
     "rainfall72h": 312, "windSpeed": 28, "visibility": 2.1, "condition": "Severe Thunderstorm",
     "icon": "storm", "landslideRisk": 87, "floodRisk": 72,
     "forecast72h": "Continue heavy rain. IMD Red Alert issued.", "alert": "RED",
     "imdAlert": "Extremely Heavy Rain Alert (IMD)"},
    {"id": "tadong", "name": "Tadong Sector", "state": "Sikkim", "temp": 17, "humidity": 96,
     "rainfall72h": 287, "windSpeed": 32, "visibility": 1.4, "condition": "Heavy Rain + Fog",
     "icon": "heavy-rain", "landslideRisk": 92, "floodRisk": 68,
     "forecast72h": "Intensifying rainfall. High slope instability risk.", "alert": "RED",
     "imdAlert": "Red Alert – Landslide Threat"},
    {"id": "mangan", "name": "Mangan", "state": "North Sikkim", "temp": 14, "humidity": 88,
     "rainfall72h": 198, "windSpeed": 18, "visibility": 3.5, "condition": "Moderate Rain",
     "icon": "rain", "landslideRisk": 54, "floodRisk": 38,
     "forecast72h": "Moderate rain through weekend. Monitor river banks.", "alert": "ORANGE",
     "imdAlert": "Orange Alert – Heavy Rain Warning"},
    {"id": "jorethang", "name": "Jorethang", "state": "South Sikkim", "temp": 22, "humidity": 82,
     "rainfall72h": 156, "windSpeed": 14, "visibility": 5.2, "condition": "Overcast / Drizzle",
     "icon": "drizzle", "landslideRisk": 35, "floodRisk": 28,
     "forecast72h": "Light to moderate rain. Road conditions improving.", "alert": "YELLOW",
     "imdAlert": "Yellow Alert – Watch"},
    {"id": "guwahati", "name": "Guwahati", "state": "Assam", "temp": 27, "humidity": 78,
     "rainfall72h": 124, "windSpeed": 22, "visibility": 6.8, "condition": "Partly Cloudy",
     "icon": "cloudy", "landslideRisk": 22, "floodRisk": 45,
     "forecast72h": "Brahmaputra continues at high levels. Flood watch active.", "alert": "YELLOW",
     "imdAlert": "Yellow Alert – Flood Watch"},
    {"id": "kohima", "name": "Kohima", "state": "Nagaland", "temp": 20, "humidity": 71,
     "rainfall72h": 89, "windSpeed": 11, "visibility": 8.4, "condition": "Partly Cloudy",
     "icon": "cloudy", "landslideRisk": 18, "floodRisk": 12,
     "forecast72h": "Clearing skies expected. Low risk period.", "alert": "GREEN",
     "imdAlert": "Green – No Alert"},
]

HOURLY_FORECAST = [
    {"hour": "Now",  "rain": 14.2, "temp": 18, "risk": 87},
    {"hour": "+3h",  "rain": 16.8, "temp": 17, "risk": 89},
    {"hour": "+6h",  "rain": 19.4, "temp": 16, "risk": 91},
    {"hour": "+9h",  "rain": 22.1, "temp": 16, "risk": 94},
    {"hour": "+12h", "rain": 18.5, "temp": 17, "risk": 90},
    {"hour": "+15h", "rain": 12.3, "temp": 18, "risk": 82},
    {"hour": "+18h", "rain": 8.7,  "temp": 19, "risk": 74},
    {"hour": "+21h", "rain": 5.2,  "temp": 20, "risk": 65},
    {"hour": "+24h", "rain": 11.4, "temp": 18, "risk": 72},
]

SEVEN_DAY = [
    {"day": "Today", "icon": "storm",      "high": 19, "low": 14, "rain": 38, "risk": 91},
    {"day": "Fri",   "icon": "heavy-rain", "high": 18, "low": 13, "rain": 42, "risk": 88},
    {"day": "Sat",   "icon": "rain",       "high": 20, "low": 15, "rain": 29, "risk": 76},
    {"day": "Sun",   "icon": "rain",       "high": 22, "low": 16, "rain": 18, "risk": 61},
    {"day": "Mon",   "icon": "drizzle",    "high": 23, "low": 17, "rain": 8,  "risk": 45},
    {"day": "Tue",   "icon": "cloudy",     "high": 25, "low": 18, "rain": 4,  "risk": 32},
    {"day": "Wed",   "icon": "sunny",      "high": 27, "low": 19, "rain": 0,  "risk": 18},
]

@app.get("/weather")
def get_weather():
    """Returns full weather dataset for all NER districts."""
    return {
        "districts": DISTRICTS_WEATHER,
        "hourly": HOURLY_FORECAST,
        "sevenDay": SEVEN_DAY,
        "source": "IMD + GeoShield AI Engine (Python)",
        "updatedAt": datetime.datetime.now().isoformat(),
    }


# ─── Incidents CRUD ──────────────────────────────────────────────────────────
@app.get("/incidents")
def list_incidents(db: Session = Depends(get_db)):
    rows = db.execute(text("SELECT * FROM incidents ORDER BY created_at DESC LIMIT 50")).fetchall()
    return [dict(r._mapping) for r in rows]


@app.post("/incidents", status_code=201)
def create_incident(body: IncidentCreate, db: Session = Depends(get_db)):
    db.execute(text("""
        INSERT INTO incidents (title, location, district, severity, latitude, longitude, description, reported_by)
        VALUES (:title, :location, :district, :severity, :latitude, :longitude, :description, :reported_by)
    """), body.model_dump())
    db.commit()
    return {"message": "Incident logged successfully"}


# ─── Alerts from DB ──────────────────────────────────────────────────────────
@app.get("/alerts")
def get_alerts(db: Session = Depends(get_db)):
    rows = db.execute(text("SELECT * FROM alerts WHERE active = 1 ORDER BY level DESC")).fetchall()
    return [dict(r._mapping) for r in rows]


# ─── Dispatch Log ─────────────────────────────────────────────────────────────
@app.get("/dispatch")
def get_dispatch(db: Session = Depends(get_db)):
    rows = db.execute(text("SELECT * FROM dispatch_log ORDER BY timestamp DESC LIMIT 20")).fetchall()
    return [dict(r._mapping) for r in rows]
