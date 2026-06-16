import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

function ScoreCard({ score, feedback, onNext, isLast }) {
  const { colors } = useTheme();

  if (score === null) return null;

  const getGrade = (s) => {
    if (s >= 8) return { label: 'Excellent', color: '#16a34a', emoji: '🏆' };
    if (s >= 6) return { label: 'Good',      color: '#2563eb', emoji: '👍' };
    if (s >= 4) return { label: 'Average',   color: '#d97706', emoji: '📝' };
    return          { label: 'Needs Work', color: '#dc2626', emoji: '💪' };
  };

  const grade = getGrade(score);
  const pct = (score / 10) * 100;

  const sections = feedback
    ? [
        { icon: '✅', label: 'What was good',    text: feedback.what_was_good,    accent: '#16a34a' },
        { icon: '❌', label: 'What was missing',  text: feedback.what_was_missing,  accent: '#dc2626' },
        { icon: '💡', label: 'How to improve',    text: feedback.how_to_improve,    accent: '#2563eb' },
      ]
    : null;

  return (
    <div style={{
      background: colors.surface,
      border: `1px solid ${colors.border}`,
      borderLeft: `4px solid ${grade.color}`,
      borderRadius: '12px',
      padding: '20px',
      marginTop: '4px',
    }}>
      {/* Score bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px' }}>
        <span style={{ fontSize: '28px' }}>{grade.emoji}</span>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
            <span style={{ fontSize: '13px', fontWeight: '700', color: grade.color, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {grade.label}
            </span>
            <span style={{ fontSize: '22px', fontWeight: '800', color: grade.color }}>
              {score}<span style={{ fontSize: '14px', color: colors.textMuted }}>/10</span>
            </span>
          </div>
          <div style={{ height: '7px', background: colors.progressTrack, borderRadius: '4px' }}>
            <div style={{
              height: '100%', width: `${pct}%`,
              background: grade.color, borderRadius: '4px',
              transition: 'width 0.8s ease',
            }} />
          </div>
        </div>
      </div>

      {/* Feedback sections */}
      {sections ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '18px' }}>
          {sections.map((s) => (
            <div key={s.label} style={{
              background: colors.surfaceAlt,
              border: `1px solid ${colors.border}`,
              borderLeft: `3px solid ${s.accent}`,
              borderRadius: '8px',
              padding: '10px 12px',
            }}>
              <div style={{
                fontSize: '11px', fontWeight: '700', color: s.accent,
                textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px',
              }}>
                {s.icon} {s.label}
              </div>
              <p style={{ fontSize: '13px', color: colors.text, margin: 0, lineHeight: '1.6' }}>
                {s.text}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          marginBottom: '18px', padding: '12px', background: colors.surfaceAlt,
          borderRadius: '8px', textAlign: 'center', fontSize: '13px', color: colors.textMuted,
        }}>
          Analyzing your answer…
        </div>
      )}

      <button
        onClick={onNext}
        style={{
          padding: '10px 24px',
          background: '#6366f1',
          color: '#fff',
          border: 'none',
          borderRadius: '10px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '600',
          fontFamily: 'inherit',
        }}
      >
        {isLast ? 'See Results →' : 'Next Question →'}
      </button>
    </div>
  );
}

export default ScoreCard;
