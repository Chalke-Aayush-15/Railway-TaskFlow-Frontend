import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/UI';

const FEATURES = [
  { icon: '📋', title: 'Project Management', desc: 'Create projects, organize work, and set deadlines with ease.' },
  { icon: '✅', title: 'Task Tracking',       desc: 'Assign tasks, track progress, and never miss a deadline.' },
  { icon: '👥', title: 'Role-Based Access',   desc: 'Admins create & assign. Members update & execute.' },
  { icon: '📊', title: 'Live Dashboard',       desc: 'Visual overview of completed, pending, and overdue tasks.' },
];

export default function HomePage() {
  const { theme, toggle } = useTheme();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Navbar */}
      <nav style={{
        padding: '14px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: 'var(--surface)', borderBottom: '1px solid var(--border)',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, background: 'var(--primary)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 15, fontWeight: 800 }}>T</div>
          <span style={{ fontSize: 17, fontWeight: 800, color: 'var(--text)' }}>TaskFlow</span>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <Button variant="ghost" size="sm" onClick={toggle} style={{ fontSize: 16, padding: '5px 8px' }}>
            {theme === 'dark' ? '☀️' : '🌙'}
          </Button>
          <Link to="/login"><Button variant="ghost">Log In</Button></Link>
          <Link to="/register"><Button variant="primary">Get Started →</Button></Link>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '90px 48px 60px', textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'var(--primary-light)', color: 'var(--primary)',
          padding: '5px 16px', borderRadius: 20, fontSize: 11, fontWeight: 700,
          marginBottom: 28, border: '1px solid var(--primary-border)',
          textTransform: 'uppercase', letterSpacing: '0.08em',
        }}>
          ✦ TEAM COLLABORATION PLATFORM
        </div>
        <h1 style={{ fontSize: 'clamp(36px,6vw,64px)', fontWeight: 800, lineHeight: 1.08, marginBottom: 22, color: 'var(--text)' }}>
          Ship projects faster<br />
          <span style={{ color: 'var(--primary)' }}>as a team.</span>
        </h1>
        <p style={{ fontSize: 18, color: 'var(--text2)', maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.7 }}>
          Organize work, track tasks, and collaborate across your team — in one beautifully simple platform.
        </p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/register"><Button variant="primary" size="lg">Start for free →</Button></Link>
          <Link to="/login"><Button variant="ghost" size="lg">Sign in</Button></Link>
        </div>

        {/* Stat pills */}
        <div style={{ display: 'flex', gap: 20, justifyContent: 'center', marginTop: 56, flexWrap: 'wrap' }}>
          {[['Roles', '2 access levels'], ['Views', 'Kanban + List'], ['API', 'REST backend']].map(([k, v]) => (
            <div key={k} style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)', padding: '12px 22px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
            }}>
              <div style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{k}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 48px 80px' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)', marginBottom: 8 }}>Everything your team needs</div>
          <div style={{ fontSize: 14, color: 'var(--text3)' }}>Built for modern teams who want to move fast</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 18 }}>
          {FEATURES.map((f) => (
            <div key={f.title} style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-xl)', padding: '28px 22px', textAlign: 'center',
              boxShadow: 'var(--shadow-sm)', transition: 'box-shadow 0.2s, transform 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{ fontSize: 36, marginBottom: 14 }}>{f.icon}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>{f.title}</div>
              <div style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ borderTop: '1px solid var(--border)', padding: '24px 48px', textAlign: 'center' }}>
        <div style={{ fontSize: 13, color: 'var(--text3)' }}>
          Built with React + Railway API · <Link to="/register" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Get started free →</Link>
        </div>
      </div>
    </div>
  );
}
