import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Button } from './UI';

export default function Topbar({ title, subtitle, actions }) {
  const { theme, toggle } = useTheme();

  return (
    <div style={{
      background: 'var(--surface)', borderBottom: '1px solid var(--border)',
      padding: '0 28px', height: 'var(--topbar-h)', display: 'flex',
      alignItems: 'center', justifyContent: 'space-between',
      position: 'sticky', top: 0, zIndex: 99,
    }}>
      <div>
        {title && <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>{title}</div>}
        {subtitle && <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 1 }}>{subtitle}</div>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {actions}
        <Button variant="ghost" size="sm" onClick={toggle} style={{ fontSize: 15, padding: '5px 8px' }}>
          {theme === 'dark' ? '☀️' : '🌙'}
        </Button>
      </div>
    </div>
  );
}
