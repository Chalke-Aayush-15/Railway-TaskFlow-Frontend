import React, { useEffect, useState } from 'react';
import AppLayout from '../components/AppLayout';
import Topbar from '../components/Topbar';
import TaskCard from '../components/TaskCard';
import UpdateStatusModal from '../components/UpdateStatusModal';
import { StatCard, Card, EmptyState, Spinner, Badge, ProgressBar } from '../components/UI';
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

  const total   = tasks.length;
  const done    = tasks.filter(t => t.status === 'done').length;
  const inProg  = tasks.filter(t => t.status === 'in-progress').length;
  const overdue = tasks.filter(t => isOverdue(t));
  const pct     = total ? Math.round((done / total) * 100) : 0;

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

      <div style={{ padding: 28, animation: 'fadeIn 0.4s ease both' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 80 }}>
            <div style={{ textAlign: 'center' }}>
              <Spinner size={36} />
              <div style={{ marginTop: 16, fontSize: 13, color: 'var(--text3)' }}>Loading your tasks…</div>
            </div>
          </div>
        ) : (
          <>
            {/* ── Stats ── */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: 14, marginBottom: 24,
              animation: 'fadeUp 0.4s ease 0.05s both',
            }}>
              <StatCard label="Assigned"    value={total}           icon="📋" />
              <StatCard label="Completed"   value={done}            icon="✅" accent="var(--success)" />
              <StatCard label="In Progress" value={inProg}          icon="⚡" accent="var(--primary)" />
              <StatCard label="Overdue"     value={overdue.length}  icon="⚠️" accent="var(--danger)" />
            </div>

            {/* ── Progress ── */}
            {total > 0 && (
              <Card style={{ marginBottom: 20, animation: 'fadeUp 0.4s ease 0.1s both' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-display)', marginBottom: 4 }}>
                      Your Progress
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text3)' }}>{done} of {total} tasks done</div>
                  </div>
                  <div style={{
                    fontSize: 32, fontWeight: 800, letterSpacing: '-1px',
                    fontFamily: 'var(--font-display)',
                    color: pct === 100 ? 'var(--success)' : 'var(--primary)',
                  }}>
                    {pct}%
                  </div>
                </div>
                <ProgressBar
                  value={pct}
                  color={pct === 100 ? 'var(--success)' : undefined}
                />
                {pct === 100 && (
                  <div style={{
                    marginTop: 12, fontSize: 13, color: 'var(--success)', fontWeight: 600,
                    display: 'flex', alignItems: 'center', gap: 6,
                    animation: 'fadeUp 0.4s ease both',
                  }}>
                    🎉 All tasks completed — great work!
                  </div>
                )}
              </Card>
            )}

            {/* ── Overdue Alert ── */}
            {overdue.length > 0 && (
              <div style={{
                background: 'linear-gradient(135deg, rgba(255,77,109,0.10) 0%, rgba(255,77,109,0.05) 100%)',
                border: '1px solid rgba(255,77,109,0.25)',
                borderRadius: 'var(--radius-lg)', padding: '16px 20px', marginBottom: 20,
                display: 'flex', alignItems: 'center', gap: 14,
                animation: 'fadeUp 0.4s ease 0.12s both',
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: 'var(--danger-light)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18, flexShrink: 0,
                  border: '1px solid rgba(255,77,109,0.22)',
                }}>
                  ⚠️
                </div>
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

            {/* ── Task List ── */}
            <Card style={{ animation: 'fadeUp 0.4s ease 0.18s both' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
                  My Tasks
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {[['todo', total - done - inProg], ['in-progress', inProg], ['done', done]].map(([s, n]) => (
                    n > 0 && (
                      <Badge key={s} type={s}>
                        {n} {s === 'in-progress' ? 'active' : s}
                      </Badge>
                    )
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
                <EmptyState
                  icon="🌟"
                  title="No tasks assigned"
                  description="Your admin will assign tasks to you soon"
                />
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
