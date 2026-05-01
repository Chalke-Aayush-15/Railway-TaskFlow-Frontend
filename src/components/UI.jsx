import React from 'react';
import { getInitials, getAvatarStyle } from '../utils/helpers';

/* ══════════════════════════════════════════════════════════════
   TaskFlow UI Component Library
   Aesthetic: Editorial dark-tech — matches HomePage theme
   ══════════════════════════════════════════════════════════════ */

/* ─── Button ──────────────────────────────────────────────────── */
export function Button({ children, variant = 'primary', size = 'md', loading, style, ...props }) {
  const base = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    gap: 6, cursor: loading || props.disabled ? 'not-allowed' : 'pointer',
    fontFamily: 'var(--font)', fontWeight: 600, borderRadius: 'var(--radius-pill)',
    transition: 'all 0.18s ease', textDecoration: 'none', outline: 'none',
    opacity: props.disabled ? 0.55 : 1, border: 'none', letterSpacing: '0.01em',
  };
  const sizes = {
    sm:  { padding: '6px 14px', fontSize: 12 },
    md:  { padding: '10px 20px', fontSize: 13 },
    lg:  { padding: '13px 26px', fontSize: 15 },
  };
  const variants = {
    primary: {
      background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
      color: '#fff',
      boxShadow: '0 4px 18px rgba(255,107,53,0.32)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text2)',
      border: '1px solid var(--border)',
      boxShadow: 'none',
    },
    danger: {
      background: 'linear-gradient(135deg, #FF4D6D 0%, #e03050 100%)',
      color: '#fff',
      boxShadow: '0 4px 18px rgba(255,77,109,0.28)',
    },
    success: {
      background: 'linear-gradient(135deg, var(--success) 0%, #00a882 100%)',
      color: '#fff',
      boxShadow: '0 4px 18px rgba(0,201,167,0.28)',
    },
    subtle: {
      background: 'var(--surface2)',
      color: 'var(--text2)',
      border: '1px solid var(--border)',
      boxShadow: 'none',
    },
  };

  const hoverMap = {
    primary: { transform: 'translateY(-1px)', boxShadow: '0 6px 24px rgba(255,107,53,0.40)' },
    ghost:   { background: 'var(--surface2)', borderColor: 'var(--border2)', color: 'var(--text)' },
    danger:  { transform: 'translateY(-1px)', boxShadow: '0 6px 24px rgba(255,77,109,0.38)' },
    success: { transform: 'translateY(-1px)' },
    subtle:  { background: 'var(--surface3)', borderColor: 'var(--border2)' },
  };

  const [hov, setHov] = React.useState(false);

  return (
    <button
      {...props}
      onMouseEnter={e => { setHov(true); props.onMouseEnter?.(e); }}
      onMouseLeave={e => { setHov(false); props.onMouseLeave?.(e); }}
      style={{
        ...base,
        ...sizes[size],
        ...variants[variant],
        ...(hov && !loading && !props.disabled ? hoverMap[variant] : {}),
        ...style,
      }}
    >
      {loading
        ? <Spinner size={13} color={variant === 'ghost' || variant === 'subtle' ? 'var(--text3)' : '#fff'} />
        : children}
    </button>
  );
}

/* ─── Input ──────────────────────────────────────────────────── */
export function Input({ label, error, style, ...props }) {
  return (
    <div style={{ marginBottom: 16, ...style }}>
      {label && (
        <label style={{
          display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text2)',
          marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.07em',
        }}>
          {label}
        </label>
      )}
      <input
        {...props}
        style={{
          width: '100%', padding: '11px 14px',
          background: 'var(--surface2)',
          border: `1px solid ${error ? 'var(--danger)' : 'var(--border)'}`,
          borderRadius: 'var(--radius)', fontFamily: 'var(--font)', fontSize: 14,
          color: 'var(--text)', outline: 'none', transition: 'border-color 0.18s, box-shadow 0.18s',
          ...(props.inputStyle || {}),
        }}
        onFocus={e => {
          e.target.style.borderColor = error ? 'var(--danger)' : 'var(--primary)';
          e.target.style.boxShadow = error
            ? '0 0 0 3px rgba(255,77,109,0.10)'
            : '0 0 0 3px rgba(255,107,53,0.10)';
          props.onFocus?.(e);
        }}
        onBlur={e => {
          e.target.style.borderColor = error ? 'var(--danger)' : 'var(--border)';
          e.target.style.boxShadow = 'none';
          props.onBlur?.(e);
        }}
      />
      {error && <div style={{ fontSize: 12, color: 'var(--danger)', marginTop: 5 }}>{error}</div>}
    </div>
  );
}

/* ─── Textarea ───────────────────────────────────────────────── */
export function Textarea({ label, style, ...props }) {
  return (
    <div style={{ marginBottom: 16, ...style }}>
      {label && (
        <label style={{
          display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text2)',
          marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.07em',
        }}>
          {label}
        </label>
      )}
      <textarea
        {...props}
        style={{
          width: '100%', padding: '11px 14px',
          background: 'var(--surface2)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)', fontFamily: 'var(--font)', fontSize: 14,
          color: 'var(--text)', outline: 'none', resize: 'vertical', minHeight: 80,
          transition: 'border-color 0.18s, box-shadow 0.18s',
        }}
        onFocus={e => {
          e.target.style.borderColor = 'var(--primary)';
          e.target.style.boxShadow = '0 0 0 3px rgba(255,107,53,0.10)';
        }}
        onBlur={e => {
          e.target.style.borderColor = 'var(--border)';
          e.target.style.boxShadow = 'none';
        }}
      />
    </div>
  );
}

/* ─── Select ─────────────────────────────────────────────────── */
export function Select({ label, children, style, ...props }) {
  return (
    <div style={{ marginBottom: 16, ...style }}>
      {label && (
        <label style={{
          display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text2)',
          marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.07em',
        }}>
          {label}
        </label>
      )}
      <select
        {...props}
        style={{
          width: '100%', padding: '11px 14px',
          background: 'var(--surface2)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)', fontFamily: 'var(--font)', fontSize: 14,
          color: 'var(--text)', outline: 'none', cursor: 'pointer', appearance: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%235C5B72' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center',
          transition: 'border-color 0.18s',
        }}
        onFocus={e => e.target.style.borderColor = 'var(--primary)'}
        onBlur={e => e.target.style.borderColor = 'var(--border)'}
      >
        {children}
      </select>
    </div>
  );
}

/* ─── Badge ──────────────────────────────────────────────────── */
const BADGE_STYLES = {
  todo:          { bg: 'rgba(107,114,128,0.12)', color: '#6b7280',        border: 'rgba(107,114,128,0.20)' },
  'in-progress': { bg: 'var(--primary-light)',   color: 'var(--primary)', border: 'var(--primary-border)' },
  done:          { bg: 'var(--success-light)',   color: 'var(--success)', border: 'rgba(0,201,167,0.22)' },
  overdue:       { bg: 'var(--danger-light)',    color: 'var(--danger)',  border: 'rgba(255,77,109,0.22)' },
  admin:         { bg: 'var(--purple-light)',    color: 'var(--purple)',  border: 'rgba(132,94,194,0.22)' },
  member:        { bg: 'rgba(34,211,238,0.10)',  color: 'var(--accent)',  border: 'rgba(34,211,238,0.20)' },
  warning:       { bg: 'var(--warning-light)',   color: 'var(--warning)', border: 'rgba(251,191,36,0.22)' },
  info:          { bg: 'var(--primary-light)',   color: 'var(--primary)', border: 'var(--primary-border)' },
};

export function Badge({ type = 'todo', children, style }) {
  const s = BADGE_STYLES[type] || BADGE_STYLES.todo;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '3px 10px', borderRadius: 'var(--radius-pill)',
      fontSize: 11, fontWeight: 700, letterSpacing: '0.02em',
      background: s.bg, color: s.color,
      border: `1px solid ${s.border}`,
      ...style,
    }}>
      {children}
    </span>
  );
}

/* ─── Avatar ─────────────────────────────────────────────────── */
export function Avatar({ name, size = 32, style }) {
  const { bg, color } = getAvatarStyle(name);
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: bg, color,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.36, fontWeight: 700, flexShrink: 0,
      border: '1.5px solid rgba(255,255,255,0.06)',
      ...style,
    }}>
      {getInitials(name)}
    </div>
  );
}

/* ─── Spinner ────────────────────────────────────────────────── */
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

/* ─── Card ───────────────────────────────────────────────────── */
export function Card({ children, style, onClick, hover = true }) {
  const [hov, setHov] = React.useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => hover && onClick && setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: 'var(--surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border)',
        boxShadow: hov ? 'var(--shadow-lg)' : 'var(--shadow)',
        padding: 20,
        transition: 'box-shadow 0.2s, border-color 0.2s, transform 0.2s',
        transform: hov ? 'translateY(-2px)' : 'translateY(0)',
        borderColor: hov ? 'var(--border2)' : 'var(--border)',
        ...(onClick ? { cursor: 'pointer' } : {}),
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ─── StatCard ───────────────────────────────────────────────── */
export function StatCard({ label, value, accent, icon }) {
  const [hov, setHov] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? 'var(--surface2)' : 'var(--surface)',
        borderRadius: 'var(--radius-lg)',
        border: `1px solid ${hov ? 'var(--border2)' : 'var(--border)'}`,
        padding: '18px 16px',
        transition: 'all 0.2s ease',
        boxShadow: hov ? 'var(--shadow)' : 'none',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle top accent line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: accent || 'var(--primary)',
        opacity: hov ? 0.8 : 0.3,
        transition: 'opacity 0.2s',
      }} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{
          fontSize: 10, fontWeight: 700, color: 'var(--text3)',
          textTransform: 'uppercase', letterSpacing: '0.08em',
        }}>
          {label}
        </div>
        {icon && (
          <div style={{ fontSize: 18, opacity: hov ? 0.9 : 0.6, transition: 'opacity 0.2s' }}>
            {icon}
          </div>
        )}
      </div>
      <div style={{
        fontSize: 30, fontWeight: 800, color: accent || 'var(--text)',
        lineHeight: 1, fontFamily: 'var(--font-display)',
        letterSpacing: '-1px',
      }}>
        {value}
      </div>
    </div>
  );
}

/* ─── Modal ──────────────────────────────────────────────────── */
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
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.65)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000, padding: 16, backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
      }}
    >
      <div style={{
        background: 'var(--surface)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-xl)',
        border: '1px solid var(--border2)',
        padding: 28, width: '100%', maxWidth: width,
        maxHeight: '90vh', overflowY: 'auto',
        animation: 'scaleIn 0.2s ease both',
      }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: 22,
        }}>
          <div style={{
            fontSize: 17, fontWeight: 700, color: 'var(--text)',
            fontFamily: 'var(--font-display)', letterSpacing: '-0.3px',
          }}>
            {title}
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'var(--surface2)', border: '1px solid var(--border)',
              cursor: 'pointer', color: 'var(--text3)', fontSize: 14,
              lineHeight: 1, padding: '6px 8px', borderRadius: 8,
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface3)'; e.currentTarget.style.color = 'var(--text)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface2)'; e.currentTarget.style.color = 'var(--text3)'; }}
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ─── EmptyState ─────────────────────────────────────────────── */
export function EmptyState({ icon, title, description, action }) {
  return (
    <div style={{ textAlign: 'center', padding: '52px 24px', color: 'var(--text3)' }}>
      <div style={{
        fontSize: 48, marginBottom: 16, opacity: 0.55,
        animation: 'fadeUp 0.5s ease both',
      }}>
        {icon}
      </div>
      {title && (
        <div style={{
          fontSize: 15, fontWeight: 700, color: 'var(--text2)',
          marginBottom: 8, fontFamily: 'var(--font-display)',
          animation: 'fadeUp 0.5s ease 0.05s both',
        }}>
          {title}
        </div>
      )}
      {description && (
        <div style={{
          fontSize: 13, marginBottom: 22, lineHeight: 1.6,
          animation: 'fadeUp 0.5s ease 0.1s both',
        }}>
          {description}
        </div>
      )}
      {action && (
        <div style={{ animation: 'fadeUp 0.5s ease 0.15s both' }}>
          {action}
        </div>
      )}
    </div>
  );
}

/* ─── Divider ────────────────────────────────────────────────── */
export function Divider({ style }) {
  return (
    <div style={{
      height: 1,
      background: 'linear-gradient(90deg, transparent, var(--border), transparent)',
      margin: '16px 0',
      ...style,
    }} />
  );
}

/* ─── StatusDot ──────────────────────────────────────────────── */
const DOT_COLORS = {
  'todo': '#9ca3af',
  'in-progress': 'var(--primary)',
  'done': 'var(--success)',
  'overdue': 'var(--danger)',
};

export function StatusDot({ status, size = 8 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: DOT_COLORS[status] || '#9ca3af',
      flexShrink: 0,
      boxShadow: `0 0 ${size * 1.5}px ${DOT_COLORS[status] || '#9ca3af'}60`,
    }} />
  );
}

/* ─── ProgressBar ────────────────────────────────────────────── */
export function ProgressBar({ value = 0, color, style }) {
  return (
    <div style={{
      height: 7, background: 'var(--surface2)',
      borderRadius: 99, overflow: 'hidden',
      border: '1px solid var(--border)',
      ...style,
    }}>
      <div style={{
        height: '100%',
        width: `${Math.max(0, Math.min(100, value))}%`,
        background: color || 'linear-gradient(90deg, var(--primary), var(--accent-2, #845EC2))',
        borderRadius: 99,
        transition: 'width 0.7s ease',
        animation: 'barGrow 1s ease both',
      }} />
    </div>
  );
}

/* ─── SectionHeader ──────────────────────────────────────────── */
export function SectionHeader({ title, count, color = 'var(--primary)' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
      <div style={{
        width: 7, height: 7, borderRadius: '50%', background: color,
        boxShadow: `0 0 8px ${color}80`,
      }} />
      <span style={{
        fontSize: 11, fontWeight: 700, color: 'var(--text2)',
        textTransform: 'uppercase', letterSpacing: '0.08em',
      }}>
        {title}
      </span>
      {count !== undefined && (
        <span style={{
          background: 'var(--surface2)', color: 'var(--text3)',
          fontSize: 10, fontWeight: 700, padding: '1px 7px',
          borderRadius: 10, border: '1px solid var(--border)',
        }}>
          {count}
        </span>
      )}
    </div>
  );
}
