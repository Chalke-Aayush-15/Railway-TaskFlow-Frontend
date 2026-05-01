import React, { useEffect, useState } from 'react';
import AppLayout from '../components/AppLayout';
import Topbar from '../components/Topbar';
import TaskCard from '../components/TaskCard';
import UpdateStatusModal from '../components/UpdateStatusModal';
import { StatCard, Card, EmptyState, Spinner, Badge } from '../components/UI';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../utils/api';
import { isOverdue, getGreeting } from '../utils/helpers';

export default function UserDashboard() {
  const { user } = useAuth();
  const { show } = useToast();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusModal, setStatusModal] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get('/tasks/me/assigned');
      setTasks(res.tasks || res || []);
    } catch (e) {
      show(e, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const total    = tasks.length;
  const done     = tasks.filter(t => t.status === 'done').length;
  const inProg   = tasks.filter(t => t.status === 'in-progress').length;
  const overdue  = tasks.filter(t => isOverdue(t));
  const pct      = total ? Math.round((done / total) * 100) : 0;

  const prioritized = [
    ...tasks.filter(t => isOverdue(t)),
    ...tasks.filter(t => !isOverdue(t) && t.status !== 'done'),
    ...tasks.filter(t => t.status === 'done'),
  ];

  return (
    <AppLayout>
      <Topbar
        title={`${getGreeting()}, ${user?.name?.split(' ')[0]} 👋`}
        subtitle="Here are your assigned tasks"
      />

      <div style={{ padding: 28, animation: 'fadeIn 0.3s ease both' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 60 }}><Spinner size={32} /></div>
        ) : (
          <>
            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 14, marginBottom: 26 }}>
              <StatCard label="Assigned"    value={total}           icon="📋" />
              <StatCard label="Completed"   value={done}            icon="✅" accent="var(--success)" />
              <StatCard label="In Progress" value={inProg}          icon="⚡" accent="var(--primary)" />
              <StatCard label="Overdue"     value={overdue.length}  icon="⚠️" accent="var(--danger)" />
            </div>

            {/* Progress */}
            {total > 0 && (
              <Card style={{ marginBottom: 22 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>Your Progress</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: pct === 100 ? 'var(--success)' : 'var(--primary)' }}>
                    {pct}%
                  </div>
                </div>
                <div style={{ height: 8, background: 'var(--surface2)', borderRadius: 4, overflow: 'hidden', border: '1px solid var(--border)' }}>
                  <div style={{
                    height: '100%', width: `${pct}%`, borderRadius: 4, transition: 'width 0.8s ease',
                    background: pct === 100 ? 'var(--success)' : 'linear-gradient(90deg, var(--primary), var(--accent))',
                  }} />
                </div>
                {pct === 100 && <div style={{ marginTop: 10, fontSize: 13, color: 'var(--success)', fontWeight: 600 }}>🎉 All tasks completed!</div>}
              </Card>
            )}

            {/* Overdue alert */}
            {overdue.length > 0 && (
              <div style={{
                background: 'var(--danger-light)', border: '1px solid var(--danger)',
                borderRadius: 'var(--radius-lg)', padding: '14px 18px', marginBottom: 20,
                display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <div style={{ fontSize: 20 }}>⚠️</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--danger)' }}>
                    You have {overdue.length} overdue task{overdue.length !== 1 ? 's' : ''}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 2 }}>
                    Please update the status or reach out to your admin
                  </div>
                </div>
              </div>
            )}

            {/* Task list */}
            <Card>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>My Tasks</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {[['todo', total - done - inProg], ['in-progress', inProg], ['done', done]].map(([s, n]) => (
                    n > 0 && <Badge key={s} type={s}>{n} {s === 'in-progress' ? 'active' : s}</Badge>
                  ))}
                </div>
              </div>

              {prioritized.length ? (
                prioritized.map(t => (
                  <TaskCard
                    key={t.id || t._id} task={t} compact
                    onUpdateStatus={t => setStatusModal(t)}
                  />
                ))
              ) : (
                <EmptyState icon="🌟" title="No tasks assigned" description="Your admin will assign tasks to you soon" />
              )}
            </Card>
          </>
        )}
      </div>

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
