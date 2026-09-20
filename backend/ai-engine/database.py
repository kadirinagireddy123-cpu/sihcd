"""
GeoShield AI — SQLAlchemy Database Setup
Language: Python
"""

import os
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, DeclarativeBase

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "geoshield.db")
SCHEMA_PATH = os.path.join(BASE_DIR, "schema.sql")

engine = create_engine(f"sqlite:///{DB_PATH}", connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


import sqlite3

def init_db():
    """Initialize database from schema.sql using native sqlite3 executescript."""
    with open(SCHEMA_PATH, "r") as f:
        sql = f.read()

    conn = sqlite3.connect(DB_PATH)
    try:
        conn.executescript(sql)
        conn.commit()
    except Exception as e:
        print(f"DB Init Warning: {e}")
    finally:
        conn.close()

    # Keep startup output compatible with Windows terminals using legacy encodings.
    print("GeoShield SQLite database initialized")


def get_db():
    """FastAPI dependency to get a DB session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
