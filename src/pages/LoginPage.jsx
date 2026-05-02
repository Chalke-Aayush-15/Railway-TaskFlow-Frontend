import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useTheme } from '../context/ThemeContext';

export default function LoginPage() {
  const { login } = useAuth();
  const { show } = useToast();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouse = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Email is required';
    if (!form.password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const me = await login(form.email, form.password);
      show('Welcome back! 👋');
      navigate(me?.role === 'admin' ? '/admindashboard' : '/dashboard');
    } catch (e) {
      show(e?.message || 'Login failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`tf-root tf-${theme}`} data-theme={theme} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Ambient glow */}
      <div
        className="tf-cursor-glow"
        style={{ left: mousePos.x, top: mousePos.y }}
      />

      {/* Background grid */}
      <div className="tf-grid-bg" />

      {/* ── Navbar ── */}
      <nav className="tf-nav">
        <Link to="/" className="tf-nav__logo">
          <span className="tf-nav__logo-mark">T</span>
          <span className="tf-nav__logo-text">TaskFlow</span>
        </Link>
        <div className="tf-nav__actions">
          <button className="tf-theme-toggle" onClick={toggle} aria-label="Toggle theme">
            <span className="tf-theme-toggle__icon">{theme === 'dark' ? '☀️' : '🌙'}</span>
          </button>
          <Link to="/register" className="tf-btn tf-btn--primary">
            Create account <span className="tf-btn__arrow">→</span>
          </Link>
        </div>
      </nav>

      {/* ── Auth Content ── */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        position: 'relative',
        zIndex: 1,
      }}>
        <div style={{ width: '100%', maxWidth: 420 }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 32, animation: 'fadeUp 0.6s ease both' }}>
            <div style={{
              width: 52, height: 52,
              background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
              borderRadius: 14,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-display)', color: '#fff', fontSize: 24, fontWeight: 800,
              marginBottom: 18,
              boxShadow: '0 0 30px rgba(255,107,53,0.35)',
            }}>T</div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 28, fontWeight: 800,
              letterSpacing: '-0.8px',
              color: 'var(--text-primary)',
              marginBottom: 6,
            }}>Welcome back</div>
            <div style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 300 }}>
              Sign in to your TaskFlow account
            </div>
          </div>

          {/* Card */}
          <div style={{
            background: 'var(--bg-card)',
            borderRadius: 20,
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-lg)',
            padding: 32,
            animation: 'fadeUp 0.6s ease 0.1s both',
          }}>
            <form onSubmit={handleSubmit}>
              {/* Email */}
              <div style={{ marginBottom: 18 }}>
                <label style={labelStyle}>Email Address</label>
                <input
                  type="email"
                  placeholder="you@company.com"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  style={{ ...inputStyle, borderColor: errors.email ? '#FF4D6D' : undefined }}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e => e.target.style.borderColor = errors.email ? '#FF4D6D' : 'var(--border)'}
                />
                {errors.email && <div style={errorStyle}>{errors.email}</div>}
              </div>

              {/* Password */}
              <div style={{ marginBottom: 24 }}>
                <label style={labelStyle}>Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  style={{ ...inputStyle, borderColor: errors.password ? '#FF4D6D' : undefined }}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e => e.target.style.borderColor = errors.password ? '#FF4D6D' : 'var(--border)'}
                />
                {errors.password && <div style={errorStyle}>{errors.password}</div>}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '13px',
                  background: loading
                    ? 'rgba(255,107,53,0.5)'
                    : 'linear-gradient(135deg, var(--accent) 0%, #E0541F 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 999,
                  fontFamily: 'var(--font-body)',
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: loading ? 'none' : '0 4px 24px rgba(255,107,53,0.35)',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                {loading ? (
                  <>
                    <span style={{ display: 'inline-block', width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                    Signing in…
                  </>
                ) : (
                  <>Sign In <span style={{ transition: 'transform 0.2s' }}>→</span></>
                )}
              </button>
            </form>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0' }}>
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
              <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>OR</span>
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            </div>

            <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-secondary)' }}>
              No account?{' '}
              <Link to="/register" style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>
                Create one free →
              </Link>
            </div>
          </div>

          {/* Bottom row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20, padding: '0 4px', animation: 'fadeUp 0.6s ease 0.2s both' }}>
            <Link to="/" style={{ fontSize: 13, color: 'var(--text-secondary)', textDecoration: 'none' }}>← Back to home</Link>
            <button onClick={toggle} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}>
              {theme === 'dark' ? '☀️ Light mode' : '🌙 Dark mode'}
            </button>
          </div>
        </div>
      </div>

      {/* Spinner keyframe injected inline */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        input::placeholder { color: var(--text-muted) !important; }
      `}</style>
    </div>
  );
}

const labelStyle = {
  display: 'block',
  fontSize: 13,
  fontWeight: 500,
  color: 'var(--text-secondary)',
  marginBottom: 7,
  letterSpacing: '0.2px',
};

const inputStyle = {
  width: '100%',
  padding: '11px 14px',
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  borderRadius: 10,
  fontSize: 14,
  color: 'var(--text-primary)',
  fontFamily: 'var(--font-body)',
  outline: 'none',
  transition: 'border-color 0.2s ease',
  boxSizing: 'border-box',
};

const errorStyle = {
  fontSize: 12,
  color: '#FF4D6D',
  marginTop: 5,
};