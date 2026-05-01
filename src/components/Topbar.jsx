import React from 'react';
import { useTheme } from '../context/ThemeContext';

export default function Topbar({ title, subtitle, actions }) {
  const { theme, toggle } = useTheme();

  return (
    <>
      <style>{`
        .tf-topbar {
          background: var(--surface);
          border-bottom: 1px solid var(--border);
          padding: 0 28px;
          height: var(--topbar-h);
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 99;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }

        .tf-topbar__title {
          font-family: var(--font-display);
          font-size: 16px;
          font-weight: 700;
          color: var(--text);
          letter-spacing: -0.3px;
          line-height: 1.2;
        }

        .tf-topbar__subtitle {
          font-size: 12px;
          color: var(--text3);
          margin-top: 2px;
          font-weight: 400;
        }

        .tf-topbar__actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .tf-topbar__theme-btn {
          background: var(--surface2);
          border: 1px solid var(--border);
          border-radius: var(--radius-pill);
          width: 34px;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 15px;
          transition: background 0.2s, border-color 0.2s;
        }

        .tf-topbar__theme-btn:hover {
          background: var(--surface3);
          border-color: var(--border2);
        }
      `}</style>
      <div className="tf-topbar">
        <div>
          {title && <div className="tf-topbar__title">{title}</div>}
          {subtitle && <div className="tf-topbar__subtitle">{subtitle}</div>}
        </div>
        <div className="tf-topbar__actions">
          {actions}
          <button
            className="tf-topbar__theme-btn"
            onClick={toggle}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </>
  );
}
