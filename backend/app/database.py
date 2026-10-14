"""
SQLite Database module for persistent case audit history and security dashboard metrics.
Satisfies the PS requirement: 'Maintain a searchable history of analyzed cases'.
"""

import sqlite3
import json
import os
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional

DB_FILE = os.path.join(os.path.dirname(__file__), "..", "threat_history.db")

def get_connection():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initializes tables and indexes."""
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS cases (
                id TEXT PRIMARY KEY,
                timestamp TEXT NOT NULL,
                channel TEXT NOT NULL,
                input_text TEXT NOT NULL,
                analyzed_url TEXT,
                risk_score INTEGER NOT NULL,
                risk_level TEXT NOT NULL,
                brand_impersonation TEXT,
                factors_json TEXT NOT NULL,
                summary TEXT NOT NULL,
                recommended_action TEXT NOT NULL
            )
        """)
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_risk_level ON cases(risk_level)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_timestamp ON cases(timestamp)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_channel ON cases(channel)")
        conn.commit()

    # Seed baseline historical cases if database is empty
    seed_if_empty()

def save_case(data: Dict[str, Any]):
    """Persists an analysis result into the searchable audit log."""
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT OR REPLACE INTO cases (
                id, timestamp, channel, input_text, analyzed_url,
                risk_score, risk_level, brand_impersonation,
                factors_json, summary, recommended_action
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            data["id"],
            data["timestamp"],
            data["channel"],
            data["text"],
            data.get("url"),
            data["risk_score"],
            data["risk_level"],
            data.get("brand_impersonation"),
            json.dumps(data.get("factors", [])),
            data["summary"],
            data["recommended_action"]
        ))
        conn.commit()

def search_cases(
    query: Optional[str] = None,
    risk_level: Optional[str] = None,
    channel: Optional[str] = None,
    limit: int = 50,
    offset: int = 0
) -> List[Dict[str, Any]]:
    """Performs full-text keyword search and multi-attribute filtering."""
    sql = "SELECT * FROM cases WHERE 1=1"
    params = []

    if risk_level and risk_level.upper() != "ALL":
        sql += " AND risk_level = ?"
        params.append(risk_level.upper())

    if channel and channel.lower() != "all":
        sql += " AND channel = ?"
        params.append(channel.lower())

    if query and query.strip():
        sql += " AND (input_text LIKE ? OR analyzed_url LIKE ? OR brand_impersonation LIKE ?)"
        term = f"%{query.strip()}%"
        params.extend([term, term, term])

    sql += " ORDER BY timestamp DESC LIMIT ? OFFSET ?"
    params.extend([limit, offset])

    results = []
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(sql, params)
        for row in cursor.fetchall():
            results.append({
                "id": row["id"],
                "timestamp": row["timestamp"],
                "channel": row["channel"],
                "preview": row["input_text"][:120] + ("..." if len(row["input_text"]) > 120 else ""),
                "risk_score": row["risk_score"],
                "risk_level": row["risk_level"],
                "brand_impersonation": row["brand_impersonation"],
                "url": row["analyzed_url"]
            })
    return results

def get_dashboard_metrics() -> Dict[str, Any]:
    """Computes aggregated telemetry metrics for the Security Operations Dashboard."""
    with get_connection() as conn:
        cursor = conn.cursor()

        cursor.execute("SELECT COUNT(*) as total, AVG(risk_score) as avg_score FROM cases")
        row = cursor.fetchone()
        total = row["total"] or 0
        avg_score = round(row["avg_score"] or 0.0, 1)

        cursor.execute("SELECT COUNT(*) FROM cases WHERE risk_level = 'CRITICAL'")
        critical_count = cursor.fetchone()[0] or 0

        cursor.execute("SELECT COUNT(*) FROM cases WHERE risk_level = 'SUSPICIOUS'")
        suspicious_count = cursor.fetchone()[0] or 0

        cursor.execute("SELECT COUNT(*) FROM cases WHERE risk_level = 'SAFE'")
        safe_count = cursor.fetchone()[0] or 0

        # Group by channel
        cursor.execute("SELECT channel, COUNT(*) FROM cases GROUP BY channel")
        by_channel = {r[0]: r[1] for r in cursor.fetchall()}

        # Group by impersonated brand
        cursor.execute("""
            SELECT brand_impersonation, COUNT(*) as count 
            FROM cases 
            WHERE brand_impersonation IS NOT NULL 
            GROUP BY brand_impersonation 
            ORDER BY count DESC 
            LIMIT 5
        """)
        top_brands = [{"brand": r[0], "count": r[1]} for r in cursor.fetchall()]

        # Recent 5 activity items
        cursor.execute("SELECT * FROM cases ORDER BY timestamp DESC LIMIT 5")
        recent = []
        for r in cursor.fetchall():
            recent.append({
                "id": r["id"],
                "timestamp": r["timestamp"],
                "channel": r["channel"],
                "preview": r["input_text"][:85] + ("..." if len(r["input_text"]) > 85 else ""),
                "risk_score": r["risk_score"],
                "risk_level": r["risk_level"],
                "brand_impersonation": r["brand_impersonation"],
                "url": r["analyzed_url"]
            })

    return {
        "total_analyzed": total,
        "critical_threats": critical_count,
        "suspicious_cases": suspicious_count,
        "safe_cases": safe_count,
        "avg_risk_score": avg_score,
        "threats_by_channel": by_channel,
        "top_impersonated_brands": top_brands,
        "recent_activity": recent
    }

def seed_if_empty():
    """Seeds historical data so the dashboard is immediately demonstrable."""
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM cases")
        if cursor.fetchone()[0] == 0:
            seeds = [
                ("case-001", "2026-10-13T08:15:00Z", "sms", "Dear customer, your SBI YONO account suspended due to KYC. Update at http://onlinesbi-yono-kyc.top/verify", "http://onlinesbi-yono-kyc.top/verify", 94, "CRITICAL", "State Bank of India (SBI)", "High risk phishing link with fake KYC urgency"),
                ("case-002", "2026-10-13T08:30:00Z", "sms", "Electricity bill unpaid. Power disconnected tonight 9:30 PM. Pay now at http://bijli-bill-update.online/pay", "http://bijli-bill-update.online/pay", 89, "CRITICAL", "Electricity Board / Bijli Nigam", "Coercive power disconnection scam targeting utility consumers"),
                ("case-003", "2026-10-13T08:45:00Z", "email", "RTU & SKIT Semester Examination admit card registration closes in 2 hours. Pay fine at http://skit-exam-portal.live/fee", "http://skit-exam-portal.live/fee", 86, "CRITICAL", "SKIT Jaipur / Campus ERP", "Campus exam fee extortion targeting students"),
                ("case-004", "2026-10-13T09:00:00Z", "social", "Work from home! Earn Rs. 5000 daily by reviewing products on Amazon. Join manager at http://t.me/earn_daily_job", "http://t.me/earn_daily_job", 78, "CRITICAL", "Amazon", "Telegram job task investment trap"),
                ("case-005", "2026-10-13T09:10:00Z", "sms", "Your parcel is held at terminal due to unpaid tax of Rs 25. Click http://indiapost-update.xyz/tracking to release", "http://indiapost-update.xyz/tracking", 83, "CRITICAL", "India Post", "Postal delivery smishing"),
                ("case-006", "2026-10-13T09:20:00Z", "sms", "OTP for transaction of Rs 4500 is 849201. Do not share OTP with anyone - SBI", None, 10, "SAFE", "State Bank of India (SBI)", "Legitimate transactional OTP with disclaimer"),
                ("case-007", "2026-10-13T09:25:00Z", "email", "IEEE-IGNITE Hackathon orientation today at 2 PM in Mini Auditorium. SKIT Student Branch", None, 5, "SAFE", "SKIT Jaipur / Campus ERP", "Official academic notice"),
                ("case-008", "2026-10-13T09:30:00Z", "sms", "Limited time flash discount: Get 20% off your next grocery order with code SAVE20 at bigbasket.com", "https://bigbasket.com", 22, "SAFE", None, "Legitimate retail promotional text")
            ]
            for s in seeds:
                cursor.execute("""
                    INSERT INTO cases (
                        id, timestamp, channel, input_text, analyzed_url,
                        risk_score, risk_level, brand_impersonation,
                        factors_json, summary, recommended_action
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (s[0], s[1], s[2], s[3], s[4], s[5], s[6], s[7], "[]", s[8], "Default historical action"))
            conn.commit()

# Ensure tables and initial seeds exist immediately
init_db()
