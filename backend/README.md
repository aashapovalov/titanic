# Titanic Survival Prediction API

Simple Flask backend that serves predictions from a trained Random Forest model.

## 📋 Requirements

- Python 3.8 or higher
- pip (Python package installer)

## 🚀 Setup Instructions

### 1. Install Python Dependencies

```bash
# Navigate to backend directory
cd backend

# Install required packages
pip install -r requirements.txt
```

### 2. Add Model Files

Make sure these files are in the `backend/` directory:
- `titanic_rf.joblib` - Your trained Random Forest model
- `metadata.json` - Model metadata with feature mappings

### 3. Run the Server

```bash
python api.py
```

The server will start at `http://localhost:5000`

## 🧪 Testing the API

### Health Check
```bash
curl http://localhost:5000/
```

### Get Prediction
```bash
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "Pclass": 1,
    "gender_code": 1,
    "Age": 30,
    "embarked_code": 1,
    "family_size": 2
  }'
```

## 📊 API Endpoints

### GET `/`
Health check endpoint

**Response:**
```json
{
  "status": "running",
  "message": "Titanic Survival Prediction API",
  "model_loaded": true
}
```

### POST `/predict`
Get survival probability prediction

**Request Body:**
```json
{
  "Pclass": 1,           // Ticket class: 1 (1st), 2 (2nd), 3 (3rd)
  "gender_code": 1,      // 1 = female, 2 = male
  "Age": 30,             // Age in years: 0-80
  "embarked_code": 1,    // 1 = Southampton, 2 = Cherbourg, 3 = Queenstown
  "family_size": 2       // Family size: 1, 2, 3, or 4
}
```

**Response:**
```json
{
  "survival_probability": 0.75,
  "survival_percentage": "75.0%",
  "features_used": {
    "class": 1,
    "gender": "female",
    "age": 30,
    "port": "Southampton",
    "family_size": 2
  }
}
```

## 🔧 Feature Encoding

### Gender
- `1` = female
- `2` = male

### Port (embarked_code)
- `1` = Southampton (S)
- `2` = Cherbourg (C)
- `3` = Queenstown (Q)

### Ticket Class (Pclass)
- `1` = 1st class
- `2` = 2nd class
- `3` = 3rd class

### Family Size
- `1` = traveling alone
- `2` = family of 2 (including passenger)
- `3` = family of 3 (including passenger)
- `4` = family of 4 (including passenger)

## 🐛 Troubleshooting

### Port already in use
If port 5000 is already in use, change it in `api.py`:
```python
app.run(debug=True, port=5001)  # Use different port
```

### Model not loading
Make sure `titanic_rf.joblib` is in the same directory as `api.py`

### CORS errors
The API includes CORS headers to allow frontend connections. If you still get errors, check that `flask-cors` is installed.

## 📝 Notes

- The API runs in debug mode for development
- For production, use a proper WSGI server like Gunicorn
- The model expects features in this exact order: Pclass, gender_code, Age, embarked_code, family_size