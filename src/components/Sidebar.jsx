import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Avatar } from './UI';

const NAV_ITEMS = [
  { to: '/dashboard', icon: '📊', label: 'Dashboard' },
  { to: '/my-tasks',  icon: '✅', label: 'My Tasks' },
  { to: '/projects',  icon: '📁', label: 'Projects' },
  { to: '/profile',   icon: '👤', label: 'Profile' },
];

const ADMIN_ITEMS = [
  { to: '/team', icon: '👥', label: 'Team' },
];

export default function Sidebar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const items = isAdmin ? [...NAV_ITEMS.slice(0, 3), ...ADMIN_ITEMS, NAV_ITEMS[3]] : NAV_ITEMS;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside style={{
      width: 'var(--sidebar-w)', background: 'var(--surface)',
      borderRight: '1px solid var(--border)', height: '100vh',
      position: 'fixed', left: 0, top: 0, display: 'flex',
      flexDirection: 'column', zIndex: 100,
    }}>
      {/* Logo */}
      <div style={{ padding: '18px 20px 14px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, background: 'var(--primary)', borderRadius: 9,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 15, fontWeight: 800,
          }}>T</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text)', lineHeight: 1 }}>TaskFlow</div>
            <div style={{ fontSize: 10, color: 'var(--text3)', fontWeight: 500, letterSpacing: '0.05em' }}>TEAM WORKSPACE</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: '10px 8px', flex: 1 }}>
        {items.map(({ to, icon, label }) => (
          <NavLink key={to} to={to} style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px',
            borderRadius: 'var(--radius)', margin: '1px 0', cursor: 'pointer',
            fontSize: 13, fontWeight: isActive ? 600 : 500, textDecoration: 'none',
            color: isActive ? 'var(--primary)' : 'var(--text2)',
            background: isActive ? 'var(--primary-light)' : 'transparent',
            transition: 'all 0.15s',
          })}>
            <span style={{ fontSize: 15, width: 20, textAlign: 'center' }}>{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User footer */}
      <div style={{ padding: 12, borderTop: '1px solid var(--border)' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: 10, borderRadius: 'var(--radius)', background: 'var(--surface2)',
        }}>
          <Avatar name={user?.name} size={30} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
            <div style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'capitalize' }}>{user?.role}</div>
          </div>
          <button onClick={handleLogout} title="Sign out" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)', fontSize: 14, padding: 4, borderRadius: 4 }}>⏻</button>
        </div>
      </div>
    </aside>
  );
}
