import sys
import os

sys.path.insert(0, os.path.abspath("."))

from backend.app.main import app, analyze_content
from backend.app.models.schemas import AnalyzeRequest

# Test 1: Fake Electricity Bill Scam
sample_elec = AnalyzeRequest(
    text="Dear consumer, your electricity power will be disconnected tonight at 9:30 PM from power office because your previous month bill was not updated. Pay via http://bijli-bill-update.online/pay",
    channel="sms"
)
res1 = analyze_content(sample_elec)
print(f"Test 1 (Electricity Scam): Score={res1.risk_score}/100, Level={res1.risk_level}, Warning={res1.interstitial_warning_needed}")

# Test 2: Legitimate Bank OTP Alert
sample_otp = AnalyzeRequest(
    text="OTP for transaction of Rs. 4,500 at Amazon India is 849201. Valid for 10 mins. Do not share OTP with anyone - State Bank of India.",
    channel="sms"
)
res2 = analyze_content(sample_otp)
print(f"Test 2 (Legitimate OTP): Score={res2.risk_score}/100, Level={res2.risk_level}, Warning={res2.interstitial_warning_needed}")

# Test 3: SKIT College Academic Notice
sample_campus = AnalyzeRequest(
    text="All 3rd year B.Tech students are informed that IEEE-IGNITE Hackathon orientation will be held in the Mini Auditorium at 2:00 PM today. Principal, SKIT Jaipur.",
    channel="email"
)
res3 = analyze_content(sample_campus)
print(f"Test 3 (Campus Notice): Score={res3.risk_score}/100, Level={res3.risk_level}, Warning={res3.interstitial_warning_needed}")
