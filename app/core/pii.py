import re

PHONE_PATTERN = re.compile(r"(\+?\d{1,3}[-.\s]?)?(\(?\d{2,4}\)?[-.\s]?)(\d{3,4}[-.\s]?)(\d{3,4})")
EMAIL_PATTERN = re.compile(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}")
OTP_PATTERN = re.compile(r"\b\d{4,8}\b")

def mask_pii(text):
    masked = EMAIL_PATTERN.sub("[EMAIL]", text)
    masked = PHONE_PATTERN.sub("[PHONE]", masked)
    masked = OTP_PATTERN.sub("[OTP_CODE]", masked)
    return masked
