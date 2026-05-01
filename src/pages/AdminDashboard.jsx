import React, { useEffect, useState } from 'react';
import AppLayout from '../components/AppLayout';
import Topbar from '../components/Topbar';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import UpdateStatusModal from '../components/UpdateStatusModal';
import {
  StatCard, Card, EmptyState, Spinner, Button,
  Divider, ProgressBar, SectionHeader,
} from '../components/UI';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../utils/api';
import { isOverdue, getGreeting, formatDateShort } from '../utils/helpers';

export default function AdminDashboard() {
  const { user } = useAuth();
  const { show } = useToast();
  const [data, setData] = useState({ tasks: [], projects: [], dashData: null });
  const [loading, setLoading] = useState(true);
  const [taskModal, setTaskModal] = useState(null);
  const [statusModal, setStatusModal] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const [dashRes, tasksRes, projRes] = await Promise.all([
        api.get('/dashboard').catch(() => ({})),
        api.get('/tasks/me/assigned').catch(() => ({ tasks: [] })),
        api.get('/projects').catch(() => ({ projects: [] })),
      ]);
      setData({
        dashData: dashRes,
        tasks: tasksRes.tasks || tasksRes || [],
        projects: projRes.projects || projRes || [],
      });
    } catch (e) {
      show(e, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const { tasks, projects } = data;
  const total       = tasks.length;
  const done        = tasks.filter(t => t.status === 'done').length;
  const inProg      = tasks.filter(t => t.status === 'in-progress').length;
  const overdueTasks = tasks.filter(t => isOverdue(t));
  const pct         = total ? Math.round((done / total) * 100) : 0;
  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 6);

  return (
    <AppLayout>
      <Topbar
        title={`${getGreeting()}, ${user?.name?.split(' ')[0]} 👋`}
        subtitle="Here's your team overview for today"
        actions={
          <Button variant="primary" size="sm" onClick={() => setTaskModal({ type: 'new' })}>
            + New Task
          </Button>
        }
      />

      <div style={{ padding: 28, animation: 'fadeIn 0.4s ease both' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 80 }}>
            <div style={{ textAlign: 'center' }}>
              <Spinner size={36} />
              <div style={{ marginTop: 16, fontSize: 13, color: 'var(--text3)' }}>Loading dashboard…</div>
            </div>
          </div>
        ) : (
          <>
            {/* ── Stats ── */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: 14, marginBottom: 24,
              animation: 'fadeUp 0.4s ease 0.05s both',
            }}>
              <StatCard label="Total Tasks"   value={total}               icon="📋" />
              <StatCard label="Completed"     value={done}                icon="✅" accent="var(--success)" />
              <StatCard label="In Progress"   value={inProg}              icon="⚡" accent="var(--primary)" />
              <StatCard label="Overdue"       value={overdueTasks.length} icon="⚠️" accent="var(--danger)" />
              <StatCard label="Projects"      value={projects.length}     icon="📁" accent="var(--accent-2, #845EC2)" />
            </div>

            {/* ── Overall Progress ── */}
            <Card style={{ marginBottom: 20, animation: 'fadeUp 0.4s ease 0.1s both' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-display)', marginBottom: 4 }}>
                    Overall Completion
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text3)' }}>
                    {done} of {total} tasks completed
                  </div>
                </div>
                <div style={{
                  fontSize: 32, fontWeight: 800, color: 'var(--primary)',
                  fontFamily: 'var(--font-display)', letterSpacing: '-1px',
                }}>
                  {pct}%
                </div>
              </div>

              <ProgressBar value={pct} />

              <div style={{ display: 'flex', gap: 20, marginTop: 12 }}>
                {[
                  { color: 'var(--success)', label: `${done} done` },
                  { color: 'var(--primary)', label: `${inProg} in progress` },
                  { color: '#9ca3af', label: `${total - done - inProg} to do` },
                ].map(({ color, label }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text3)' }}>
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: color, boxShadow: `0 0 6px ${color}60` }} />
                    {label}
                  </div>
                ))}
              </div>
            </Card>

            {/* ── Two columns ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 20, animation: 'fadeUp 0.4s ease 0.15s both' }}>
              {/* Recent Tasks */}
              <Card>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
                    Recent Tasks
                  </div>
                  <span style={{
                    fontSize: 10, color: 'var(--text3)', fontWeight: 600,
                    background: 'var(--surface2)', padding: '3px 8px',
                    borderRadius: 10, border: '1px solid var(--border)',
                    textTransform: 'uppercase', letterSpacing: '0.05em',
                  }}>
                    Last 6
                  </span>
                </div>
                {recentTasks.length ? (
                  recentTasks.map(t => (
                    <TaskCard
                      key={t.id || t._id} task={t} compact
                      onUpdateStatus={t => setStatusModal(t)}
                    />
                  ))
                ) : (
                  <EmptyState icon="📭" description="No tasks yet" />
                )}
              </Card>

              {/* Overdue Tasks */}
              <Card>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: 'var(--danger)',
                    boxShadow: '0 0 8px rgba(255,77,109,0.6)',
                    animation: 'pulse 2s infinite',
                  }} />
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
                    Overdue Tasks
                  </div>
                  {overdueTasks.length > 0 && (
                    <span style={{
                      marginLeft: 'auto',
                      background: 'var(--danger-light)', color: 'var(--danger)',
                      fontSize: 10, fontWeight: 700, padding: '3px 9px',
                      borderRadius: 20, border: '1px solid rgba(255,77,109,0.22)',
                    }}>
                      {overdueTasks.length}
                    </span>
                  )}
                </div>
                {overdueTasks.length ? (
                  overdueTasks.map(t => (
                    <TaskCard
                      key={t.id || t._id} task={t} compact
                      onUpdateStatus={t => setStatusModal(t)}
                    />
                  ))
                ) : (
                  <EmptyState icon="🎉" title="No overdue tasks!" description="You're all caught up" />
                )}
              </Card>
            </div>

            {/* ── Active Projects ── */}
            {projects.length > 0 && (
              <Card style={{ animation: 'fadeUp 0.4s ease 0.2s both' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-display)', marginBottom: 16 }}>
                  Active Projects
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 12 }}>
                  {projects.slice(0, 6).map(p => (
                    <div
                      key={p.id || p._id}
                      style={{
                        background: 'var(--surface2)',
                        borderRadius: 'var(--radius)',
                        border: '1px solid var(--border)',
                        padding: '14px 16px',
                        transition: 'border-color 0.15s, background 0.15s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary-border)'; e.currentTarget.style.background = 'var(--surface3)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--surface2)'; }}
                    >
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text3)' }}>{p.memberCount || 0} members</div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </>
        )}
      </div>

      {taskModal && (
        <TaskModal
          projects={projects}
          onClose={() => setTaskModal(null)}
          onSaved={load}
        />
      )}
      {statusModal && (
        <UpdateStatusModal
          task={statusModal}
          onClose={() => setStatusModal(null)}
          onSaved={load}
        />
      )}
    </AppLayout>
  );
}
