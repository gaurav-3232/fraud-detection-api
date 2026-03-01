FRAUD = "Hello, this is the IRS. You owe $5,000 in back taxes. Pay immediately using gift cards or a warrant will be issued for your arrest."
NORMAL = "Hi, this is Dr. Smith's office calling to remind you about your appointment tomorrow at 3 PM."

def test_fraud_detected(client):
    r = client.post("/predict", json={"transcript": FRAUD, "language": "en", "mode": "baseline"})
    assert r.status_code == 200
    assert r.json()["label"] == "fraud"
    assert r.json()["risk_score"] >= 0.5

def test_normal_detected(client):
    r = client.post("/predict", json={"transcript": NORMAL, "language": "en", "mode": "baseline"})
    assert r.json()["label"] == "normal"

def test_llm_stub(client):
    r = client.post("/predict", json={"transcript": FRAUD, "language": "en", "mode": "llm"})
    assert r.status_code == 200
    assert r.json()["label"] in ("fraud", "normal")

def test_invalid_mode(client):
    r = client.post("/predict", json={"transcript": FRAUD, "mode": "bad"})
    assert r.status_code == 400

def test_short_transcript(client):
    r = client.post("/predict", json={"transcript": "Hi", "mode": "baseline"})
    assert r.status_code == 422
