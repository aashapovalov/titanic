from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import os

app = Flask(__name__)
CORS(app)

MODEL_PATH = 'titanic_rf.joblib'
METADATA_PATH = 'metadata.json'

print("🚢 Loading Titanic survival model...")
try:
    model = joblib.load(MODEL_PATH)
    print("✅ Model loaded successfully!")
except Exception as e:
    print(f"❌ Error loading model: {e}")
    model = None


@app.route('/', methods=['GET'])
def home():
    """Health check endpoint"""
    return jsonify({
        'status': 'running',
        'message': 'Titanic Survival Prediction API',
        'model_loaded': model is not None
    })


@app.route('/predict', methods=['POST'])
def predict():
    """
    Predict survival probability for a Titanic passenger

    Expected JSON body:
    {
        "Pclass": 1,           // Ticket class: 1, 2, or 3
        "gender_code": 1,      // 1 = female, 2 = male
        "Age": 30,             // Age: 0-80
        "embarked_code": 1,    // 1 = Southampton, 2 = Cherbourg, 3 = Queenstown
        "family_size": 2       // Family size: 1, 2, 3, or 4
    }

    Returns:
    {
        "survival_probability": 0.75,
        "survival_percentage": "75.0%"
    }
    """

    if model is None:
        return jsonify({
            'error': 'Model not loaded'
        }), 500

    try:
        data = request.json

        required_fields = ['Pclass', 'gender_code', 'Age', 'embarked_code', 'family_size']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'error': f'Missing required field: {field}'
                }), 400

        # Extract features in the EXACT order the model expects
        # Order from metadata.json: Pclass, gender_code, Age, embarked_code, family_size
        features = [[
            data['Pclass'],
            data['gender_code'],
            data['Age'],
            data['embarked_code'],
            data['family_size']
        ]]

        print(f"📊 Predicting for features: {features[0]}")


        probabilities = model.predict_proba(features)
        survival_prob = probabilities[0][1]

        print(f"✅ Prediction: {survival_prob * 100:.1f}% survival chance")

        # Return prediction
        return jsonify({
            'survival_probability': float(survival_prob),
            'survival_percentage': f"{survival_prob * 100:.1f}%",
            'features_used': {
                'class': data['Pclass'],
                'gender': 'female' if data['gender_code'] == 1 else 'male',
                'age': data['Age'],
                'port': {1: 'Southampton', 2: 'Cherbourg', 3: 'Queenstown'}[data['embarked_code']],
                'family_size': data['family_size']
            }
        })

    except Exception as e:
        print(f"❌ Prediction error: {e}")
        return jsonify({
            'error': f'Prediction failed: {str(e)}'
        }), 500


if __name__ == '__main__':
    print("\n" + "="*50)
    print("🚢 TITANIC SURVIVAL PREDICTION API")
    print("="*50)
    print(f"📍 Server running at: http://localhost:5000")
    print(f"📊 Model loaded: {model is not None}")
    print(f"🔗 Prediction endpoint: POST http://localhost:5000/predict")
    print("="*50 + "\n")

    app.run(debug=True, port=5001, host='0.0.0.0')