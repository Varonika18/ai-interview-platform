import React, { useState } from 'react';
import axios from 'axios';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import QuestionCard from '../components/QuestionCard';
import AnswerBox from '../components/AnswerBox';
import ScoreCard from '../components/ScoreCard';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { db } from '../firebase';

const SUBJECTS = [
  { id: 'python', label: 'Python',   icon: '🐍' },
  { id: 'java',   label: 'Java',     icon: '☕' },
  { id: 'c',      label: 'C',        icon: '⚙️' },
  { id: 'cpp',    label: 'C++',      icon: '➕' },
  { id: 'oops',   label: 'OOPs',     icon: '🧩' },
  { id: 'os',     label: 'OS',       icon: '💻' },
  { id: 'cn',     label: 'CN',       icon: '🌐' },
  { id: 'dbms',   label: 'DBMS',     icon: '🗄️' },
  { id: 'sql',    label: 'SQL',      icon: '📊' },
  { id: 'mix',    label: 'Mix All',  icon: '🎯' },
];

const DIFFICULTIES = [
  { id: 'easy',   label: 'Easy',   color: '#16a34a', bg: '#f0fdf4', border: '#86efac', desc: 'Basic concepts' },
  { id: 'medium', label: 'Medium', color: '#d97706', bg: '#fffbeb', border: '#fcd34d', desc: 'Intermediate' },
  { id: 'hard',   label: 'Hard',   color: '#dc2626', bg: '#fef2f2', border: '#fca5a5', desc: 'Advanced' },
];

const QUESTION_COUNTS = [5, 10, 20, 50];

const API = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

export default function InterviewPage() {
  const { currentUser } = useAuth();
  const { colors } = useTheme();

  const [screen, setScreen] = useState('select');
  const [subject, setSubject] = useState(null);
  const [difficulty, setDifficulty] = useState(null);
  const [questionCount, setQuestionCount] = useState(5);
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answer, setAnswer] = useState('');
  const [score, setScore] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [saved, setSaved] = useState(false);
  const [solution, setSolution] = useState(null);

  const startQuiz = async () => {
    if (!subject || !difficulty) return;
    try {
      const res = await axios.get(
        `${API}/questions?subject=${subject}&difficulty=${difficulty}&count=${questionCount}`
      );
      setQuestions(res.data.questions);
      setCurrentQ(0);
      setAnswer('');
      setScore(null);
      setFeedback(null);
      setHistory([]);
      setError(null);
      setSaved(false);
      setScreen('quiz');
    } catch {
      setError('Could not connect to backend. Make sure FastAPI is running.');
    }
  };

  const submitAnswer = async () => {
    if (!answer.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${API}/evaluate-answer`, {
        question: questions[currentQ],
        answer,
      });
      const { score: rawScore, what_was_good, what_was_missing, how_to_improve } = res.data;
      const newScore = Math.round(rawScore * 10) / 10;
      const newFeedback = { what_was_good, what_was_missing, how_to_improve };
      setScore(newScore);
      setFeedback(newFeedback);
      setHistory((prev) => [
        ...prev,
        { question: questions[currentQ], answer, score: newScore, feedback: newFeedback },
      ]);
    } catch {
      setError('Could not connect to backend. Make sure FastAPI is running.');
    }
    setLoading(false);
  };

  const saveAttempt = async (sessionHistory) => {
    if (!currentUser) return;
    const avg =
      Math.round(
        (sessionHistory.reduce((a, b) => a + b.score, 0) / sessionHistory.length) * 10
      ) / 10;
    try {
      await addDoc(collection(db, 'attempts'), {
        uid: currentUser.uid,
        subject,
        difficulty,
        questionCount,
        history: sessionHistory,
        avgScore: avg,
        attemptedAt: serverTimestamp(),
      });
      setSaved(true);
    } catch (e) {
      console.error('Failed to save attempt:', e);
    }
  };

  const handleDontKnow = async () => {
    setLoading(true);
    setError(null);
    setSolution(null);
    try {
      const res = await axios.get(
        `${API}/solution?question=${encodeURIComponent(questions[currentQ])}`
      );
      setSolution(res.data.solution);
    } catch {
      setSolution('Could not fetch model answer. Make sure the backend is running.');
    }
    const newEntry = { question: questions[currentQ], answer: '(skipped)', score: 0, feedback: null };
    setHistory((prev) => [...prev, newEntry]);
    setScore(0);
    setFeedback(null);
    setLoading(false);
  };

  const nextQuestion = async (currentHistory) => {
    const finalHistory = currentHistory || history;
    if (currentQ + 1 >= questions.length) {
      await saveAttempt(finalHistory);
      setScreen('results');
      return;
    }
    setCurrentQ((p) => p + 1);
    setAnswer('');
    setScore(null);
    setFeedback(null);
    setError(null);
    setSolution(null);
  };

  const restart = () => {
    setScreen('select');
    setSubject(null);
    setDifficulty(null);
    setQuestions([]);
    setHistory([]);
    setScore(null);
    setFeedback(null);
    setAnswer('');
    setError(null);
    setSaved(false);
    setSolution(null);
  };

  // ─── SELECTION SCREEN ───────────────────────────────────────────────────────
  if (screen === 'select') {
    return (
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '36px 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: colors.text, margin: '0 0 8px' }}>
            Choose Your Subject
          </h1>
          <p style={{ color: colors.textSecondary, fontSize: '15px', margin: 0 }}>
            Select a subject, difficulty, and number of questions to begin
          </p>
        </div>

        <h3 style={{
          fontSize: '13px', fontWeight: '600', color: colors.heading,
          textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px',
        }}>
          Subject
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap: '10px',
          marginBottom: '32px',
        }}>
          {SUBJECTS.map((s) => (
            <button
              key={s.id}
              onClick={() => setSubject(s.id)}
              style={{
                padding: '16px 10px',
                borderRadius: '12px',
                border: subject === s.id
                  ? `2px solid ${colors.subjectSelectedBorder}`
                  : `1.5px solid ${colors.border}`,
                background: subject === s.id ? colors.subjectSelected : colors.surface,
                cursor: 'pointer', textAlign: 'center', transition: 'all 0.15s',
                boxShadow: subject === s.id ? `0 0 0 3px rgba(99,102,241,0.15)` : 'none',
                fontFamily: 'inherit',
              }}
            >
              <div style={{ fontSize: '26px', marginBottom: '6px' }}>{s.icon}</div>
              <div style={{
                fontSize: '13px', fontWeight: '600',
                color: subject === s.id ? colors.subjectSelectedText : colors.heading,
              }}>
                {s.label}
              </div>
            </button>
          ))}
        </div>

        <h3 style={{
          fontSize: '13px', fontWeight: '600', color: colors.heading,
          textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px',
        }}>
          Difficulty
        </h3>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px', marginBottom: '32px',
        }}>
          {DIFFICULTIES.map((d) => (
            <button
              key={d.id}
              onClick={() => setDifficulty(d.id)}
              style={{
                padding: '20px 16px', borderRadius: '12px',
                border: difficulty === d.id
                  ? `2px solid ${d.color}`
                  : `1.5px solid ${colors.border}`,
                background: difficulty === d.id ? d.bg : colors.surface,
                cursor: 'pointer', textAlign: 'center', transition: 'all 0.15s',
                fontFamily: 'inherit',
              }}
            >
              <div style={{
                fontSize: '18px', fontWeight: '700',
                color: difficulty === d.id ? d.color : colors.heading,
                marginBottom: '4px',
              }}>
                {d.label}
              </div>
              <div style={{ fontSize: '12px', color: colors.textMuted }}>{d.desc}</div>
            </button>
          ))}
        </div>

        <h3 style={{
          fontSize: '13px', fontWeight: '600', color: colors.heading,
          textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px',
        }}>
          Number of Questions
        </h3>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '36px', flexWrap: 'wrap' }}>
          {QUESTION_COUNTS.map((n) => (
            <button
              key={n}
              onClick={() => setQuestionCount(n)}
              style={{
                padding: '10px 24px',
                borderRadius: '24px',
                border: questionCount === n
                  ? '2px solid #6366f1'
                  : `1.5px solid ${colors.border}`,
                background: questionCount === n ? '#6366f1' : colors.surface,
                color: questionCount === n ? '#fff' : colors.heading,
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.15s',
                fontFamily: 'inherit',
                boxShadow: questionCount === n ? '0 0 0 3px rgba(99,102,241,0.2)' : 'none',
              }}
            >
              {n}
            </button>
          ))}
        </div>

        {error && (
          <div style={{
            padding: '12px 16px', background: '#fef2f2',
            border: '1px solid #fecaca', borderRadius: '10px',
            color: '#dc2626', fontSize: '14px', marginBottom: '16px',
          }}>
            ⚠️ {error}
          </div>
        )}

        <button
          onClick={startQuiz}
          disabled={!subject || !difficulty}
          style={{
            width: '100%', padding: '16px',
            background: subject && difficulty
              ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
              : colors.surfaceAlt,
            color: subject && difficulty ? '#fff' : colors.textMuted,
            border: 'none', borderRadius: '12px',
            fontSize: '16px', fontWeight: '700',
            cursor: subject && difficulty ? 'pointer' : 'not-allowed',
            fontFamily: 'inherit',
          }}
        >
          {subject && difficulty
            ? `Start ${SUBJECTS.find((s) => s.id === subject)?.label} — ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} · ${questionCount} Questions →`
            : 'Select subject and difficulty to start'}
        </button>
      </div>
    );
  }

  // ─── RESULTS SCREEN ─────────────────────────────────────────────────────────
  if (screen === 'results') {
    const avg = history.length
      ? Math.round((history.reduce((a, b) => a + b.score, 0) / history.length) * 10) / 10
      : 0;
    const subjectLabel = SUBJECTS.find((s) => s.id === subject)?.label;

    return (
      <div style={{ maxWidth: '820px', margin: '0 auto', padding: '36px 20px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          borderRadius: '16px', padding: '32px',
          textAlign: 'center', marginBottom: '28px', color: '#fff',
        }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>
            {avg >= 8 ? '🏆' : avg >= 6 ? '👍' : avg >= 4 ? '📝' : '💪'}
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: '700', margin: '0 0 8px' }}>
            Session Complete!
          </h2>
          <p style={{ margin: '0 0 16px', opacity: 0.85 }}>
            {subjectLabel} · {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} · {history.length} questions
          </p>
          <div style={{ fontSize: '48px', fontWeight: '800' }}>
            {avg}<span style={{ fontSize: '24px' }}>/10</span>
          </div>
          <p style={{ margin: '8px 0 0', opacity: 0.8, fontSize: '14px' }}>Average Score</p>
          {saved && (
            <p style={{ margin: '12px 0 0', opacity: 0.9, fontSize: '13px', background: 'rgba(255,255,255,0.15)', borderRadius: '8px', padding: '6px 12px', display: 'inline-block' }}>
              ✓ Saved to your profile
            </p>
          )}
        </div>

        <h3 style={{ fontSize: '16px', fontWeight: '600', color: colors.text, marginBottom: '12px' }}>
          Question Breakdown
        </h3>
        {history.map((h, i) => {
          const scoreColor = h.score >= 7 ? '#16a34a' : h.score >= 4 ? '#d97706' : '#dc2626';
          const scoreBg = h.score >= 7 ? '#f0fdf4' : h.score >= 4 ? '#fffbeb' : '#fef2f2';
          const scoreBorder = h.score >= 7 ? '#86efac' : h.score >= 4 ? '#fcd34d' : '#fca5a5';
          return (
            <div key={i} style={{
              background: colors.surface, border: `1px solid ${colors.border}`,
              borderRadius: '10px', padding: '14px 16px', marginBottom: '10px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: h.feedback ? '10px' : 0 }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '13px', color: colors.textSecondary, margin: '0 0 4px' }}>Q{i + 1}</p>
                  <p style={{ fontSize: '14px', color: colors.text, margin: 0 }}>{h.question}</p>
                </div>
                <div style={{
                  minWidth: '52px', textAlign: 'center',
                  background: scoreBg, border: `1px solid ${scoreBorder}`,
                  borderRadius: '8px', padding: '6px 10px', flexShrink: 0,
                }}>
                  <span style={{ fontSize: '16px', fontWeight: '700', color: scoreColor }}>{h.score}</span>
                  <span style={{ fontSize: '11px', color: '#9ca3af', display: 'block' }}>/10</span>
                </div>
              </div>
              {h.feedback && (
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {[
                    { icon: '✅', label: 'Good',    text: h.feedback.what_was_good,    accent: '#16a34a' },
                    { icon: '❌', label: 'Missing', text: h.feedback.what_was_missing,  accent: '#dc2626' },
                    { icon: '💡', label: 'Improve', text: h.feedback.how_to_improve,    accent: '#2563eb' },
                  ].map((fb) => (
                    <div key={fb.icon} style={{
                      flex: '1 1 200px',
                      background: colors.surfaceAlt,
                      border: `1px solid ${colors.border}`,
                      borderLeft: `3px solid ${fb.accent}`,
                      borderRadius: '8px', padding: '8px 10px',
                    }}>
                      <p style={{ fontSize: '10px', fontWeight: '700', color: fb.accent, margin: '0 0 3px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{fb.icon} {fb.label}</p>
                      <p style={{ fontSize: '12px', color: colors.text, margin: 0, lineHeight: '1.5' }}>{fb.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        <button
          onClick={restart}
          style={{
            marginTop: '20px', width: '100%', padding: '14px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: '#fff', border: 'none', borderRadius: '12px',
            fontSize: '15px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          ← Try Another Subject
        </button>
      </div>
    );
  }

  // ─── QUIZ SCREEN ─────────────────────────────────────────────────────────────
  const subjectLabel = SUBJECTS.find((s) => s.id === subject)?.label;
  const diffObj = DIFFICULTIES.find((d) => d.id === difficulty);
  const isLast = currentQ + 1 >= questions.length;

  return (
    <div style={{ maxWidth: '820px', margin: '0 auto', padding: '32px 20px' }}>
      {/* Progress bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <span style={{
            fontSize: '12px', fontWeight: '600', padding: '4px 10px',
            background: colors.primaryBg, color: colors.primaryText, borderRadius: '20px',
          }}>
            {subjectLabel}
          </span>
          <span style={{
            fontSize: '12px', fontWeight: '600', padding: '4px 10px',
            background: diffObj.bg, color: diffObj.color,
            border: `1px solid ${diffObj.border}`, borderRadius: '20px',
          }}>
            {diffObj.label}
          </span>
        </div>
        <span style={{ fontSize: '13px', color: colors.textSecondary }}>
          {currentQ + 1} / {questions.length}
        </span>
      </div>

      <div style={{ height: '4px', background: colors.progressTrack, borderRadius: '2px', marginBottom: '24px' }}>
        <div style={{
          height: '100%',
          width: `${((currentQ + 1) / questions.length) * 100}%`,
          background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
          borderRadius: '2px', transition: 'width 0.4s ease',
        }} />
      </div>

      <QuestionCard question={questions[currentQ]} />
      <AnswerBox
        answer={answer}
        setAnswer={setAnswer}
        submitAnswer={submitAnswer}
        loading={loading}
        submitted={score !== null}
        onDontKnow={handleDontKnow}
      />

      {error && (
        <div style={{
          marginTop: '16px', padding: '12px 16px',
          background: '#fef2f2', border: '1px solid #fecaca',
          borderRadius: '10px', color: '#dc2626', fontSize: '14px',
        }}>
          ⚠️ {error}
        </div>
      )}

      <ScoreCard
        score={score}
        feedback={feedback}
        onNext={() => nextQuestion(history)}
        isLast={isLast}
        solution={solution}
      />

      <button
        onClick={restart}
        style={{
          marginTop: '20px', background: 'none', border: 'none',
          color: colors.textMuted, fontSize: '13px', cursor: 'pointer', padding: 0,
          fontFamily: 'inherit',
        }}
      >
        ← Change subject
      </button>
    </div>
  );
}
