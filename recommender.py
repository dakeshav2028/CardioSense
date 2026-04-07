# recommender.py

def get_recommendations(input_data: dict, risk_score: float) -> dict:
    """
    input_data: raw user inputs (before encoding/scaling)
    risk_score: float between 0 and 1 from model
    Returns: dict with risk_level, recommendations, alert
    """

    recommendations = []
    alert = None

    # ── Hard override ───────────────────────────────────
    if risk_score >= 0.80:
        alert = ("Your risk score is critically high. "
                 "Please consult a cardiologist immediately.")

    # ── Risk level label ────────────────────────────────
    if risk_score >= 0.80:
        risk_level = "Critical"
    elif risk_score >= 0.60:
        risk_level = "High"
    elif risk_score >= 0.40:
        risk_level = "Moderate"
    else:
        risk_level = "Low"

    # ── Rule-based recommendations ──────────────────────

    # Blood pressure
    trestbps = input_data.get('trestbps', 0)
    if trestbps >= 140:
        recommendations.append({
            "category": "Blood Pressure",
            "finding": f"Resting BP is {trestbps} mmHg (high)",
            "action": "Reduce sodium intake, avoid caffeine, do 30 min cardio 5x/week.",
            "priority": "High"
        })
    elif trestbps >= 120:
        recommendations.append({
            "category": "Blood Pressure",
            "finding": f"Resting BP is {trestbps} mmHg (elevated)",
            "action": "Monitor BP daily, reduce processed food intake.",
            "priority": "Medium"
        })

    # Cholesterol
    chol = input_data.get('chol', 0)
    if chol >= 240:
        recommendations.append({
            "category": "Cholesterol",
            "finding": f"Cholesterol is {chol} mg/dL (high)",
            "action": "Adopt a low-saturated-fat diet. Consult doctor about statins.",
            "priority": "High"
        })
    elif chol >= 200:
        recommendations.append({
            "category": "Cholesterol",
            "finding": f"Cholesterol is {chol} mg/dL (borderline)",
            "action": "Increase fiber intake, reduce fried foods, exercise regularly.",
            "priority": "Medium"
        })

    # Max heart rate
    thalach = input_data.get('thalach', 0)
    age     = input_data.get('age', 50)
    max_expected = 220 - age
    if thalach < 0.85 * max_expected:
        recommendations.append({
            "category": "Heart Rate",
            "finding": f"Max heart rate {thalach} bpm is low for age {age}",
            "action": "Gradually increase aerobic activity. Start with 20 min walks daily.",
            "priority": "Medium"
        })

    # Fasting blood sugar
    fbs = input_data.get('fbs', 0)
    if fbs == 1:
        recommendations.append({
            "category": "Blood Sugar",
            "finding": "Fasting blood sugar > 120 mg/dL",
            "action": "Reduce sugar and refined carbs. Get HbA1c tested. Consider diabetes screening.",
            "priority": "High"
        })

    # Exercise-induced angina
    exang = input_data.get('exang', 0)
    if exang == 1:
        recommendations.append({
            "category": "Exercise Angina",
            "finding": "Chest pain during exercise reported",
            "action": "Avoid strenuous exercise until cleared by a doctor. Track symptoms.",
            "priority": "High"
        })

    # Oldpeak (ST depression)
    oldpeak = input_data.get('oldpeak', 0)
    if oldpeak >= 2.0:
        recommendations.append({
            "category": "ST Depression",
            "finding": f"ST depression (oldpeak) is {oldpeak} — abnormal",
            "action": "This indicates possible ischemia. Seek cardiology evaluation.",
            "priority": "High"
        })

    # Age
    if age >= 60:
        recommendations.append({
            "category": "Age Risk",
            "finding": f"Age {age} is a non-modifiable risk factor",
            "action": "Schedule annual cardiac checkups. Stay physically active.",
            "priority": "Low"
        })

    # Sex
    sex = input_data.get('sex', 0)
    if sex == 1 and age >= 45:
        recommendations.append({
            "category": "Demographics",
            "finding": "Male aged 45+ — elevated baseline risk",
            "action": "Regular screening recommended. Monitor BP and cholesterol annually.",
            "priority": "Low"
        })

    # Low risk positive reinforcement
    if risk_score < 0.40:
        recommendations.append({
            "category": "General",
            "finding": "Your risk profile looks healthy",
            "action": "Maintain current lifestyle. Continue regular checkups.",
            "priority": "Low"
        })

    # Sort by priority
    priority_order = {"High": 0, "Medium": 1, "Low": 2}
    recommendations.sort(key=lambda x: priority_order[x["priority"]])

    return {
        "risk_score":      round(risk_score * 100, 1),
        "risk_level":      risk_level,
        "alert":           alert,
        "recommendations": recommendations
    }