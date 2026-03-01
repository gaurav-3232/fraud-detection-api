import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import pandas as pd
from sklearn.metrics import classification_report, confusion_matrix
from app.services.predictor_baseline import BaselinePredictor

df = pd.read_csv("data/sample_calls.csv")
predictor = BaselinePredictor()
true_l, pred_l = [], []
for _, row in df.iterrows():
    r = predictor.predict(row["transcript"], row.get("language", "en"))
    true_l.append(row["label"]); pred_l.append(r.label)

print("\n" + "="*50 + "\n  EVALUATION RESULTS\n" + "="*50)
print(classification_report(true_l, pred_l, target_names=["fraud","normal"]))
cm = confusion_matrix(true_l, pred_l, labels=["fraud","normal"])
print(f"Confusion Matrix:\n  Pred:fraud  Pred:normal\nfraud   {cm[0][0]:>5}  {cm[0][1]:>10}\nnormal  {cm[1][0]:>5}  {cm[1][1]:>10}")
correct = sum(1 for t,p in zip(true_l,pred_l) if t==p)
print(f"\nAccuracy: {correct}/{len(true_l)} ({correct/len(true_l):.1%})\n")
