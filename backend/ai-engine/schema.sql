-- GeoShield AI — SQLite Database Schema
-- Language: SQL
-- Used by: Python FastAPI AI Engine (SQLAlchemy ORM)

-- Disaster Incident Log
CREATE TABLE IF NOT EXISTS incidents (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    title       TEXT    NOT NULL,
    location    TEXT,
    district    TEXT,
    severity    TEXT    CHECK(severity IN ('LOW','MODERATE','HIGH','CRITICAL')),
    latitude    REAL,
    longitude   REAL,
    description TEXT,
    reported_by TEXT    DEFAULT 'GeoShield System',
    resolved    INTEGER DEFAULT 0,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Global Disaster Alerts (including cross-border events)
CREATE TABLE IF NOT EXISTS alerts (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    type       TEXT NOT NULL,
    title      TEXT NOT NULL,
    message    TEXT,
    district   TEXT,
    state      TEXT,
    level      TEXT CHECK(level IN ('GREEN','YELLOW','ORANGE','RED','CRITICAL')),
    source     TEXT DEFAULT 'GeoShield AI',
    active     INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- SDRF / NDRF Dispatch Action Log
CREATE TABLE IF NOT EXISTS dispatch_log (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    action     TEXT NOT NULL,
    team       TEXT,
    road_id    TEXT,
    incident_id INTEGER REFERENCES incidents(id),
    operator   TEXT DEFAULT 'GeoShield Operator',
    timestamp  DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Risk Score Audit Trail
CREATE TABLE IF NOT EXISTS risk_scores (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    district     TEXT,
    rainfall     REAL,
    soil_moisture REAL,
    slope_angle  REAL,
    risk_score   REAL,
    risk_level   TEXT,
    computed_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Seed Data: Nepal Glacier Collapse Event (Aug 26, 2026)
INSERT OR IGNORE INTO alerts (id, type, title, message, district, state, level, source) VALUES
(1, 'INTERNATIONAL', 'Nepal-Tibet Glacier Collapse — Flash Floods',
 'Devastating flash floods triggered by glacier collapse on the Nepal-Tibet border on August 26, 2026 have killed at least 626 people in Nepal, with nearly 2,000 reported missing. Massive wave of water, ice, and debris traveled down the Bhote Koshi River valley, destroying villages, the Gyirong Port trade link, and critical infrastructure across Rasuwa and Nuwakot districts.',
 'Rasuwa & Nuwakot', 'Nepal', 'CRITICAL', 'International Disaster Alert');

INSERT OR IGNORE INTO alerts (id, type, title, message, district, state, level, source) VALUES
(2, 'IMD_WARNING', 'Heavy Monsoonal Downpour (145mm/24h)',
 'IMD has issued Red Alert for extremely heavy rainfall across Sikkim and Meghalaya slopes. Landslide probability >80%.',
 'Gangtok', 'Sikkim', 'RED', 'IMD');

INSERT OR IGNORE INTO alerts (id, type, title, message, district, state, level, source) VALUES
(3, 'BEACON_ALERT', 'Soil Saturation Critical — Gangtok Beacon #4',
 'GeoShield Beacon #4 at Gangtok reports soil saturation at 88%. LoRa local sirens in standby mode.',
 'Gangtok', 'Sikkim', 'RED', 'GeoShield Beacon');

INSERT OR IGNORE INTO alerts (id, type, title, message, district, state, level, source) VALUES
(4, 'ROUTE_UPDATE', 'SafePath AI — Route 3 Cleared',
 'North Sector Highway (Route 3) cleared for emergency responder convoy by SafePath AI routing engine.',
 'North Sector', 'Sikkim', 'GREEN', 'SafePath AI');

-- Seed: Incidents
INSERT OR IGNORE INTO incidents (id, title, location, district, severity, latitude, longitude) VALUES
(1, 'Landslide Debris on NH-10 km 34', 'NH-10 Siliguri–Rangpo', 'East Sikkim', 'CRITICAL', 27.15, 88.52);

INSERT OR IGNORE INTO incidents (id, title, location, district, severity, latitude, longitude) VALUES
(2, 'Burtuk Village Road Flash Flood', 'MDR Burtuk River Crossing', 'Burtuk Panchayat', 'HIGH', 27.32, 88.61);

-- Seed: Dispatch Log
INSERT OR IGNORE INTO dispatch_log (id, action, team, road_id) VALUES
(1, 'SDRF team dispatched to NH-10 km 34 blockage. ETA 25 mins.', 'SDRF Alpha', 'NH10-A');

INSERT OR IGNORE INTO dispatch_log (id, action, team) VALUES
(2, 'Alert SMS sent to 847 residents near MDR Burtuk Village road.', 'GeoShield Comms');

INSERT OR IGNORE INTO dispatch_log (id, action, team, road_id) VALUES
(3, 'Traffic rerouted via Kalimpong bypass for NH-10 vehicles.', 'Traffic Control', 'NH10-A');
