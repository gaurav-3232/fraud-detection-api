def test_feedback(client):
    r = client.post("/feedback", json={"transcript": "Hello from IRS about your back taxes.", "predicted_label": "fraud", "true_label": "fraud"})
    assert r.status_code == 200
    assert r.json()["status"] == "saved"

def test_invalid_label(client):
    r = client.post("/feedback", json={"transcript": "Test transcript for label check.", "predicted_label": "maybe", "true_label": "fraud"})
    assert r.status_code == 400
