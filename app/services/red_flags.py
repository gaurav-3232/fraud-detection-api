FRAUD_CATEGORIES = {
    "impersonation": {
        "weight": 0.3, "reason": "Impersonation of authority or organization detected",
        "keywords": ["irs", "social security administration", "fbi", "police department", "bank security", "microsoft support", "apple support", "tech support", "customs department", "tax department", "government agency", "this is officer", "federal agent", "we are calling from"],
    },
    "urgency_and_threats": {
        "weight": 0.25, "reason": "Urgency and threat language used",
        "keywords": ["immediately", "right now", "urgent", "last chance", "final warning", "arrested", "warrant", "jail", "prison", "suspended", "legal action", "lawsuit", "court", "deadline", "expire", "act now", "don't hang up", "time is running out"],
    },
    "financial_pressure": {
        "weight": 0.3, "reason": "Financial pressure or unusual payment request detected",
        "keywords": ["gift card", "wire transfer", "western union", "bitcoin", "cryptocurrency", "money order", "prepaid card", "itunes card", "google play card", "pay immediately", "transfer money", "bank account number", "routing number", "credit card number", "send money", "fee payment", "tax owed", "back taxes", "outstanding balance", "overdue payment"],
    },
    "personal_info_request": {
        "weight": 0.25, "reason": "Request for sensitive personal information",
        "keywords": ["social security number", "ssn", "date of birth", "mother's maiden", "bank account", "credit card", "pin number", "password", "verify your identity", "confirm your details", "security question", "one-time code", "otp", "verification code", "login credentials"],
    },
    "too_good_to_be_true": {
        "weight": 0.2, "reason": "Unrealistic offers or prizes mentioned",
        "keywords": ["you've won", "congratulations", "lottery", "prize", "free vacation", "selected", "lucky winner", "claim your", "million dollars", "inheritance", "unclaimed funds", "special offer"],
    },
    "evasion_tactics": {
        "weight": 0.15, "reason": "Evasion or secrecy language detected",
        "keywords": ["don't tell anyone", "keep this confidential", "secret", "between us", "don't call the bank", "don't contact", "stay on the line", "do not share", "this is private"],
    },
}

def detect_red_flags(transcript):
    text_lower = transcript.lower()
    matched_keywords, matched_categories, reasons = [], [], []
    total_score = 0.0
    for cat_name, cat_data in FRAUD_CATEGORIES.items():
        hits = [kw for kw in cat_data["keywords"] if kw in text_lower]
        if hits:
            matched_keywords.extend(hits)
            matched_categories.append(cat_name)
            reasons.append(cat_data["reason"])
            total_score += cat_data["weight"] + min(len(hits) * 0.05, 0.15)
    return {"matched_keywords": matched_keywords, "matched_categories": matched_categories, "reasons": reasons, "total_score": min(max(total_score, 0.0), 1.0)}
