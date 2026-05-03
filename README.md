# AI Interview Preparation Platform

A full-stack AI-powered platform to help students prepare for technical interviews. Answer questions and get scored by a semantic similarity ML model.

**Author:** Varonika Rai

---

## Tech Stack

- **ML:** Python, Sentence Transformers (all-MiniLM-L6-v2), Cosine Similarity
- **Backend:** FastAPI, Uvicorn, Python
- **Frontend:** React.js, Axios, MUI
- **DevOps:** Docker, Kubernetes

---

## Folder Structure

```
ai-interview-platform/
├── backend/
│   ├── main.py                  ← FastAPI entry point (must be here)
│   ├── app/
│   │   ├── __init__.py
│   │   ├── routes/
│   │   │   ├── __init__.py
│   │   │   ├── interview.py     ← /evaluate-answer endpoint
│   │   │   └── resume.py        ← /upload-resume endpoint
│   │   └── services/
│   │       ├── __init__.py
│   │       ├── answer_evaluator.py
│   │       ├── question_generator.py
│   │       └── skill_extractor.py
│   └── venv/
├── frontend/
│   └── react-app/
│       └── src/
│           ├── components/      ← Navbar, QuestionCard, AnswerBox, ScoreCard
│           ├── pages/           ← InterviewPage.js
│           ├── App.js
│           └── App.css
├── ml-model/
│   ├── dataset/
│   │   └── interview_qa.csv
│   ├── model/
│   │   └── answer_model.pkl     ← generated after training
│   ├── train_model.py
│   └── inference.py
├── docker/
│   └── Dockerfile
└── k8s/
    └── deployment.yaml
```

---

## Setup & Run

### Step 1 — Install dependencies (run once)

```bash
cd ai-interview-platform/backend
python -m venv venv
venv\Scripts\activate
pip install fastapi uvicorn sentence-transformers PyPDF2 pandas scikit-learn
```

### Step 2 — Create `__init__.py` files (run once)

```bash
echo. > app\__init__.py
echo. > app\routes\__init__.py
echo. > app\services\__init__.py
```

### Step 3 — Train the ML model (run once)

```bash
cd ai-interview-platform/backend
venv\Scripts\activate
cd ..\ml-model
python train_model.py
```

Expected output:
```
Generating embeddings...
Model saved successfully!
```

---

## Running the Project

> You need **two terminals open at the same time**

### Terminal 1 — Backend

```bash
cd ai-interview-platform/backend
venv\Scripts\activate
uvicorn main:app --reload
```

Expected output:
```
INFO: Uvicorn running on http://127.0.0.1:8000
```

### Terminal 2 — Frontend

```bash
cd ai-interview-platform/frontend/react-app
npm start
```

Opens at: `http://localhost:3000`

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/evaluate-answer` | Evaluate interview answer, returns score 0-10 |
| POST | `/upload-resume` | Upload PDF resume, returns extracted text |

**Example request:**
```json
POST /evaluate-answer
{ "answer": "Stack uses LIFO, Queue uses FIFO" }
```

**Example response:**
```json
{ "score": 7.3 }
```

---

## Common Errors

**`uvicorn not recognized`**
```bash
pip install uvicorn
```
Make sure `(venv)` is active first.

**`ModuleNotFoundError: No module named pandas`**
```bash
pip install pandas scikit-learn sentence-transformers
```

**`Could not import module main`**
You are running uvicorn from the wrong folder. Run it from `backend/` where `main.py` is located.

**`Could not connect to backend`**
Backend is not running. Check Terminal 1 for errors. Make sure you see `Running on http://127.0.0.1:8000`.