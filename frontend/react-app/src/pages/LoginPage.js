import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

export default function LoginPage() {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
  const { colors } = useTheme();
  const navigate = useNavigate();

  const [tab, setTab] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogle = async () => {
    setError('');
    try {
      await signInWithGoogle();
      navigate('/');
    } catch {
      setError('Google sign-in failed. Check your Firebase config and try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (tab === 'signup' && !name.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      if (tab === 'signup') {
        await signUpWithEmail(email, password, name.trim());
      } else {
        await signInWithEmail(email, password);
      }
      navigate('/');
    } catch (e) {
      const msg = {
        'auth/wrong-password': 'Invalid email or password.',
        'auth/user-not-found': 'Invalid email or password.',
        'auth/email-already-in-use': 'Email already in use. Try logging in.',
        'auth/weak-password': 'Password must be at least 6 characters.',
        'auth/invalid-email': 'Please enter a valid email address.',
      };
      setError(msg[e.code] || 'Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  const inputStyle = {
    width: '100%',
    padding: '11px 14px',
    borderRadius: '10px',
    border: `1.5px solid ${colors.inputBorder}`,
    background: colors.inputBg,
    color: colors.text,
    fontSize: '14px',
    boxSizing: 'border-box',
    outline: 'none',
    fontFamily: 'inherit',
    transition: 'border-color 0.15s',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '13px',
    fontWeight: '600',
    color: colors.heading,
    marginBottom: '6px',
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 60px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '60px', height: '60px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            borderRadius: '18px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '28px', margin: '0 auto 16px',
          }}>
            🎯
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: colors.text, margin: '0 0 6px' }}>
            Welcome to InterviewAI
          </h1>
          <p style={{ color: colors.textSecondary, margin: 0, fontSize: '14px' }}>
            Practice smarter, get hired faster
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: colors.surface,
          border: `1px solid ${colors.border}`,
          borderRadius: '16px',
          padding: '28px',
        }}>
          {/* Tab switcher */}
          <div style={{
            display: 'flex',
            background: colors.surfaceAlt,
            borderRadius: '10px',
            padding: '4px',
            marginBottom: '24px',
            gap: '4px',
          }}>
            {['login', 'signup'].map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(''); }}
                style={{
                  flex: 1, padding: '8px', borderRadius: '8px', border: 'none',
                  cursor: 'pointer', fontSize: '14px', fontWeight: '600',
                  transition: 'all 0.15s',
                  background: tab === t ? colors.surface : 'transparent',
                  color: tab === t ? colors.text : colors.textSecondary,
                  boxShadow: tab === t ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                }}
              >
                {t === 'login' ? 'Log In' : 'Sign Up'}
              </button>
            ))}
          </div>

          {/* Google */}
          <button
            onClick={handleGoogle}
            style={{
              width: '100%', padding: '12px', borderRadius: '10px',
              border: `1px solid ${colors.border}`,
              background: colors.surface, color: colors.text,
              cursor: 'pointer', fontSize: '14px', fontWeight: '600',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '10px', marginBottom: '20px', fontFamily: 'inherit',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.1 0 5.8 1.1 8 2.9l5.9-5.9C34.1 3.5 29.3 1.5 24 1.5 14.9 1.5 7.2 7.1 4 15l7 5.4C12.8 14.5 17.9 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.5c-.5 2.9-2.1 5.3-4.4 7l7 5.4c4.1-3.8 6.6-9.4 6.6-16.4z"/>
              <path fill="#FBBC05" d="M11 28.9C10.4 27.1 10 25.1 10 23s.4-4.1 1-5.9L4 11.7C1.5 16.1 1 19.4 1 23s.5 6.9 3 10.3l7-4.4z"/>
              <path fill="#34A853" d="M24 46.5c5.3 0 9.8-1.8 13.1-4.8l-7-5.4c-1.8 1.2-4.1 1.9-6.1 1.9-6.1 0-11.2-5-12.9-11.3l-7 4.4C7.2 40.9 14.9 46.5 24 46.5z"/>
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ flex: 1, height: '1px', background: colors.border }} />
            <span style={{ fontSize: '12px', color: colors.textMuted }}>or</span>
            <div style={{ flex: 1, height: '1px', background: colors.border }} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {tab === 'signup' && (
              <div style={{ marginBottom: '14px' }}>
                <label style={labelStyle}>Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = '#6366f1')}
                  onBlur={(e) => (e.target.style.borderColor = colors.inputBorder)}
                />
              </div>
            )}
            <div style={{ marginBottom: '14px' }}>
              <label style={labelStyle}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = '#6366f1')}
                onBlur={(e) => (e.target.style.borderColor = colors.inputBorder)}
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = '#6366f1')}
                onBlur={(e) => (e.target.style.borderColor = colors.inputBorder)}
              />
            </div>

            {error && (
              <div style={{
                padding: '10px 14px',
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                color: '#dc2626',
                fontSize: '13px',
                marginBottom: '16px',
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '12px',
                background: loading ? '#a5b4fc' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: '#fff', border: 'none', borderRadius: '10px',
                fontSize: '14px', fontWeight: '700',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit',
              }}
            >
              {loading ? 'Please wait...' : tab === 'login' ? 'Log In →' : 'Create Account →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
