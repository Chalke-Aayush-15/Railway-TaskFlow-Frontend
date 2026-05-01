import React, { useState } from 'react';
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
  const [hovered, setHovered] = useState(null);

  const items = isAdmin
    ? [...NAV_ITEMS.slice(0, 3), ...ADMIN_ITEMS, NAV_ITEMS[3]]
    : NAV_ITEMS;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <style>{`
        .tf-sidebar {
          width: var(--sidebar-w);
          background: var(--surface);
          border-right: 1px solid var(--border);
          height: 100vh;
          position: fixed;
          left: 0;
          top: 0;
          display: flex;
          flex-direction: column;
          z-index: 100;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }

        .tf-sidebar__logo {
          padding: 18px 18px 14px;
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }

        .tf-sidebar__logo-mark {
          width: 34px;
          height: 34px;
          background: linear-gradient(135deg, var(--primary), var(--accent-2, #845EC2));
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-display);
          font-weight: 800;
          font-size: 17px;
          color: #fff;
          box-shadow: 0 0 20px rgba(255,107,53,0.35);
          flex-shrink: 0;
        }

        .tf-sidebar__logo-text {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 16px;
          color: var(--text);
          letter-spacing: -0.3px;
          line-height: 1.1;
        }

        .tf-sidebar__logo-sub {
          font-size: 9px;
          color: var(--text3);
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-top: 2px;
        }

        .tf-sidebar__nav {
          padding: 10px 10px;
          flex: 1;
          overflow-y: auto;
        }

        .tf-nav-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 12px;
          border-radius: var(--radius);
          margin: 2px 0;
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
          text-decoration: none;
          color: var(--text2);
          background: transparent;
          transition: all 0.15s ease;
          border: 1px solid transparent;
          position: relative;
          overflow: hidden;
        }

        .tf-nav-item::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 2px;
          background: var(--primary);
          border-radius: 0 2px 2px 0;
          opacity: 0;
          transition: opacity 0.15s ease;
        }

        .tf-nav-item:hover {
          color: var(--text);
          background: var(--surface2);
          border-color: var(--border);
        }

        .tf-nav-item.active {
          color: var(--primary);
          background: var(--primary-light);
          font-weight: 700;
          border-color: var(--primary-border);
        }

        .tf-nav-item.active::before {
          opacity: 1;
        }

        .tf-nav-item__icon {
          font-size: 15px;
          width: 20px;
          text-align: center;
          flex-shrink: 0;
        }

        .tf-sidebar__footer {
          padding: 12px;
          border-top: 1px solid var(--border);
        }

        .tf-sidebar__user {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: var(--radius);
          background: var(--surface2);
          border: 1px solid var(--border);
          transition: border-color 0.15s;
        }

        .tf-sidebar__user:hover {
          border-color: var(--border2);
        }

        .tf-sidebar__user-name {
          font-size: 12px;
          font-weight: 700;
          color: var(--text);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: 1.2;
        }

        .tf-sidebar__user-role {
          font-size: 10px;
          color: var(--text3);
          text-transform: capitalize;
          font-weight: 500;
          letter-spacing: 0.02em;
        }

        .tf-sidebar__logout {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--text3);
          font-size: 14px;
          padding: 4px 6px;
          border-radius: 6px;
          transition: color 0.15s, background 0.15s;
          flex-shrink: 0;
        }

        .tf-sidebar__logout:hover {
          color: var(--danger);
          background: var(--danger-light);
        }
      `}</style>

      <aside className="tf-sidebar">
        {/* Logo */}
        <div className="tf-sidebar__logo">
          <div className="tf-sidebar__logo-mark">T</div>
          <div>
            <div className="tf-sidebar__logo-text">TaskFlow</div>
            <div className="tf-sidebar__logo-sub">Team Workspace</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="tf-sidebar__nav">
          {items.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `tf-nav-item${isActive ? ' active' : ''}`
              }
            >
              <span className="tf-nav-item__icon">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User footer */}
        <div className="tf-sidebar__footer">
          <div className="tf-sidebar__user">
            <Avatar name={user?.name} size={30} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="tf-sidebar__user-name">{user?.name}</div>
              <div className="tf-sidebar__user-role">{user?.role}</div>
            </div>
            <button
              onClick={handleLogout}
              title="Sign out"
              className="tf-sidebar__logout"
            >
              ⏻
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
