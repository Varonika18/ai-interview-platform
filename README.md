# AI Interview Preparation Platform

A full-stack web application that helps students prepare for technical placement interviews. Select a subject and difficulty, answer questions, and receive an ML-powered score with detailed feedback — what you got right, what was missing, and how to improve.

**Author:** Varonika Rai  
**Live Demo:** https://varonika18.github.io/ai-interview-platform

---

## Features

- **10 subjects** — Python, Java, C, C++, OOPs, OS, CN, DBMS, SQL, Mix All
- **3 difficulty levels** — Easy, Medium, Hard
- **Selectable question count** — 5, 10, 20, or 50 questions per session
- **ML-based scoring** — your own trained sentence-transformer model scores answers 0–10
- **Detailed feedback** — what was good, what was missing, how to improve
- **Google Sign-In + Email/Password auth** — powered by Firebase Authentication
- **Attempt history** — every session saved to Firestore; view scores and feedback anytime
- **Profile page** — update display name, see total sessions / avg score / best score
- **Dark / Light mode** — toggleable, persisted in localStorage
- **Responsive UI** — works on desktop and mobile

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, React Router v7, Axios, Firebase SDK v12, MUI |
| Backend | FastAPI, Uvicorn, Python 3.10+ |
| ML Model | sentence-transformers (all-MiniLM-L6-v2), scikit-learn, pandas, pickle |
| Auth & Database | Firebase Authentication, Cloud Firestore |
| Deployment | GitHub Pages (frontend), Docker + Kubernetes (backend) |

---

## Project Structure

```
ai-interview-platform/
│
├── backend/                          ← FastAPI server
│   ├── main.py                       ← App entry point, CORS config
│   ├── requirements.txt
│   ├── venv/                         ← Python virtual environment (not committed)
│   └── app/
│       ├── routes/
│       │   ├── interview.py          ← /questions and /evaluate-answer endpoints
│       │   └── resume.py             ← /upload-resume endpoint
│       └── services/
│           ├── answer_evaluator.py   ← Loads pkl model, scores answers, generates feedback
│           ├── question_generator.py ← Returns questions from built-in question bank
│           └── skill_extractor.py    ← Keyword-based skill extraction from resume text
│
├── frontend/
│   └── react-app/
│       ├── package.json
│       └── src/
│           ├── App.js                ← Router setup (HashRouter for GitHub Pages)
│           ├── firebase.js           ← Firebase app init and exports
│           ├── contexts/
│           │   ├── AuthContext.js    ← currentUser, login, logout, updateDisplayName
│           │   └── ThemeContext.js   ← Light/dark color tokens, toggleTheme
│           ├── components/
│           │   ├── Navbar.js         ← Top bar with theme toggle and profile link
│           │   ├── QuestionCard.js   ← Displays the current question
│           │   ├── AnswerBox.js      ← Textarea + Submit button
│           │   └── ScoreCard.js      ← Score bar + 3 feedback sections
│           └── pages/
│               ├── LoginPage.js      ← Google sign-in + email/password login
│               ├── InterviewPage.js  ← Subject/difficulty/count selector + quiz flow
│               └── ProfilePage.js    ← Stats, attempt history, edit name, sign out
│
├── ml-model/
│   ├── dataset/
│   │   └── interview_qa.csv          ← Training data: question, answer, skill columns
│   ├── model/
│   │   └── answer_model.pkl          ← Generated after training (not committed to git)
│   ├── train_model.py                ← Reads CSV, generates embeddings, saves pkl
│   └── inference.py                  ← Standalone test script for the model
│
├── docker/
│   └── Dockerfile                    ← Builds backend Docker image
│
└── k8s/
    └── deployment.yaml               ← Kubernetes deployment (2 replicas, port 8000)
```

---

## One-Time Setup

### Prerequisites

- Python 3.10 or higher — https://www.python.org/downloads/
- Node.js 18 or higher — https://nodejs.org/
- A free Firebase project — https://console.firebase.google.com

---

### Step 1 — Clone the repo

```bash
git clone https://github.com/varonika18/ai-interview-platform.git
cd ai-interview-platform
```

---

### Step 2 — Backend: create virtual environment and install packages

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

Create the required `__init__.py` files (run once, Windows):

```bash
echo. > app\__init__.py
echo. > app\routes\__init__.py
echo. > app\services\__init__.py
echo. > app\database\__init__.py
```

---

### Step 3 — Train the ML model (run once)

The backend cannot start without `answer_model.pkl`. The training script reads the CSV dataset, generates sentence embeddings for all reference answers using `all-MiniLM-L6-v2`, and saves them to a pickle file.

```bash
cd ..\ml-model
python train_model.py
```

Expected output:
```
Generating embeddings...
Model saved successfully!
```

The file `ml-model/model/answer_model.pkl` will be created. You only need to re-run this if you edit `interview_qa.csv`.

---

### Step 4 — Firebase setup

The app uses Firebase for user authentication and storing attempt history. You need your own project (free tier is enough).

**4a. Create a Firebase project**

1. Go to https://console.firebase.google.com
2. Click **Add project** → enter any name → click through the prompts → **Create project**

**4b. Register the web app and get config**

1. In the project dashboard, click the **`</>`** (Web) icon
2. Enter an app nickname (e.g. `interview-app`) → click **Register app**
3. Copy the `firebaseConfig` object shown on screen

**4c. Enable Authentication**

1. Go to **Authentication** → **Sign-in method**
2. Enable **Google** → save
3. Enable **Email/Password** → save

**4d. Enable Firestore**

1. Go to **Firestore Database** → **Create database**
2. Select **Start in test mode** → choose a region → **Done**

**4e. Paste config into the project**

Open `frontend/react-app/src/firebase.js` and replace the values:

```js
const firebaseConfig = {
  apiKey:            "your-api-key",
  authDomain:        "your-project.firebaseapp.com",
  projectId:         "your-project-id",
  storageBucket:     "your-project.firebasestorage.app",
  messagingSenderId: "your-sender-id",
  appId:             "your-app-id",
};
```

---

### Step 5 — Frontend: install packages

```bash
cd frontend/react-app
npm install
```

---

## Running the Project

Open **two terminals** at the same time.

### Terminal 1 — Start the Backend

```bash
cd backend
venv\Scripts\activate
uvicorn main:app --reload
```

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
```

### Terminal 2 — Start the Frontend

```bash
cd frontend/react-app
npm start
```

The browser opens automatically at **http://localhost:3000**

---

## How the Scoring Works

When you submit an answer, this happens:

1. The frontend sends `{ question, answer }` to `POST /evaluate-answer`
2. The backend encodes your answer into a vector using `all-MiniLM-L6-v2`
3. That vector is compared (cosine similarity) against all reference answer embeddings in `answer_model.pkl`
4. The highest similarity score is converted to a 0–10 scale using a calibrated formula
5. Keywords in your answer are compared to the best-matching reference answer to identify what you covered and what you missed
6. The backend returns `{ score, what_was_good, what_was_missing, how_to_improve }`

**Score scale:**

| Cosine Similarity | Score |
|---|---|
| Below 0.10 | 0 — off-topic or empty |
| ~0.25 | 2 — very weak |
| ~0.40 | 4 — average |
| ~0.55 | 6 — good |
| ~0.70 | 9 — excellent |

---

## Adding Your Own Training Data

The ML model learns from `ml-model/dataset/interview_qa.csv`. Each row has three columns:

```
question,answer,skill
What is a closure?,A closure is a function that remembers variables from its enclosing scope,python
What is a deadlock?,A deadlock occurs when two or more processes wait for each other to release resources,os
```

To add your own Q&A pairs:
1. Edit `interview_qa.csv` and add rows
2. Re-run the training script:
   ```bash
   cd ml-model
   python train_model.py
   ```
3. Restart the backend

The more high-quality reference answers you add, the better the scoring becomes.

---

## API Reference

### `GET /questions`

Returns interview questions for a given subject and difficulty.

| Parameter | Type | Default | Description |
|---|---|---|---|
| `subject` | string | required | `python` `java` `c` `cpp` `oops` `os` `cn` `dbms` `sql` `mix` |
| `difficulty` | string | required | `easy` `medium` `hard` |
| `count` | integer | `5` | Number of questions to return |

**Example request:**
```
GET /questions?subject=python&difficulty=medium&count=10
```

**Example response:**
```json
{
  "questions": [
    "What is Python GIL and why does it matter?",
    "What are decorators in Python? Give an example.",
    "What is the difference between deep copy and shallow copy?"
  ]
}
```

---

### `POST /evaluate-answer`

Scores a candidate's answer against the trained ML model.

**Request body:**
```json
{
  "question": "What is Python GIL and why does it matter?",
  "answer": "GIL stands for Global Interpreter Lock. It allows only one thread to run Python bytecode at a time, which limits multi-threading performance."
}
```

**Response:**
```json
{
  "score": 6.4,
  "what_was_good": "Strong answer covering key concepts: lock, thread, bytecode, interpreter.",
  "what_was_missing": "Missing depth on: performance, multiprocessing, cpython, workaround.",
  "how_to_improve": "Expand with more technical detail and a real-world example of how to work around GIL using multiprocessing."
}
```

---

### `POST /upload-resume`

Accepts a PDF resume and returns extracted text.

**Request:** `multipart/form-data`, field name: `file`

**Response:**
```json
{
  "resume_text": "John Doe\nSoftware Engineer\nSkills: Python, React, Docker..."
}
```

---

## Attempt History Data Structure

Each completed session is saved to the `attempts` Firestore collection:

```json
{
  "uid": "firebase-user-uid",
  "subject": "python",
  "difficulty": "medium",
  "questionCount": 10,
  "avgScore": 6.2,
  "attemptedAt": "Firestore Timestamp",
  "history": [
    {
      "question": "What is Python GIL?",
      "answer": "GIL stands for Global Interpreter Lock...",
      "score": 6.4,
      "feedback": {
        "what_was_good": "Covered lock, thread, bytecode.",
        "what_was_missing": "Did not mention multiprocessing or cpython.",
        "how_to_improve": "Add a real-world example of working around GIL."
      }
    }
  ]
}
```

You can view all past sessions on the **Profile** page. Click any session row to expand it and see per-question scores and feedback.

---

## Deployment

### Frontend — GitHub Pages

```bash
cd frontend/react-app
npm run deploy
```

This builds the app and pushes it to the `gh-pages` branch. The `"homepage"` field in `package.json` controls the URL.

> The app uses `HashRouter` instead of `BrowserRouter` so GitHub Pages can handle client-side routing without a 404 on refresh.

---

### Backend — Docker

Build:
```bash
docker build -f docker/Dockerfile -t ai-interview-backend .
```

Run:
```bash
docker run -p 8000:8000 ai-interview-backend
```

---

### Backend — Kubernetes

```bash
kubectl apply -f k8s/deployment.yaml
```

Deploys 2 replicas of the backend on port 8000. Assumes the Docker image is already available in your registry.

---

## Common Errors and Fixes

**`uvicorn: command not found` or `uvicorn not recognized`**

The virtual environment is not active. Run:
```bash
venv\Scripts\activate
pip install uvicorn
```

---

**`ModuleNotFoundError: No module named 'sentence_transformers'`**

Install the missing package inside the activated venv:
```bash
pip install sentence-transformers
```

---

**`FileNotFoundError: answer_model.pkl`**

The model has not been trained yet. Run:
```bash
cd ml-model
python train_model.py
```

---

**`ModuleNotFoundError: No module named 'app'`**

You are running `uvicorn` from the wrong folder. Navigate to the `backend/` directory first:
```bash
cd backend
uvicorn main:app --reload
```

---

**`Could not connect to backend` (shown in the UI)**

The FastAPI server is not running or crashed. Check Terminal 1 for errors. Make sure you see:
```
INFO: Uvicorn running on http://127.0.0.1:8000
```

---

**Score is always 0**

Your answer is either too short or completely off-topic. Write at least 2–3 sentences directly addressing the question using the relevant technical terms.

---

**Attempt not saving to history**

Open the browser DevTools console (F12) and check for errors. Common causes:
- Firestore is not enabled in your Firebase project
- Firestore rules are blocking writes (use test mode during development)
- Wrong Firebase config values in `firebase.js`

---

**Google Sign-In popup blocked**

Allow popups for `localhost:3000` in your browser, or temporarily disable the popup blocker for this site.
