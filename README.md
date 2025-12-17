# 🚢 Titanic Survival Simulator

An interactive web experience that lets users explore **their chances of surviving the Titanic disaster**, based on real historical data and a machine-learning model.

The project combines:
- a **TypeScript frontend** with rich visual effects and character generation
- a **Python (Flask) backend** that serves a trained ML model for survival prediction

---

## ✨ Features

- Interactive hero scene with animated effects (waves, snow, birds)
- Passenger profile builder:
  - gender
  - age (with age buckets)
  - ticket class
  - port of departure
  - family composition
- Deterministic family generation rules (no random chaos)
- Real survival probability prediction using a trained RandomForest model
- Clear separation between frontend and backend

---

## 🧱 Project Structure

```
titanic/
├── dist/                # Built frontend (served in browser)
├── src/                 # Frontend TypeScript source
│   ├──public/           # Static assets (images, audio)
├── backend/             # Python Flask API + ML model
│   ├── api.py
│   ├── titanic_rf.joblib
│   ├── metadata.json
│   └── requirements.txt
├── index.html
├── styles.css
├── webpack.config.js
├── tsconfig.json
└── README.md
```

---

## ⚠️ Important Architecture Note

**Frontend and backend are two separate applications.**

- The frontend is a static website (HTML/CSS/JS) served from `dist/`
- The backend is a Python server that must be running separately
- The backend is **NOT** built into `dist` and **NOT** started automatically

Both must be running at the same time.

---

## 🖥️ Frontend Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Build frontend
```bash
npm run build
```

This creates the `dist/` folder with bundled JavaScript.

### 3. Serve frontend
```bash
npm run serve
```

By default, the site will be available at:
```
http://127.0.0.1:8080
```

---

## 🧠 Backend Setup (ML Prediction API)

### 1. Go to backend folder
```bash
cd backend
```

### 2. Create and activate virtual environment
```bash
python -m venv .venv
source .venv/bin/activate
```

### 3. Install Python dependencies
```bash
pip install -r requirements.txt
```

### 4. Run the backend server
```bash
python api.py
```

The API will run on:
```
http://127.0.0.1:5001
```

---

## 🔗 Frontend ↔ Backend Communication

The frontend sends POST requests to:

```
http://<current-host>:5001/predict
```

The API endpoint is dynamically derived from the page hostname, so it works for:
- `127.0.0.1`
- `localhost`
- local network IPs (e.g. `192.168.x.x`)

### Example request payload
```json
{
  "Pclass": 3,
  "gender_code": 2,
  "Age": 30,
  "embarked_code": 1,
  "family_size": 1
}
```

### Example response
```json
{
  "survival_probability": 0.153,
  "survival_percentage": "15.3%"
}
```

---

## 🧬 Machine Learning Model

- Model: `RandomForestClassifier`
- Trained on Kaggle Titanic dataset
- Features used:
  - `Pclass`
  - `gender_code`
  - `Age`
  - `embarked_code`
  - `family_size`

Metadata is stored in `backend/metadata.json`.

---

## 👤 Author

Created by **Aleksei Shapovalov**  
An experimental project combining frontend engineering, data visualization, and applied machine learning.
