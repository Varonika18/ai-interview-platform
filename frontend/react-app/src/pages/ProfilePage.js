import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { db } from '../firebase';

const SUBJECTS = {
  python: { label: 'Python', icon: '🐍' },
  java:   { label: 'Java',   icon: '☕' },
  c:      { label: 'C',      icon: '⚙️' },
  cpp:    { label: 'C++',    icon: '➕' },
  oops:   { label: 'OOPs',   icon: '🧩' },
  os:     { label: 'OS',     icon: '💻' },
  cn:     { label: 'CN',     icon: '🌐' },
  dbms:   { label: 'DBMS',   icon: '🗄️' },
  sql:    { label: 'SQL',    icon: '📊' },
  mix:    { label: 'Mix All',icon: '🎯' },
};

export default function ProfilePage() {
  const { currentUser, updateDisplayName, logout } = useAuth();
  const { colors } = useTheme();
  const navigate = useNavigate();

  const [attempts, setAttempts] = useState([]);
  const [loadingAttempts, setLoadingAttempts] = useState(true);
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState(currentUser?.displayName || '');
  const [saving, setSaving] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [filterSubject, setFilterSubject] = useState('all');

  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        const q = query(
          collection(db, 'attempts'),
          where('uid', '==', currentUser.uid)
        );
        const snap = await getDocs(q);
        const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        docs.sort((a, b) => {
          const aTime = a.attemptedAt?.toMillis?.() || 0;
          const bTime = b.attemptedAt?.toMillis?.() || 0;
          return bTime - aTime;
        });
        setAttempts(docs);
      } catch (e) {
        console.error('Failed to load attempts:', e);
      }
      setLoadingAttempts(false);
    };
    fetchAttempts();
  }, [currentUser.uid]);

  const saveName = async () => {
    if (!newName.trim()) return;
    setSaving(true);
    await updateDisplayName(newName.trim());
    setSaving(false);
    setEditingName(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const initials = (currentUser.displayName || currentUser.email || '?')
    .slice(0, 2)
    .toUpperCase();

  const filtered = filterSubject === 'all'
    ? attempts
    : attempts.filter((a) => a.subject === filterSubject);

  const totalAttempts = attempts.length;
  const avgScore = attempts.length
    ? Math.round((attempts.reduce((s, a) => s + (a.avgScore || 0), 0) / attempts.length) * 10) / 10
    : 0;
  const bestScore = attempts.length
    ? Math.max(...attempts.map((a) => a.avgScore || 0))
    : 0;

  const scoreColor = (s) =>
    s >= 7 ? '#16a34a' : s >= 4 ? '#d97706' : '#dc2626';

  const scoreBg = (s) =>
    s >= 7 ? '#f0fdf4' : s >= 4 ? '#fffbeb' : '#fef2f2';

  const scoreBorder = (s) =>
    s >= 7 ? '#86efac' : s >= 4 ? '#fcd34d' : '#fca5a5';

  const formatDate = (ts) => {
    if (!ts?.toDate) return 'Unknown date';
    return ts.toDate().toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  const usedSubjects = [...new Set(attempts.map((a) => a.subject))];

  return (
    <div style={{ maxWidth: '820px', margin: '0 auto', padding: '36px 20px' }}>
      {/* Profile card */}
      <div style={{
        background: colors.surface,
        border: `1px solid ${colors.border}`,
        borderRadius: '16px',
        padding: '24px 28px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        flexWrap: 'wrap',
      }}>
        <div style={{
          width: '72px', height: '72px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '24px', fontWeight: '700', color: '#fff',
          flexShrink: 0, overflow: 'hidden',
        }}>
          {currentUser.photoURL
            ? <img src={currentUser.photoURL} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : initials}
        </div>

        <div style={{ flex: 1, minWidth: '180px' }}>
          {editingName ? (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px', flexWrap: 'wrap' }}>
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && saveName()}
                autoFocus
                style={{
                  padding: '6px 10px', borderRadius: '8px',
                  border: `1.5px solid ${colors.border}`,
                  background: colors.inputBg, color: colors.text,
                  fontSize: '16px', fontWeight: '600',
                  outline: 'none', fontFamily: 'inherit',
                }}
              />
              <button
                onClick={saveName}
                disabled={saving}
                style={{
                  padding: '6px 14px', background: '#6366f1', color: '#fff',
                  border: 'none', borderRadius: '8px', cursor: 'pointer',
                  fontSize: '13px', fontWeight: '600', fontFamily: 'inherit',
                }}
              >
                {saving ? '...' : 'Save'}
              </button>
              <button
                onClick={() => { setEditingName(false); setNewName(currentUser.displayName || ''); }}
                style={{
                  padding: '6px 10px',
                  background: colors.btnSecondaryBg, color: colors.btnSecondaryText,
                  border: `1px solid ${colors.btnSecondaryBorder}`,
                  borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit',
                }}
              >
                Cancel
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: colors.text, margin: 0 }}>
                {currentUser.displayName || 'User'}
              </h2>
              <button
                onClick={() => setEditingName(true)}
                style={{
                  padding: '3px 10px',
                  background: colors.surfaceAlt, color: colors.textSecondary,
                  border: `1px solid ${colors.border}`,
                  borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontFamily: 'inherit',
                }}
              >
                Edit name
              </button>
            </div>
          )}
          <p style={{ color: colors.textSecondary, margin: 0, fontSize: '14px' }}>
            {currentUser.email}
          </p>
        </div>

        <button
          onClick={handleLogout}
          style={{
            padding: '8px 18px',
            background: colors.btnSecondaryBg, color: colors.btnSecondaryText,
            border: `1px solid ${colors.btnSecondaryBorder}`,
            borderRadius: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: '600',
            fontFamily: 'inherit',
          }}
        >
          Sign Out
        </button>
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '12px',
        marginBottom: '28px',
      }}>
        {[
          { label: 'Total Sessions', value: totalAttempts, icon: '📝' },
          { label: 'Avg Score', value: `${avgScore}/10`, icon: '📊' },
          { label: 'Best Score', value: `${bestScore}/10`, icon: '🏆' },
        ].map((stat) => (
          <div key={stat.label} style={{
            background: colors.surface,
            border: `1px solid ${colors.border}`,
            borderRadius: '12px',
            padding: '16px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '24px', marginBottom: '6px' }}>{stat.icon}</div>
            <div style={{ fontSize: '22px', fontWeight: '700', color: colors.text }}>{stat.value}</div>
            <div style={{ fontSize: '12px', color: colors.textSecondary, marginTop: '2px' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Filter + Attempt History */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', color: colors.text, margin: 0 }}>
          Attempt History
        </h3>
        {usedSubjects.length > 1 && (
          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            style={{
              padding: '6px 10px', borderRadius: '8px',
              border: `1px solid ${colors.border}`,
              background: colors.surface, color: colors.text,
              fontSize: '13px', outline: 'none', cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            <option value="all">All subjects</option>
            {usedSubjects.map((s) => (
              <option key={s} value={s}>{SUBJECTS[s]?.label || s}</option>
            ))}
          </select>
        )}
      </div>

      {loadingAttempts ? (
        <div style={{ textAlign: 'center', padding: '40px', color: colors.textSecondary }}>
          Loading history...
        </div>
      ) : filtered.length === 0 ? (
        <div style={{
          background: colors.surface,
          border: `1px solid ${colors.border}`,
          borderRadius: '12px',
          padding: '40px',
          textAlign: 'center',
          color: colors.textSecondary,
        }}>
          {attempts.length === 0
            ? 'No attempts yet. Start an interview to see your history here!'
            : 'No attempts for this subject yet.'}
        </div>
      ) : (
        filtered.map((attempt) => {
          const subj = SUBJECTS[attempt.subject] || { label: attempt.subject, icon: '📚' };
          const isOpen = expanded === attempt.id;
          const avg = attempt.avgScore || 0;

          return (
            <div key={attempt.id} style={{
              background: colors.surface,
              border: `1px solid ${colors.border}`,
              borderRadius: '12px',
              marginBottom: '10px',
              overflow: 'hidden',
            }}>
              {/* Row header */}
              <button
                onClick={() => setExpanded(isOpen ? null : attempt.id)}
                style={{
                  width: '100%', padding: '16px',
                  background: 'none', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left',
                  fontFamily: 'inherit',
                }}
              >
                <span style={{ fontSize: '22px' }}>{subj.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: colors.text }}>{subj.label}</span>
                    <span style={{
                      fontSize: '11px', padding: '2px 8px',
                      background: colors.surfaceAlt, color: colors.textSecondary,
                      borderRadius: '20px', textTransform: 'capitalize',
                    }}>
                      {attempt.difficulty}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: colors.textMuted, marginTop: '2px' }}>
                    {formatDate(attempt.attemptedAt)} · {attempt.history?.length || 0} questions
                  </div>
                </div>
                <div style={{ minWidth: '56px', textAlign: 'right' }}>
                  <span style={{ fontSize: '18px', fontWeight: '700', color: scoreColor(avg) }}>{avg}</span>
                  <span style={{ fontSize: '12px', color: colors.textMuted }}>/10</span>
                </div>
                <span style={{ color: colors.textMuted, fontSize: '12px' }}>{isOpen ? '▲' : '▼'}</span>
              </button>

              {/* Expanded detail */}
              {isOpen && (
                <div style={{ padding: '0 16px 16px' }}>
                  <div style={{ height: '1px', background: colors.border, marginBottom: '14px' }} />
                  {(attempt.history || []).map((h, i) => (
                    <div key={i} style={{
                      background: colors.surfaceAlt,
                      borderRadius: '10px',
                      padding: '12px 14px',
                      marginBottom: '8px',
                    }}>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: h.feedback ? '10px' : 0 }}>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: '12px', color: colors.textSecondary, margin: '0 0 4px' }}>Q{i + 1}</p>
                          <p style={{ fontSize: '13px', fontWeight: '600', color: colors.text, margin: '0 0 8px' }}>{h.question}</p>
                          <p style={{ fontSize: '13px', color: colors.textSecondary, margin: 0, fontStyle: 'italic' }}>
                            "{h.answer?.length > 200 ? h.answer.slice(0, 200) + '…' : h.answer}"
                          </p>
                        </div>
                        <div style={{
                          minWidth: '44px', textAlign: 'center',
                          background: scoreBg(h.score),
                          border: `1px solid ${scoreBorder(h.score)}`,
                          borderRadius: '8px', padding: '4px 8px', flexShrink: 0,
                        }}>
                          <span style={{ fontSize: '15px', fontWeight: '700', color: scoreColor(h.score) }}>{h.score}</span>
                          <span style={{ fontSize: '10px', color: '#9ca3af', display: 'block' }}>/10</span>
                        </div>
                      </div>
                      {h.feedback && (
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          {[
                            { icon: '✅', label: 'Good',    text: h.feedback.what_was_good,    accent: '#16a34a' },
                            { icon: '❌', label: 'Missing', text: h.feedback.what_was_missing,  accent: '#dc2626' },
                            { icon: '💡', label: 'Improve', text: h.feedback.how_to_improve,    accent: '#2563eb' },
                          ].map((fb) => (
                            <div key={fb.icon} style={{
                              flex: '1 1 160px',
                              background: colors.surfaceAlt,
                              border: `1px solid ${colors.border}`,
                              borderLeft: `3px solid ${fb.accent}`,
                              borderRadius: '7px', padding: '7px 9px',
                            }}>
                              <p style={{ fontSize: '10px', fontWeight: '700', color: fb.accent, margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{fb.icon} {fb.label}</p>
                              <p style={{ fontSize: '11px', color: colors.text, margin: 0, lineHeight: '1.5' }}>{fb.text}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
