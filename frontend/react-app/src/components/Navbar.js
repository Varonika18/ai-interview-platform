import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

export default function Navbar() {
  const { currentUser } = useAuth();
  const { mode, toggleTheme, colors } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const initials = currentUser
    ? (currentUser.displayName || currentUser.email || '?').slice(0, 2).toUpperCase()
    : '';

  const onProfile = location.pathname === '/profile';

  return (
    <div style={{
      background: colors.navBg,
      borderBottom: `1px solid ${colors.navBorder}`,
      padding: '0 24px',
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      transition: 'background 0.2s, border-color 0.2s',
    }}>
      {/* Logo */}
      <button
        onClick={() => navigate('/')}
        style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          background: 'none', border: 'none', cursor: 'pointer', padding: 0,
        }}
      >
        <div style={{
          width: '32px', height: '32px',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          borderRadius: '8px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '16px',
        }}>
          🎯
        </div>
        <span style={{ fontSize: '16px', fontWeight: '700', color: colors.text }}>
          InterviewAI
        </span>
      </button>

      {/* Right controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          title={mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          style={{
            width: '36px', height: '36px', borderRadius: '10px',
            border: `1px solid ${colors.border}`,
            background: colors.surface, cursor: 'pointer', fontSize: '16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.15s',
          }}
        >
          {mode === 'light' ? '🌙' : '☀️'}
        </button>

        {currentUser ? (
          <button
            onClick={() => navigate('/profile')}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '5px 12px 5px 5px',
              background: onProfile ? colors.primaryBg : colors.surface,
              border: `1px solid ${onProfile ? '#6366f1' : colors.border}`,
              borderRadius: '20px', cursor: 'pointer',
              transition: 'all 0.15s',
              fontFamily: 'inherit',
            }}
          >
            <div style={{
              width: '28px', height: '28px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '11px', fontWeight: '700', color: '#fff',
              overflow: 'hidden', flexShrink: 0,
            }}>
              {currentUser.photoURL
                ? <img src={currentUser.photoURL} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : initials}
            </div>
            <span style={{ fontSize: '13px', fontWeight: '600', color: colors.text }}>
              {currentUser.displayName?.split(' ')[0] || 'Profile'}
            </span>
          </button>
        ) : (
          <button
            onClick={() => navigate('/login')}
            style={{
              padding: '7px 16px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: '#fff', border: 'none', borderRadius: '10px',
              cursor: 'pointer', fontSize: '13px', fontWeight: '600',
              fontFamily: 'inherit',
            }}
          >
            Log In
          </button>
        )}
      </div>
    </div>
  );
}
