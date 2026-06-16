# InterviewAI — AI-Powered Technical Interview Practice Platform

> A full-stack web application that simulates real technical interview sessions, evaluates your answers using a Machine Learning model, reveals model answers when you're stuck, and tracks your performance history — built to help CS students crack placement interviews.

**Live Demo:** [https://varonika18.github.io/ai-interview-platform](https://varonika18.github.io/ai-interview-platform)
**Author:** Varonika Rai | [GitHub](https://github.com/Varonika18)

---

## Run Locally — 2 Terminals Required

> Open both terminals together. The app will not work with only one.

### Terminal 1 — Backend (FastAPI)

```bash
cd backend
venv\Scripts\activate
uvicorn main:app --reload
```

You should see:
```
INFO:  Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
```
API docs available at: **http://127.0.0.1:8000/docs**

---

### Terminal 2 — Frontend (React)

```bash
cd frontend/react-app
npm start
```

Browser opens automatically at: **http://localhost:3000**

---

## What This Project Does

1. User logs in with Google or Email/Password (Firebase Auth)
2. Selects a subject, difficulty level, and number of questions
3. Frontend fetches questions from the FastAPI backend
4. User types an answer — the backend ML model scores it 0–10 using semantic similarity
5. Structured feedback is shown: what was good, what was missing, how to improve
6. If stuck, user clicks **"I Don't Know"** — the correct model answer is revealed instantly
7. At the end of the session, results and full feedback are saved to Firebase Firestore
8. Profile page shows all past attempts with scores and per-question feedback

---

## Tech Stack

| Layer | Technology | Why This Was Chosen |
|---|---|---|
| Frontend | React 19, React Router v7 | Component-based UI, fast re-renders, industry standard |
| Auth & Database | Firebase Auth + Firestore | Handles login/sessions/storage without building a backend auth system |
| HTTP Client | Axios | Promise-based, cleaner than fetch, easy error handling |
| Backend | FastAPI (Python) | Auto-generates API docs, async support, minimal boilerplate |
| ML Model | Sentence Transformers (`all-MiniLM-L6-v2`) | Lightweight model for semantic text similarity, runs locally |
| Deployment | GitHub Pages + Render | Both free tiers, GitHub Pages for static frontend, Render for Python backend |

---

## Architecture — How the Parts Connect

```
 ┌─────────────────────────────────────────────────────────┐
 │                  User's Browser                         │
 │                                                         │
 │   React App (hosted on GitHub Pages)                    │
 │       │                                                 │
 │       ├──► Firebase Auth    login / session state       │
 │       ├──► Firestore DB     save / load attempt history │
 │       └──► Axios HTTP ──────────────────────────────┐   │
 └────────────────────────────────────────────────────-|───┘
                                                       │
                              HTTPS API calls          │
                                                       ▼
                         ┌──────────────────────────────────┐
                         │   FastAPI Backend (Render.com)   │
                         │                                  │
                         │  GET  /questions                 │
                         │  POST /evaluate-answer  ──► ML   │
                         │  GET  /solution                  │
                         └──────────────────────────────────┘
```

**Key insight:** GitHub Pages can ONLY serve static files (HTML/CSS/JS). It cannot run Python. That is why the backend is deployed separately on Render — it needs an actual server process running.

---

## Project Structure

```
ai-interview-platform/
│
├── backend/                             ← Python FastAPI backend
│   ├── main.py                          ← App entry, CORS config
│   ├── requirements.txt                 ← Python dependencies
│   └── app/
│       ├── routes/
│       │   └── interview.py             ← 3 API endpoints
│       └── services/
│           ├── question_generator.py    ← 150 Q&A pairs, question/solution lookup
│           └── answer_evaluator.py      ← ML scoring engine + feedback generator
│
├── frontend/
│   └── react-app/
│       ├── .env.development             ← API URL for local dev (http://127.0.0.1:8000)
│       ├── .env.production              ← API URL for deployed app (Render URL)
│       ├── package.json                 ← Scripts: start, build, deploy
│       └── src/
│           ├── App.js                   ← Root component, HashRouter, route definitions
│           ├── firebase.js              ← Firebase app initialization
│           ├── contexts/
│           │   ├── AuthContext.js       ← Global auth state via React Context
│           │   └── ThemeContext.js      ← Light/dark theme tokens
│           ├── components/
│           │   ├── Navbar.js            ← Sticky top bar, theme toggle, profile avatar
│           │   ├── QuestionCard.js      ← Displays current question
│           │   ├── AnswerBox.js         ← Textarea, Submit button, I Don't Know button
│           │   └── ScoreCard.js         ← Score bar, feedback, model answer reveal
│           └── pages/
│               ├── LoginPage.js         ← Google + Email/Password auth UI
│               ├── InterviewPage.js     ← Full interview flow (select → quiz → results)
│               └── ProfilePage.js       ← Past attempts, stats, edit name
│
└── ml-model/
    ├── train_model.py                   ← Generates embeddings and saves answer_model.pkl
    ├── dataset/interview_qa.csv         ← Reference Q&A training data
    └── model/answer_model.pkl           ← Pre-computed embeddings loaded by backend
```

---

## How Each Part Works (In Detail)

### Frontend — React App

**`App.js`**
Sets up the entire app shell. Uses `HashRouter` (not `BrowserRouter`) because GitHub Pages is a static file server — it does not understand paths like `/profile`. With HashRouter, all routes use the `#` symbol (`/#/profile`) so the browser always loads `index.html` and React handles routing internally on the client side. Wraps everything in `AuthProvider` and `ThemeProvider` so these are available globally.

**`firebase.js`**
Initializes the Firebase app using the project config (API key, project ID, etc.). Exports three things used across the app: `auth` (for login/logout), `db` (Firestore, for saving attempts), and `googleProvider` (for Google OAuth popup).

**`contexts/AuthContext.js`**
Wraps Firebase Authentication in React Context so any component can access `currentUser`, `signInWithGoogle()`, `signInWithEmail()`, `signUpWithEmail()`, and `logout()` without prop drilling. Uses `onAuthStateChanged` listener — when Firebase detects a session change (login/logout/token refresh), it automatically updates `currentUser` across the entire app.

**`contexts/ThemeContext.js`**
Manages light/dark mode. Stores the preference in `localStorage` so it persists across page refreshes. Provides a `colors` object with all UI color tokens (background, text, border, surface, etc.) used by every component — no CSS framework, all inline styles.

**`pages/LoginPage.js`**
Handles three authentication methods: Google sign-in (popup), email login, and email signup. Firebase returns specific error codes like `auth/invalid-credential` (wrong password in newer Firebase SDK) or `auth/email-already-in-use` — these are mapped to user-friendly messages. The signup tab uses `createUserWithEmailAndPassword` which accepts any valid email + 6-char password and creates a new Firebase user.

**`pages/InterviewPage.js`**
The core feature. Three screens:
- **Select screen:** User picks subject (10 options), difficulty (Easy/Medium/Hard), question count (5/10/20/50). Calls `GET /questions` when "Start" is clicked.
- **Quiz screen:** Shows one question at a time. User types answer and either submits it for scoring (calls `POST /evaluate-answer`) or clicks "I Don't Know" (calls `GET /solution`, sets score to 0). Each response is added to a local `history` array.
- **Results screen:** Shows average score, per-question breakdown. Saves the full session to Firestore `attempts` collection with the user's `uid` as owner.

Uses `process.env.REACT_APP_API_URL` for the backend URL — in development this reads from `.env.development` (localhost), in production from `.env.production` (Render URL). This allows the same code to work in both environments.

**`components/AnswerBox.js`**
Contains the textarea and two action buttons. "Evaluate Answer" is disabled until the user types something. "I Don't Know — Show Answer" is visible only before submission. Both buttons are disabled once a submission is made (prevents double submitting). The `disabled` prop on the textarea locks it after submission.

**`components/ScoreCard.js`**
Shown only after submission (`score !== null`). Displays: emoji + grade label (Excellent/Good/Average/Needs Work), animated score progress bar, three feedback sections (What was good / What was missing / How to improve), an optional yellow "Model Answer" box (shown only when "I Don't Know" was used), and the Next Question / See Results button.

---

### Backend — FastAPI

**`main.py`**
Creates the FastAPI app. Configures CORS (Cross-Origin Resource Sharing) middleware to allow the frontend to call the backend — without this, browsers block requests between different origins (localhost:3000 calling localhost:8000 is cross-origin). Lists `http://localhost:3000` and `https://varonika18.github.io` as allowed origins.

**`app/routes/interview.py`** — Three endpoints:

| Endpoint | Method | What it does |
|---|---|---|
| `/questions` | GET | Returns `count` random questions for given `subject` + `difficulty` |
| `/evaluate-answer` | POST | Scores a `{question, answer}` pair using the ML model, returns score + feedback |
| `/solution` | GET | Returns the hardcoded correct answer for a specific question by exact match |

**`app/services/question_generator.py`**
Contains the complete question bank: **10 subjects × 3 difficulty levels × 5 questions = 150 Q&A pairs**. Each entry is a tuple `(question_string, answer_string)`. Two functions:
- `generate_questions(subject, difficulty, count)` — returns a random sample of just the question strings (answer is kept server-side)
- `get_solution_for_question(question)` — does an exact string match to find and return the correct answer for a given question

**`app/services/answer_evaluator.py`**
The ML engine — runs once on startup:
1. Loads `all-MiniLM-L6-v2` sentence transformer model (~90MB, downloads automatically on first run)
2. Loads pre-computed reference answer embeddings from `answer_model.pkl`

For each answer submitted:
1. Encodes the user's answer text into a 384-dimensional vector
2. Computes cosine similarity between that vector and all reference embeddings
3. Takes the highest similarity score and calibrates it: `(sim - 0.10) / 0.30 × 10` — maps range [0.10 → 0.40] to [0 → 10]
4. Extracts keywords from user answer and reference answer, compares them to identify covered/missing concepts
5. Selects feedback text based on score band (≥8, ≥6, ≥4, ≥2, <2)

---

### ML Model — How Scoring Works

`all-MiniLM-L6-v2` is a lightweight sentence transformer that maps any text to a fixed 384-dimensional vector where semantically similar texts have vectors that are close together.

**Example:** "TCP ensures reliable delivery through acknowledgments" and "TCP is connection-oriented and guarantees packet ordering" have very different words but high cosine similarity (~0.55) because they describe the same concept.

**Calibration:** Raw cosine similarity from this model for correct but differently-worded answers falls in the 0.15–0.40 range. The formula `(sim - 0.10) / 0.30 × 10` maps this realistic range to 0–10. Similarity below 0.10 = off-topic (score 0). Similarity ≥ 0.40 = full marks.

**Training (`train_model.py`):** Reads reference Q&A pairs from `interview_qa.csv`, encodes all reference answers into vectors using the same model, and saves `{answers, embeddings}` as a pickle file. This pre-computation means scoring requests are fast (no re-encoding reference answers each time).

---

### Authentication Flow

```
User enters email + password
        │
        ▼
Firebase SDK (in browser)
        │
        ▼
Firebase Auth Servers (Google's infrastructure)
        │
        ▼
Returns JWT token → stored in browser session
        │
        ▼
onAuthStateChanged fires → updates currentUser in AuthContext
        │
        ▼
Protected routes check currentUser → allow access or redirect to /login
        │
        ▼
On saving attempt → uses currentUser.uid as Firestore document owner
```

Firebase handles password hashing, session management, token refresh, and security — we never store passwords ourselves.

---

### Why Two Deployments Are Needed

| | GitHub Pages | Render |
|---|---|---|
| What it is | CDN that serves static files | Server that runs code |
| Can run Python | No | Yes |
| Can run Node/npm | No | Yes |
| Frontend (HTML/JS/CSS) | Yes | Yes |
| FastAPI backend | No | Yes |
| Cost | Free | Free (with sleep after 15 min inactivity) |

The React app compiles to plain HTML, CSS, and JavaScript files — any static host can serve these. FastAPI is a Python process that must actively run to respond to requests — it needs a real server.

---

## API Reference

### `GET /questions`

Returns randomized questions for a subject and difficulty.

**Query Parameters:**

| Parameter | Type | Required | Values |
|---|---|---|---|
| `subject` | string | yes | `python` `java` `c` `cpp` `oops` `os` `cn` `dbms` `sql` `mix` |
| `difficulty` | string | yes | `easy` `medium` `hard` |
| `count` | integer | no (default: 5) | `5` `10` `20` `50` |

**Example:** `GET /questions?subject=cn&difficulty=easy&count=3`

**Response:**
```json
{
  "questions": [
    "What is the difference between TCP and UDP?",
    "What is DNS and how does it work?",
    "What is the OSI model? Name all 7 layers."
  ]
}
```

---

### `POST /evaluate-answer`

Scores a user's answer using the ML model.

**Request body:**
```json
{
  "question": "What is the difference between TCP and UDP?",
  "answer": "TCP is connection-oriented and reliable. It uses a 3-way handshake and acknowledgments to ensure packets arrive in order. UDP is connectionless and faster but does not guarantee delivery."
}
```

**Response:**
```json
{
  "score": 7.3,
  "what_was_good": "Strong answer covering key concepts: handshake, connection, acknowledgments, reliable.",
  "what_was_missing": "Could also mention: flow control, congestion control, use cases like streaming for UDP.",
  "how_to_improve": "Add a concrete real-world example to make your answer exceptional."
}
```

---

### `GET /solution`

Returns the correct model answer for a question (used by "I Don't Know" button).

**Query Parameters:** `question` (string, exact question text)

**Example:** `GET /solution?question=What%20is%20the%20difference%20between%20TCP%20and%20UDP%3F`

**Response:**
```json
{
  "solution": "TCP (Transmission Control Protocol): connection-oriented (3-way handshake), reliable (acknowledgments, retransmission), ordered delivery, flow control and congestion control, higher overhead — used for HTTP, FTP, email. UDP (User Datagram Protocol): connectionless, faster, no guarantee of delivery or order, low overhead — used for DNS, video streaming, gaming, VoIP."
}
```

---

## Firestore Data Structure

Each completed session is saved as a document in the `attempts` collection:

```json
{
  "uid": "firebase-user-uid",
  "subject": "cn",
  "difficulty": "easy",
  "questionCount": 5,
  "avgScore": 6.8,
  "attemptedAt": "<Firestore Timestamp>",
  "history": [
    {
      "question": "What is the difference between TCP and UDP?",
      "answer": "TCP is reliable and connection-oriented...",
      "score": 7.3,
      "feedback": {
        "what_was_good": "Covered handshake, acknowledgments, reliable.",
        "what_was_missing": "Did not mention flow control or congestion control.",
        "how_to_improve": "Add real-world examples for each protocol."
      }
    }
  ]
}
```

---

## Deployment — Step by Step

### Deploy Backend to Render (one time)

1. Go to [render.com](https://render.com) → sign up with GitHub
2. **New +** → **Web Service** → connect `ai-interview-platform` repo
3. Settings:
   - Root Directory: `backend`
   - Runtime: `Python 3`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Click **Create Web Service** — wait ~5 minutes
5. Copy your URL: `https://ai-interview-backend-xxxx.onrender.com`
6. Paste it into `frontend/react-app/.env.production`

### Deploy Frontend to GitHub Pages

```bash
cd frontend/react-app
npm run deploy
```

This builds the React app and pushes it to the `gh-pages` branch automatically.

> Render free tier sleeps after 15 minutes of inactivity. First API request after sleep takes ~30 seconds to wake up — this is normal.

---

## Common Errors and Fixes

**`Could not connect to backend` in the UI**
Backend is not running. Start Terminal 1 and make sure you see `Uvicorn running on http://127.0.0.1:8000`.

**`FileNotFoundError: answer_model.pkl`**
The ML model has not been trained. Run:
```bash
cd ml-model
python train_model.py
```

**`ModuleNotFoundError: No module named 'app'`**
Running uvicorn from the wrong folder. Make sure you are inside the `backend/` directory.

**`uvicorn: command not found`**
Virtual environment is not activated. Run `venv\Scripts\activate` first.

**Score is always very low (0–2)**
Write at least 2–3 sentences using the correct technical terms. The model measures semantic similarity — vague one-word answers score near 0.

**Login gives "Something went wrong"**
Firebase is rejecting the credentials. Check: Email/Password auth is enabled in Firebase console, or try Google Sign-In instead.

**Deployed site shows backend error**
The `.env.production` file has a placeholder URL. Replace it with your actual Render URL and run `npm run deploy` again.

---

## Features Summary

| Feature | Details |
|---|---|
| Subjects | Python, Java, C, C++, OOPs, OS, CN, DBMS, SQL, Mix All |
| Difficulty | Easy, Medium, Hard |
| Questions per session | 5, 10, 20, or 50 |
| Scoring | ML semantic similarity, 0–10 scale |
| Feedback | 3 sections: good / missing / improve |
| I Don't Know | Reveals correct answer, scores 0, tracks as skipped |
| Session history | Saved to Firestore with per-question breakdown |
| Auth | Google OAuth + Email/Password via Firebase |
| Theme | Light / Dark mode, persisted in localStorage |
| Routing | HashRouter for GitHub Pages compatibility |

---

## Interview Talking Points

**Q: Why FastAPI over Flask?**
FastAPI auto-generates interactive OpenAPI documentation (`/docs`), uses Python type hints for request validation via Pydantic, and is async-first — less boilerplate than Flask for building REST APIs.

**Q: How does the ML scoring work?**
User answers are encoded into 384-dimensional semantic vectors using `all-MiniLM-L6-v2`. Cosine similarity is computed against pre-embedded reference answers. Raw similarity (typically 0.10–0.40 for correct answers) is calibrated linearly to a 0–10 score. Keywords are extracted (minus stop words) to generate specific feedback on what concepts were covered or missed.

**Q: Why HashRouter instead of BrowserRouter?**
GitHub Pages is a static CDN — it only serves files. If a user navigates directly to `/profile`, GitHub Pages looks for a file at that path, finds nothing, and returns 404. HashRouter uses `/#/profile` so the server always loads `index.html` and React handles routing entirely client-side.

**Q: How does Firebase Authentication work here?**
Firebase SDK runs in the browser and talks to Google's auth servers directly. On successful login it returns a JWT token stored in the browser session. The `onAuthStateChanged` listener in `AuthContext` fires on every auth state change and updates `currentUser` globally. Protected routes check this state and redirect to login if null.

**Q: Why are there two deployments?**
GitHub Pages serves static files — it has no runtime to execute Python. The React build output (HTML/JS/CSS) goes to GitHub Pages. The FastAPI backend (a running Python process) goes to Render. The frontend reads the backend URL from an environment variable so the same code works locally and in production.

**Q: How is attempt history stored?**
Each completed session is saved as a Firestore document in the `attempts` collection with the user's `uid` as the owner field. The Profile page queries Firestore for all documents where `uid == currentUser.uid`, ordered by timestamp. Firestore's client SDK handles real-time sync and offline caching automatically.
