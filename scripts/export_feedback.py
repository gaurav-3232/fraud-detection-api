import sys, os, csv
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from app.db.session import SessionLocal
from app.db.models import Feedback

db = SessionLocal()
rows = db.query(Feedback).order_by(Feedback.created_at.desc()).all()
db.close()
if not rows: print("No feedback found."); exit()
os.makedirs("data", exist_ok=True)
with open("data/feedback_export.csv","w",newline="") as f:
    w = csv.writer(f)
    w.writerow(["id","transcript_hash","predicted_label","true_label","notes","created_at"])
    for r in rows: w.writerow([r.id,r.transcript_hash,r.predicted_label,r.true_label,r.notes or "",r.created_at.isoformat()])
print(f"Exported {len(rows)} records to data/feedback_export.csv")
