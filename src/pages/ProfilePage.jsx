import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import Topbar from '../components/Topbar';
import { Avatar, Badge, Card, Divider, Button, ProgressBar } from '../components/UI';
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

      <div style={{ padding: 28, animation: 'fadeIn 0.4s ease both' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 20, alignItems: 'start' }}>

          {/* ── Left: Profile card ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Profile hero */}
            <div style={{
              background: 'var(--surface)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow)',
              overflow: 'hidden',
              animation: 'fadeUp 0.4s ease 0.05s both',
            }}>
              {/* Banner gradient */}
              <div style={{
                height: 72,
                background: 'linear-gradient(135deg, rgba(255,107,53,0.20) 0%, rgba(132,94,194,0.20) 100%)',
                borderBottom: '1px solid var(--border)',
                position: 'relative',
              }}>
                <div style={{
                  position: 'absolute',
                  bottom: -30, left: '50%', transform: 'translateX(-50%)',
                }}>
                  <div style={{ position: 'relative', display: 'inline-block' }}>
                    <Avatar name={user?.name} size={60} style={{
                      border: '3px solid var(--surface)',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                    }} />
                    <div style={{
                      position: 'absolute', bottom: 2, right: 2,
                      width: 14, height: 14,
                      background: 'var(--success)', borderRadius: '50%',
                      border: '2px solid var(--surface)',
                      boxShadow: '0 0 8px rgba(0,201,167,0.6)',
                    }} />
                  </div>
                </div>
              </div>

              <div style={{ padding: '40px 24px 28px', textAlign: 'center' }}>
                <div style={{
                  fontSize: 20, fontWeight: 800, color: 'var(--text)',
                  marginBottom: 4, fontFamily: 'var(--font-display)',
                  letterSpacing: '-0.3px',
                }}>
                  {user?.name}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 12 }}>
                  {user?.email}
                </div>
                <Badge type={user?.role === 'admin' ? 'admin' : 'member'} style={{ fontSize: 12, padding: '4px 14px' }}>
                  {user?.role === 'admin' ? '🔑 Admin' : '👤 Member'}
                </Badge>

                <div style={{
                  height: 1,
                  background: 'linear-gradient(90deg, transparent, var(--border), transparent)',
                  margin: '20px 0',
                }} />

                {/* Mini stat grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {[
                    { label: 'Assigned', value: tasks.length, color: 'var(--text)' },
                    { label: 'Done',     value: done,          color: 'var(--success)' },
                    { label: 'Active',   value: inProg,        color: 'var(--primary)' },
                    { label: 'Overdue',  value: overdue,       color: overdue > 0 ? 'var(--danger)' : 'var(--text3)' },
                  ].map(({ label, value, color }) => (
                    <div key={label} style={{
                      background: 'var(--surface2)',
                      borderRadius: 'var(--radius)',
                      padding: '12px 10px',
                      border: '1px solid var(--border)',
                    }}>
                      <div style={{ fontSize: 22, fontWeight: 800, color, fontFamily: 'var(--font-display)', letterSpacing: '-0.5px' }}>
                        {value}
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--text3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', marginTop: 3 }}>
                        {label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Completion progress */}
                {tasks.length > 0 && (
                  <div style={{ marginTop: 16, textAlign: 'left' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text3)', marginBottom: 7 }}>
                      <span>Completion</span>
                      <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{pct}%</span>
                    </div>
                    <ProgressBar value={pct} />
                  </div>
                )}
              </div>
            </div>

            {/* Quick actions */}
            <Card style={{ padding: '18px 20px', animation: 'fadeUp 0.4s ease 0.1s both' }}>
              <div style={{
                fontSize: 12, fontWeight: 700, color: 'var(--text3)',
                textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12,
              }}>
                Quick Actions
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <Button
                  variant="ghost" size="sm"
                  onClick={() => navigate('/my-tasks')}
                  style={{ justifyContent: 'flex-start', gap: 8 }}
                >
                  ✅ View My Tasks
                </Button>
                <Button
                  variant="ghost" size="sm"
                  onClick={() => navigate('/projects')}
                  style={{ justifyContent: 'flex-start', gap: 8 }}
                >
                  📁 My Projects
                </Button>
                <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, var(--border), transparent)', margin: '4px 0' }} />
                <Button
                  variant="danger" size="sm"
                  onClick={handleLogout}
                  style={{ justifyContent: 'flex-start', gap: 8 }}
                >
                  ⏻ Sign Out
                </Button>
              </div>
            </Card>
          </div>

          {/* ── Right: Details ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Account info */}
            <Card style={{ animation: 'fadeUp 0.4s ease 0.08s both' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-display)', marginBottom: 18 }}>
                Account Details
              </div>
              {[
                { label: 'Full Name', value: user?.name },
                { label: 'Email',     value: user?.email },
                { label: 'Role',      value: null, badge: user?.role },
              ].map(row => (
                <div key={row.label} style={{
                  display: 'flex', alignItems: 'center',
                  padding: '13px 0',
                  borderBottom: '1px solid var(--border)',
                }}>
                  <div style={{
                    width: 130, fontSize: 11, fontWeight: 700, color: 'var(--text3)',
                    textTransform: 'uppercase', letterSpacing: '0.07em',
                  }}>
                    {row.label}
                  </div>
                  {row.badge
                    ? <Badge type={row.badge === 'admin' ? 'admin' : 'member'}>{row.badge}</Badge>
                    : <div style={{ fontSize: 14, color: 'var(--text)' }}>{row.value || '—'}</div>
                  }
                </div>
              ))}

              {/* User ID */}
              <div style={{ display: 'flex', alignItems: 'center', padding: '16px 0' }}>
                <div style={{
                  width: 130, fontSize: 11, fontWeight: 700, color: 'var(--text3)',
                  textTransform: 'uppercase', letterSpacing: '0.07em',
                }}>
                  User ID
                </div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <code style={{
                    fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text2)',
                    background: 'var(--surface2)', padding: '5px 12px',
                    borderRadius: 'var(--radius)',
                    border: '1px solid var(--border)',
                    wordBreak: 'break-all', flex: 1,
                  }}>
                    {userId}
                  </code>
                  <Button
                    variant={copied ? 'success' : 'ghost'}
                    size="sm"
                    onClick={handleCopyId}
                    style={{ flexShrink: 0 }}
                  >
                    {copied ? '✓ Copied' : '📋 Copy'}
                  </Button>
                </div>
              </div>

              <div style={{
                fontSize: 12, color: 'var(--text3)',
                background: 'var(--primary-light)',
                borderRadius: 'var(--radius)',
                padding: '10px 14px',
                border: '1px solid var(--primary-border)',
                lineHeight: 1.6,
              }}>
                💡 Share your User ID with project admins to be added to their projects
              </div>
            </Card>

            {/* Projects I'm in */}
            <Card style={{ animation: 'fadeUp 0.4s ease 0.12s both' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-display)', marginBottom: 16 }}>
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
                        padding: '12px 16px',
                        background: 'var(--surface2)',
                        borderRadius: 'var(--radius)',
                        border: '1px solid var(--border)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = 'var(--primary-border)';
                        e.currentTarget.style.background = 'var(--surface3)';
                        e.currentTarget.style.transform = 'translateX(3px)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = 'var(--border)';
                        e.currentTarget.style.background = 'var(--surface2)';
                        e.currentTarget.style.transform = 'translateX(0)';
                      }}
                    >
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{p.name}</div>
                      <div style={{ fontSize: 13, color: 'var(--primary)' }}>→</div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Recent task activity */}
            {tasks.length > 0 && (
              <Card style={{ animation: 'fadeUp 0.4s ease 0.16s both' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-display)', marginBottom: 16 }}>
                  Recent Task Activity
                </div>
                <div>
                  {[...tasks]
                    .sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0))
                    .slice(0, 5)
                    .map(t => (
                      <div key={t.id || t._id} style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '11px 0',
                        borderBottom: '1px solid var(--border)',
                      }}>
                        <div style={{
                          width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                          background: t.status === 'done' ? 'var(--success)'
                            : t.status === 'in-progress' ? 'var(--primary)'
                            : '#9ca3af',
                          boxShadow: `0 0 6px ${t.status === 'done' ? 'rgba(0,201,167,0.5)' : t.status === 'in-progress' ? 'rgba(255,107,53,0.5)' : 'transparent'}`,
                        }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{
                            fontSize: 13, fontWeight: 500, color: 'var(--text)',
                            textDecoration: t.status === 'done' ? 'line-through' : 'none',
                            opacity: t.status === 'done' ? 0.55 : 1,
                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                          }}>
                            {t.title}
                          </div>
                        </div>
                        <Badge type={isOverdue(t) ? 'overdue' : t.status} style={{ flexShrink: 0, fontSize: 10 }}>
                          {isOverdue(t) ? 'Overdue'
                            : t.status === 'in-progress' ? 'Active'
                            : t.status.charAt(0).toUpperCase() + t.status.slice(1)}
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
