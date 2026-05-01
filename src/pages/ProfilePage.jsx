import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import Topbar from '../components/Topbar';
import { Avatar, Badge, Card, StatCard, Divider, Button } from '../components/UI';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../utils/api';
import { isOverdue, formatDate, getInitials } from '../utils/helpers';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { show } = useToast();
  const navigate = useNavigate();
  const [tasks, setTasks]       = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [copied, setCopied]     = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [tRes, pRes] = await Promise.all([
          api.get('/tasks/me/assigned').catch(() => []),
          api.get('/projects').catch(() => []),
        ]);
        setTasks(tRes.tasks || tRes || []);
        setProjects(pRes.projects || pRes || []);
      } catch (e) {
        show(e, 'error');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const userId = user?.id || user?._id || '—';
  const done   = tasks.filter(t => t.status === 'done').length;
  const inProg = tasks.filter(t => t.status === 'in-progress').length;
  const overdue = tasks.filter(t => isOverdue(t)).length;
  const pct    = tasks.length ? Math.round((done / tasks.length) * 100) : 0;

  const handleCopyId = () => {
    navigator.clipboard.writeText(userId).then(() => {
      setCopied(true);
      show('User ID copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppLayout>
      <Topbar title="Profile" subtitle="Your account & activity" />

      <div style={{ padding: 28, animation: 'fadeIn 0.3s ease both' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 22, alignItems: 'start' }}>

          {/* Left: Profile card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Card style={{ textAlign: 'center', padding: '32px 24px' }}>
              <div style={{ position: 'relative', display: 'inline-block', marginBottom: 16 }}>
                <Avatar name={user?.name} size={72} />
                <div style={{
                  position: 'absolute', bottom: 0, right: 0, width: 20, height: 20,
                  background: 'var(--success)', borderRadius: '50%',
                  border: '2px solid var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#fff' }} />
                </div>
              </div>

              <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)', marginBottom: 4 }}>{user?.name}</div>
              <div style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 12 }}>{user?.email}</div>
              <Badge type={user?.role === 'admin' ? 'admin' : 'member'} style={{ fontSize: 12, padding: '4px 14px' }}>
                {user?.role === 'admin' ? '🔑 Admin' : '👤 Member'}
              </Badge>

              <Divider />

              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div style={{ background: 'var(--surface2)', borderRadius: 'var(--radius)', padding: '12px 10px', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)' }}>{tasks.length}</div>
                  <div style={{ fontSize: 10, color: 'var(--text3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 2 }}>Assigned</div>
                </div>
                <div style={{ background: 'var(--surface2)', borderRadius: 'var(--radius)', padding: '12px 10px', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--success)' }}>{done}</div>
                  <div style={{ fontSize: 10, color: 'var(--text3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 2 }}>Done</div>
                </div>
                <div style={{ background: 'var(--surface2)', borderRadius: 'var(--radius)', padding: '12px 10px', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--primary)' }}>{inProg}</div>
                  <div style={{ fontSize: 10, color: 'var(--text3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 2 }}>Active</div>
                </div>
                <div style={{ background: 'var(--surface2)', borderRadius: 'var(--radius)', padding: '12px 10px', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: overdue > 0 ? 'var(--danger)' : 'var(--text3)' }}>{overdue}</div>
                  <div style={{ fontSize: 10, color: 'var(--text3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 2 }}>Overdue</div>
                </div>
              </div>

              {/* Progress */}
              {tasks.length > 0 && (
                <div style={{ marginTop: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text3)', marginBottom: 6 }}>
                    <span>Completion</span>
                    <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{pct}%</span>
                  </div>
                  <div style={{ height: 6, background: 'var(--surface2)', borderRadius: 3, overflow: 'hidden', border: '1px solid var(--border)' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, var(--primary), var(--accent))', borderRadius: 3, transition: 'width 0.6s' }} />
                  </div>
                </div>
              )}
            </Card>

            {/* Quick actions */}
            <Card style={{ padding: '18px 20px' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>Quick Actions</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <Button variant="ghost" onClick={() => navigate('/my-tasks')} style={{ justifyContent: 'flex-start', gap: 8 }}>
                  ✅ View My Tasks
                </Button>
                <Button variant="ghost" onClick={() => navigate('/projects')} style={{ justifyContent: 'flex-start', gap: 8 }}>
                  📁 My Projects
                </Button>
                <Divider style={{ margin: '4px 0' }} />
                <Button variant="danger" size="sm" onClick={handleLogout} style={{ justifyContent: 'flex-start', gap: 8 }}>
                  ⏻ Sign Out
                </Button>
              </div>
            </Card>
          </div>

          {/* Right: Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Account info */}
            <Card>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 18 }}>Account Details</div>
              {[
                { label: 'Full Name', value: user?.name },
                { label: 'Email',     value: user?.email },
                { label: 'Role',      value: null, badge: user?.role },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ width: 140, fontSize: 12, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{row.label}</div>
                  {row.badge
                    ? <Badge type={row.badge === 'admin' ? 'admin' : 'member'}>{row.badge}</Badge>
                    : <div style={{ fontSize: 14, color: 'var(--text)' }}>{row.value || '—'}</div>
                  }
                </div>
              ))}

              {/* User ID — important for adding to projects */}
              <div style={{ display: 'flex', alignItems: 'center', padding: '14px 0' }}>
                <div style={{ width: 140, fontSize: 12, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>User ID</div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <code style={{
                    fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--text2)',
                    background: 'var(--surface2)', padding: '4px 10px', borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border)', wordBreak: 'break-all',
                  }}>{userId}</code>
                  <Button variant="ghost" size="sm" onClick={handleCopyId} style={{ flexShrink: 0 }}>
                    {copied ? '✓ Copied' : '📋 Copy'}
                  </Button>
                </div>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text3)', background: 'var(--primary-light)', borderRadius: 'var(--radius)', padding: '8px 12px', border: '1px solid var(--primary-border)' }}>
                💡 Share your User ID with project admins to be added to their projects
              </div>
            </Card>

            {/* Projects I'm in */}
            <Card>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 16 }}>
                My Projects ({projects.length})
              </div>
              {projects.length === 0 ? (
                <div style={{ fontSize: 13, color: 'var(--text3)', textAlign: 'center', padding: '20px 0' }}>
                  Not a member of any projects yet
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {projects.map(p => (
                    <div
                      key={p.id || p._id}
                      onClick={() => navigate(`/projects/${p.id || p._id}`)}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '12px 14px', background: 'var(--surface2)', borderRadius: 'var(--radius)',
                        border: '1px solid var(--border)', cursor: 'pointer', transition: 'border-color 0.15s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                    >
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{p.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text3)' }}>→</div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Recent activity */}
            {tasks.length > 0 && (
              <Card>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 16 }}>Recent Task Activity</div>
                <div>
                  {[...tasks]
                    .sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0))
                    .slice(0, 5)
                    .map(t => (
                      <div key={t.id || t._id} style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '10px 0', borderBottom: '1px solid var(--border)',
                      }}>
                        <div style={{
                          width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                          background: t.status === 'done' ? 'var(--success)' : t.status === 'in-progress' ? 'var(--primary)' : '#9ca3af',
                        }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', textDecoration: t.status === 'done' ? 'line-through' : 'none', opacity: t.status === 'done' ? 0.65 : 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {t.title}
                          </div>
                        </div>
                        <Badge type={isOverdue(t) ? 'overdue' : t.status} style={{ flexShrink: 0, fontSize: 10 }}>
                          {isOverdue(t) ? 'Overdue' : t.status === 'in-progress' ? 'Active' : t.status.charAt(0).toUpperCase() + t.status.slice(1)}
                        </Badge>
                      </div>
                    ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
