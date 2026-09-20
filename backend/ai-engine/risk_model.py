"""
GeoShield AI — AI Risk Scoring Engine
Language: Python

Computes landslide & flood risk scores using a weighted multi-factor model.
Factors: rainfall intensity, soil moisture saturation, slope gradient, elevation.
"""

from dataclasses import dataclass


@dataclass
class RiskInput:
    rainfall: float       # mm in 24h
    soil_moisture: float  # percentage 0–100
    slope_angle: float    # degrees
    elevation: float = 500.0  # metres ASL


def compute_risk_score(inp: RiskInput) -> dict:
    """
    Weighted risk formula:
      - Rainfall: 35% weight  (threshold: 100mm/day = high risk)
      - Soil Moisture: 30%    (threshold: 80% = saturated)
      - Slope Angle: 25%      (threshold: 35° = unstable)
      - Elevation: 10%        (higher = more exposed)
    Returns risk_score (0–100) and risk_level label.
    """

    # Normalize each factor to 0–1 scale
    rain_norm  = min(inp.rainfall / 300.0, 1.0)
    moist_norm = min(inp.soil_moisture / 100.0, 1.0)
    slope_norm = min(inp.slope_angle / 60.0, 1.0)
    elev_norm  = min(inp.elevation / 3000.0, 1.0)

    # Weighted sum
    raw = (
        rain_norm  * 0.35 +
        moist_norm * 0.30 +
        slope_norm * 0.25 +
        elev_norm  * 0.10
    )

    score = round(raw * 100, 1)

    # Classify
    if score >= 75:
        level = "CRITICAL"
    elif score >= 55:
        level = "HIGH"
    elif score >= 35:
        level = "MODERATE"
    else:
        level = "LOW"

    # Additional flood risk (based mainly on rainfall + soil)
    flood_raw = (rain_norm * 0.55 + moist_norm * 0.45)
    flood_score = round(flood_raw * 100, 1)

    return {
        "landslide_risk": score,
        "flood_risk": flood_score,
        "risk_level": level,
        "factors": {
            "rainfall_contribution":  round(rain_norm  * 35, 1),
            "moisture_contribution":  round(moist_norm * 30, 1),
            "slope_contribution":     round(slope_norm * 25, 1),
            "elevation_contribution": round(elev_norm  * 10, 1),
        }
    }


def classify_level(score: float) -> str:
    if score >= 75: return "CRITICAL"
    if score >= 55: return "HIGH"
    if score >= 35: return "MODERATE"
    return "LOW"
