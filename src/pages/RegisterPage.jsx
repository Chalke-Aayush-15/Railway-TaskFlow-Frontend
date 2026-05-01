import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useTheme } from '../context/ThemeContext';
import { Input, Select, Button, Divider } from '../components/UI';

export default function RegisterPage() {
  const { signup } = useAuth();
  const { show } = useToast();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'member' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email) e.email = 'Email is required';
    if (!form.password || form.password.length < 6) e.password = 'Password must be at least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await signup(form.name, form.email, form.password, form.role);
      show('Account created! Welcome to TaskFlow 🎉');
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
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 48, height: 48, background: 'var(--primary)', borderRadius: 13,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 22, fontWeight: 800, marginBottom: 14,
          }}>T</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)' }}>Create an account</div>
          <div style={{ fontSize: 13, color: 'var(--text3)', marginTop: 6 }}>Start managing your team today</div>
        </div>

        <div style={{
          background: 'var(--surface)', borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)', padding: 32,
        }}>
          <form onSubmit={handleSubmit}>
            <Input
              label="Full Name" placeholder="John Smith"
              value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              error={errors.name}
            />
            <Input
              label="Email Address" type="email" placeholder="you@company.com"
              value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              error={errors.email}
            />
            <Input
              label="Password" type="password" placeholder="Min. 6 characters"
              value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              error={errors.password}
            />
            <Select label="Account Role" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
              <option value="member">Member — view & update assigned tasks</option>
              <option value="admin">Admin — create projects & assign tasks</option>
            </Select>

            {/* Role hint */}
            <div style={{
              background: 'var(--primary-light)', border: '1px solid var(--primary-border)',
              borderRadius: 'var(--radius)', padding: '10px 14px', marginBottom: 16, fontSize: 12, color: 'var(--text2)',
            }}>
              {form.role === 'admin'
                ? '🔑 Admins can create projects, invite members, and assign tasks'
                : '👤 Members can view their assigned tasks and update statuses'}
            </div>

            <Button type="submit" variant="primary" loading={loading} style={{ width: '100%', padding: '11px', fontSize: 14 }}>
              Create Account
            </Button>
          </form>
          <Divider />
          <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--text3)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
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
