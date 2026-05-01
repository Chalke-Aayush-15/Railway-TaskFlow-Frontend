import React, { useEffect, useState } from 'react';
import AppLayout from '../components/AppLayout';
import Topbar from '../components/Topbar';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import UpdateStatusModal from '../components/UpdateStatusModal';
import { StatCard, Card, EmptyState, Spinner, Button, Divider } from '../components/UI';
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

  const { tasks, projects, dashData } = data;
  const total     = tasks.length;
  const done      = tasks.filter(t => t.status === 'done').length;
  const inProg    = tasks.filter(t => t.status === 'in-progress').length;
  const overdueTasks = tasks.filter(t => isOverdue(t));
  const pct       = total ? Math.round((done / total) * 100) : 0;
  const recentTasks = [...tasks].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)).slice(0, 6);

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

      <div style={{ padding: 28, animation: 'fadeIn 0.3s ease both' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 60 }}>
            <Spinner size={32} />
          </div>
        ) : (
          <>
            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 14, marginBottom: 26 }}>
              <StatCard label="Total Tasks"   value={total}          icon="📋" />
              <StatCard label="Completed"     value={done}           icon="✅" accent="var(--success)" />
              <StatCard label="In Progress"   value={inProg}         icon="⚡" accent="var(--primary)" />
              <StatCard label="Overdue"       value={overdueTasks.length} icon="⚠️" accent="var(--danger)" />
              <StatCard label="Projects"      value={projects.length} icon="📁" accent="var(--purple)" />
            </div>

            {/* Progress bar */}
            <Card style={{ marginBottom: 22 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>Overall Completion</div>
                  <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>{done} of {total} tasks done</div>
                </div>
                <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--primary)' }}>{pct}%</div>
              </div>
              <div style={{ height: 8, background: 'var(--surface2)', borderRadius: 4, overflow: 'hidden', border: '1px solid var(--border)' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, var(--primary), var(--accent))', borderRadius: 4, transition: 'width 0.8s ease' }} />
              </div>
              <div style={{ display: 'flex', gap: 18, marginTop: 12 }}>
                {[['#10b981', `${done} done`], ['#3B82F6', `${inProg} in progress`], ['#9ca3af', `${total - done - inProg} to do`]].map(([c, l]) => (
                  <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--text3)' }}>
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: c }} />
                    {l}
                  </div>
                ))}
              </div>
            </Card>

            {/* Two columns */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              {/* Recent */}
              <Card>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>Recent Tasks</div>
                  <span style={{ fontSize: 11, color: 'var(--text3)' }}>Last 6</span>
                </div>
                {recentTasks.length ? (
                  recentTasks.map(t => (
                    <TaskCard key={t.id || t._id} task={t} compact
                      onUpdateStatus={t => setStatusModal(t)}
                    />
                  ))
                ) : (
                  <EmptyState icon="📭" description="No tasks yet" />
                )}
              </Card>

              {/* Overdue */}
              <Card>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--danger)', animation: 'pulse 2s infinite' }} />
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>Overdue Tasks</div>
                  {overdueTasks.length > 0 && (
                    <span style={{ marginLeft: 'auto', background: 'var(--danger-light)', color: 'var(--danger)', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>
                      {overdueTasks.length}
                    </span>
                  )}
                </div>
                {overdueTasks.length ? (
                  overdueTasks.map(t => (
                    <TaskCard key={t.id || t._id} task={t} compact
                      onUpdateStatus={t => setStatusModal(t)}
                    />
                  ))
                ) : (
                  <EmptyState icon="🎉" title="No overdue tasks!" description="You're all caught up" />
                )}
              </Card>
            </div>

            {/* Projects summary */}
            {projects.length > 0 && (
              <Card style={{ marginTop: 20 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 16 }}>Active Projects</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
                  {projects.slice(0, 6).map(p => (
                    <div key={p.id || p._id} style={{
                      background: 'var(--surface2)', borderRadius: 'var(--radius)', border: '1px solid var(--border)',
                      padding: '14px 16px',
                    }}>
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
