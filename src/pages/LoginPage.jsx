import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useTheme } from '../context/ThemeContext';
import { Input, Button, Divider } from '../components/UI';

export default function LoginPage() {
  const { login } = useAuth();
  const { show } = useToast();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

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
      await login(form.email, form.password);
      show('Welcome back! 👋');
      navigate('/dashboard');
    } catch (e) {
      show(e, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 48, height: 48, background: 'var(--primary)', borderRadius: 13,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 22, fontWeight: 800, marginBottom: 14,
          }}>T</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)' }}>Welcome back</div>
          <div style={{ fontSize: 13, color: 'var(--text3)', marginTop: 6 }}>Sign in to your TaskFlow account</div>
        </div>

        <div style={{
          background: 'var(--surface)', borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)', padding: 32,
        }}>
          <form onSubmit={handleSubmit}>
            <Input
              label="Email Address" type="email" placeholder="you@company.com"
              value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              error={errors.email}
            />
            <Input
              label="Password" type="password" placeholder="••••••••"
              value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              error={errors.password}
            />
            <Button type="submit" variant="primary" loading={loading} style={{ width: '100%', padding: '11px', fontSize: 14, marginTop: 4 }}>
              Sign In
            </Button>
          </form>
          <Divider />
          <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--text3)' }}>
            No account?{' '}
            <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
              Create one free →
            </Link>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20, padding: '0 4px' }}>
          <Link to="/" style={{ fontSize: 13, color: 'var(--text3)', textDecoration: 'none' }}>← Back to home</Link>
          <button onClick={toggle} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: 'var(--text3)' }}>
            {theme === 'dark' ? '☀️ Light mode' : '🌙 Dark mode'}
          </button>
        </div>
      </div>
    </div>
  );
}
