import React from 'react';
import { getInitials, getAvatarStyle } from '../utils/helpers';

/* ─── Button ─────────────────────────────────────────────────────────────── */
export function Button({ children, variant = 'primary', size = 'md', loading, style, ...props }) {
  const base = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    gap: 6, border: 'none', cursor: loading || props.disabled ? 'not-allowed' : 'pointer',
    fontFamily: 'var(--font)', fontWeight: 600, borderRadius: 'var(--radius)',
    transition: 'all 0.15s', textDecoration: 'none', outline: 'none',
    opacity: props.disabled ? 0.6 : 1,
  };
  const sizes = {
    sm:  { padding: '5px 10px', fontSize: 12 },
    md:  { padding: '9px 18px', fontSize: 13 },
    lg:  { padding: '12px 28px', fontSize: 15 },
  };
  const variants = {
    primary: { background: 'var(--primary)', color: '#fff' },
    ghost:   { background: 'transparent', color: 'var(--text2)', border: '1px solid var(--border)' },
    danger:  { background: 'var(--danger)', color: '#fff' },
    success: { background: 'var(--success)', color: '#fff' },
    subtle:  { background: 'var(--surface2)', color: 'var(--text2)', border: '1px solid var(--border)' },
  };
  return (
    <button {...props} style={{ ...base, ...sizes[size], ...variants[variant], ...style }}>
      {loading ? <Spinner size={14} color={variant === 'ghost' || variant === 'subtle' ? 'var(--text3)' : '#fff'} /> : children}
    </button>
  );
}

/* ─── Input ──────────────────────────────────────────────────────────────── */
export function Input({ label, error, style, ...props }) {
  return (
    <div style={{ marginBottom: 16, ...style }}>
      {label && <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text2)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</label>}
      <input {...props} style={{
        width: '100%', padding: '10px 14px', background: 'var(--surface2)', border: `1px solid ${error ? 'var(--danger)' : 'var(--border)'}`,
        borderRadius: 'var(--radius)', fontFamily: 'var(--font)', fontSize: 14, color: 'var(--text)',
        outline: 'none', transition: 'border-color 0.15s', ...(props.inputStyle || {}),
      }}
        onFocus={e => e.target.style.borderColor = error ? 'var(--danger)' : 'var(--primary)'}
        onBlur={e => e.target.style.borderColor = error ? 'var(--danger)' : 'var(--border)'}
      />
      {error && <div style={{ fontSize: 12, color: 'var(--danger)', marginTop: 4 }}>{error}</div>}
    </div>
  );
}

/* ─── Textarea ───────────────────────────────────────────────────────────── */
export function Textarea({ label, style, ...props }) {
  return (
    <div style={{ marginBottom: 16, ...style }}>
      {label && <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text2)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</label>}
      <textarea {...props} style={{
        width: '100%', padding: '10px 14px', background: 'var(--surface2)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius)', fontFamily: 'var(--font)', fontSize: 14, color: 'var(--text)',
        outline: 'none', resize: 'vertical', minHeight: 80,
      }}
        onFocus={e => e.target.style.borderColor = 'var(--primary)'}
        onBlur={e => e.target.style.borderColor = 'var(--border)'}
      />
    </div>
  );
}

/* ─── Select ─────────────────────────────────────────────────────────────── */
export function Select({ label, children, style, ...props }) {
  return (
    <div style={{ marginBottom: 16, ...style }}>
      {label && <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text2)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</label>}
      <select {...props} style={{
        width: '100%', padding: '10px 14px', background: 'var(--surface2)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius)', fontFamily: 'var(--font)', fontSize: 14, color: 'var(--text)',
        outline: 'none', cursor: 'pointer', appearance: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%238a93a8' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center',
      }}>
        {children}
      </select>
    </div>
  );
}

/* ─── Badge ──────────────────────────────────────────────────────────────── */
const BADGE_STYLES = {
  todo:        { bg: 'rgba(107,114,128,0.12)', color: '#6b7280' },
  'in-progress': { bg: 'var(--primary-light)', color: 'var(--primary)' },
  done:        { bg: 'var(--success-light)', color: 'var(--success)' },
  overdue:     { bg: 'var(--danger-light)', color: 'var(--danger)' },
  admin:       { bg: 'var(--purple-light)', color: 'var(--purple)' },
  member:      { bg: 'rgba(34,211,238,0.12)', color: 'var(--accent)' },
  warning:     { bg: 'var(--warning-light)', color: 'var(--warning)' },
  info:        { bg: 'var(--primary-light)', color: 'var(--primary)' },
};

export function Badge({ type = 'todo', children, style }) {
  const s = BADGE_STYLES[type] || BADGE_STYLES.todo;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '3px 9px', borderRadius: 20, fontSize: 11, fontWeight: 700,
      background: s.bg, color: s.color, ...style,
    }}>
      {children}
    </span>
  );
}

/* ─── Avatar ─────────────────────────────────────────────────────────────── */
export function Avatar({ name, size = 32, style }) {
  const { bg, color } = getAvatarStyle(name);
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', background: bg, color,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.36, fontWeight: 700, flexShrink: 0, ...style,
    }}>
      {getInitials(name)}
    </div>
  );
}

/* ─── Spinner ────────────────────────────────────────────────────────────── */
export function Spinner({ size = 20, color = 'var(--primary)', style }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      border: `2px solid transparent`,
      borderTopColor: color, borderRightColor: color,
      animation: 'spin 0.7s linear infinite', flexShrink: 0, ...style,
    }} />
  );
}

/* ─── Card ───────────────────────────────────────────────────────────────── */
export function Card({ children, style, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: 'var(--surface)', borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border)', boxShadow: 'var(--shadow)',
      padding: 20, ...(onClick ? { cursor: 'pointer' } : {}), ...style,
    }}>
      {children}
    </div>
  );
}

/* ─── StatCard ───────────────────────────────────────────────────────────── */
export function StatCard({ label, value, accent, icon }) {
  return (
    <div style={{
      background: 'var(--surface2)', borderRadius: 'var(--radius)',
      border: '1px solid var(--border)', padding: '16px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
        {icon && <div style={{ fontSize: 18, opacity: 0.7 }}>{icon}</div>}
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, color: accent || 'var(--text)', lineHeight: 1 }}>{value}</div>
    </div>
  );
}

/* ─── Modal ──────────────────────────────────────────────────────────────── */
export function Modal({ title, onClose, children, width = 480 }) {
  React.useEffect(() => {
    const handler = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000, padding: 16, backdropFilter: 'blur(2px)',
      }}>
      <div style={{
        background: 'var(--surface)', borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-xl)', padding: 28, width: '100%', maxWidth: width,
        maxHeight: '90vh', overflowY: 'auto', border: '1px solid var(--border)',
        animation: 'scaleIn 0.2s ease both',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--text)' }}>{title}</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)', fontSize: 20, lineHeight: 1, padding: '4px 6px', borderRadius: 6 }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ─── EmptyState ─────────────────────────────────────────────────────────── */
export function EmptyState({ icon, title, description, action }) {
  return (
    <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--text3)' }}>
      <div style={{ fontSize: 44, marginBottom: 14, opacity: 0.6 }}>{icon}</div>
      {title && <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text2)', marginBottom: 6 }}>{title}</div>}
      {description && <div style={{ fontSize: 13, marginBottom: 20 }}>{description}</div>}
      {action}
    </div>
  );
}

/* ─── Divider ────────────────────────────────────────────────────────────── */
export function Divider({ style }) {
  return <div style={{ height: 1, background: 'var(--border)', margin: '16px 0', ...style }} />;
}

/* ─── Dot ────────────────────────────────────────────────────────────────── */
const DOT_COLORS = {
  'todo': '#9ca3af', 'in-progress': 'var(--primary)',
  'done': 'var(--success)', 'overdue': 'var(--danger)',
};

export function StatusDot({ status, size = 8 }) {
  return <div style={{ width: size, height: size, borderRadius: '50%', background: DOT_COLORS[status] || '#9ca3af', flexShrink: 0 }} />;
}
