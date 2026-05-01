import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const FEATURES = [
  {
    icon: '📋',
    title: 'Project Management',
    desc: 'Create projects, organize work, and set deadlines with ease.',
    accent: '#FF6B35',
  },
  {
    icon: '✅',
    title: 'Task Tracking',
    desc: 'Assign tasks, track progress, and never miss a deadline.',
    accent: '#00C9A7',
  },
  {
    icon: '👥',
    title: 'Role-Based Access',
    desc: 'Admins create & assign. Members update & execute seamlessly.',
    accent: '#845EC2',
  },
  {
    icon: '📊',
    title: 'Live Dashboard',
    desc: 'Visual overview of completed, pending, and overdue tasks.',
    accent: '#0089BA',
  },
];

const STATS = [
  { label: 'Roles', value: '2 access levels' },
  { label: 'Views', value: 'Kanban + List' },
  { label: 'API', value: 'REST backend' },
];

export default function HomePage() {
  const [theme, setTheme] = useState('dark');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);

  const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));

  useEffect(() => {
    const handleMouse = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  return (
    <div className={`tf-root tf-${theme}`} data-theme={theme}>
      {/* Ambient glow that follows cursor */}
      <div
        className="tf-cursor-glow"
        style={{
          left: mousePos.x,
          top: mousePos.y,
        }}
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
          <button className="tf-theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            <span className="tf-theme-toggle__icon">
              {theme === 'dark' ? '☀️' : '🌙'}
            </span>
          </button>
          <Link to="/login" className="tf-btn tf-btn--ghost">
            Log In
          </Link>
          <Link to="/register" className="tf-btn tf-btn--primary">
            Get Started <span className="tf-btn__arrow">→</span>
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="tf-hero" ref={heroRef}>
        <div className="tf-hero__content">
          <div className="tf-hero__eyebrow">
            <span className="tf-eyebrow__dot" />
            TEAM COLLABORATION PLATFORM
          </div>

          <h1 className="tf-hero__headline">
            <span className="tf-headline__line">Ship projects</span>
            <span className="tf-headline__line tf-headline__line--accent">faster</span>
            <span className="tf-headline__line">as a team.</span>
          </h1>

          <p className="tf-hero__sub">
            Organize work, track tasks, and collaborate across your team —<br />
            in one beautifully simple platform.
          </p>

          <div className="tf-hero__cta">
            <Link to="/register" className="tf-btn tf-btn--cta">
              Start for free
              <span className="tf-btn__arrow">→</span>
            </Link>
            <Link to="/login" className="tf-btn tf-btn--outline">
              Sign in
            </Link>
          </div>

          {/* Stat pills */}
          <div className="tf-hero__stats">
            {STATS.map(({ label, value }) => (
              <div className="tf-stat-pill" key={label}>
                <span className="tf-stat-pill__label">{label}</span>
                <span className="tf-stat-pill__value">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Floating dashboard preview */}
        <div className="tf-hero__visual">
          <div className="tf-dashboard-mock">
            <div className="tf-mock__header">
              <span className="tf-mock__dot tf-mock__dot--red" />
              <span className="tf-mock__dot tf-mock__dot--yellow" />
              <span className="tf-mock__dot tf-mock__dot--green" />
              <span className="tf-mock__title">Sprint Dashboard</span>
            </div>
            <div className="tf-mock__body">
              {[
                { label: 'Completed', pct: 68, color: '#00C9A7' },
                { label: 'In Progress', pct: 22, color: '#FF6B35' },
                { label: 'Overdue', pct: 10, color: '#FF4D6D' },
              ].map(({ label, pct, color }) => (
                <div className="tf-mock__row" key={label}>
                  <span className="tf-mock__row-label">{label}</span>
                  <div className="tf-mock__bar-track">
                    <div
                      className="tf-mock__bar-fill"
                      style={{ width: `${pct}%`, background: color }}
                    />
                  </div>
                  <span className="tf-mock__row-pct">{pct}%</span>
                </div>
              ))}

              <div className="tf-mock__tasks">
                {[
                  { title: 'Design system audit', tag: 'Done', tagColor: '#00C9A7' },
                  { title: 'API integration', tag: 'Active', tagColor: '#FF6B35' },
                  { title: 'User onboarding flow', tag: 'Todo', tagColor: '#845EC2' },
                ].map(({ title, tag, tagColor }) => (
                  <div className="tf-mock__task" key={title}>
                    <span className="tf-mock__task-title">{title}</span>
                    <span className="tf-mock__task-tag" style={{ color: tagColor, borderColor: tagColor }}>
                      {tag}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="tf-features">
        <div className="tf-features__header">
          <h2 className="tf-features__title">Everything your team needs</h2>
          <p className="tf-features__sub">Built for modern teams who want to move fast</p>
        </div>

        <div className="tf-features__grid">
          {FEATURES.map((f) => (
            <div className="tf-feature-card" key={f.title} style={{ '--accent': f.accent }}>
              <div className="tf-feature-card__icon">{f.icon}</div>
              <h3 className="tf-feature-card__title">{f.title}</h3>
              <p className="tf-feature-card__desc">{f.desc}</p>
              <div className="tf-feature-card__line" />
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="tf-cta-banner">
        <div className="tf-cta-banner__inner">
          <h2 className="tf-cta-banner__title">Ready to move faster?</h2>
          <p className="tf-cta-banner__sub">Join teams already using TaskFlow to ship more, stress less.</p>
          <Link to="/register" className="tf-btn tf-btn--cta">
            Get started free →
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="tf-footer">
        <span>Built with React + Railway API</span>
        <span className="tf-footer__sep">·</span>
        <Link to="/register" className="tf-footer__link">Get started free →</Link>
      </footer>
    </div>
  );
}