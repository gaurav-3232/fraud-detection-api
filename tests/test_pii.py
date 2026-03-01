from app.core.pii import mask_pii

def test_email(): assert "[EMAIL]" in mask_pii("Contact john@test.com please")
def test_phone(): assert "555-123-4567" not in mask_pii("Call 555-123-4567")
def test_otp(): assert "483291" not in mask_pii("Code is 483291")
