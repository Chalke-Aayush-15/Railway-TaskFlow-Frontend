import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

const TOAST_ICONS = {
  success: '✓',
  error:   '✕',
  warning: '⚠',
  info:    'ℹ',
};

const TOAST_COLORS = {
  success: 'var(--success)',
  error:   'var(--danger)',
  warning: 'var(--warning)',
  info:    'var(--primary)',
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const show = useCallback((message, type = 'success') => {
    const id = Date.now();
    const msg = typeof message === 'string' ? message : (message?.message || String(message));
    setToasts((prev) => [...prev, { id, message: msg, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(40px) scale(0.96); }
          to   { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes toastOut {
          from { opacity: 1; transform: translateX(0); }
          to   { opacity: 0; transform: translateX(40px); }
        }
      `}</style>
      <div style={{
        position: 'fixed', bottom: 28, right: 28,
        zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 10,
      }}>
        {toasts.map((t) => {
          const color = TOAST_COLORS[t.type] || TOAST_COLORS.success;
          return (
            <div key={t.id} style={{
              background: 'var(--surface)',
              border: '1px solid var(--border2)',
              borderLeft: `3px solid ${color}`,
              borderRadius: 'var(--radius-lg)',
              padding: '13px 18px',
              boxShadow: 'var(--shadow-xl)',
              display: 'flex', alignItems: 'center', gap: 10,
              fontSize: 13, fontWeight: 500,
              color: 'var(--text)',
              animation: 'toastIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both',
              minWidth: 260, maxWidth: 400,
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}>
              <div style={{
                width: 22, height: 22, borderRadius: '50%',
                background: `${color}20`,
                border: `1px solid ${color}40`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color, fontSize: 12, fontWeight: 700, flexShrink: 0,
              }}>
                {TOAST_ICONS[t.type] || '✓'}
              </div>
              <span style={{ flex: 1, lineHeight: 1.4 }}>{t.message}</span>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
