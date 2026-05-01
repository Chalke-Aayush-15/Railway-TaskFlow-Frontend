import React, { useEffect, useState } from 'react';
import AppLayout from '../components/AppLayout';
import Topbar from '../components/Topbar';
import TaskCard from '../components/TaskCard';
import UpdateStatusModal from '../components/UpdateStatusModal';
import { StatCard, Card, EmptyState, Spinner, Badge, ProgressBar, Button } from '../components/UI';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../utils/api';
import { isOverdue, getGreeting } from '../utils/helpers';

const STATUS_OPTIONS = ['todo', 'in-progress', 'done'];

export default function UserDashboard() {
  const { user } = useAuth();
  const { show } = useToast();
  const [tasks, setTasks]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [statusModal, setStatusModal] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

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

  // Filtered & prioritized list
  const filteredTasks = (() => {
    let list = tasks;
    if (activeFilter === 'overdue') list = tasks.filter(t => isOverdue(t));
    else if (activeFilter !== 'all') list = tasks.filter(t => t.status === activeFilter);

    // Prioritize: overdue first, then in-progress, then todo, then done
    return [...list].sort((a, b) => {
      const priority = t => isOverdue(t) ? 0 : t.status === 'in-progress' ? 1 : t.status === 'todo' ? 2 : 3;
      return priority(a) - priority(b);
    });
  })();

  const filters = [
    { key: 'all',         label: 'All',         count: total,           color: 'var(--text2)' },
    { key: 'in-progress', label: 'In Progress',  count: inProg,          color: 'var(--primary)' },
    { key: 'todo',        label: 'To Do',        count: total - done - inProg, color: '#9ca3af' },
    { key: 'done',        label: 'Done',         count: done,            color: 'var(--success)' },
    { key: 'overdue',     label: 'Overdue',      count: overdue.length,  color: 'var(--danger)' },
  ];

  return (
    <AppLayout>
      <Topbar
        title={`${getGreeting()}, ${user?.name?.split(' ')[0]} 👋`}
        subtitle="Your personal task workspace"
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
            {/* ── Member Info Banner ── */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(34,211,238,0.07) 0%, rgba(132,94,194,0.07) 100%)',
              border: '1px solid rgba(34,211,238,0.15)',
              borderRadius: 'var(--radius-xl)',
              padding: '16px 22px',
              marginBottom: 22,
              display: 'flex', alignItems: 'center', gap: 14,
              animation: 'fadeUp 0.4s ease both',
            }}>
              <div style={{
                width: 38, height: 38, borderRadius: '50%',
                background: 'rgba(34,211,238,0.10)',
                border: '1px solid rgba(34,211,238,0.20)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, flexShrink: 0,
              }}>
                👤
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 3 }}>
                  Member Workspace
                </div>
                <div style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.5 }}>
                  You can <strong style={{ color: 'var(--text)' }}>view and update</strong> your assigned tasks.
                  Contact your admin to create projects or get new tasks assigned.
                </div>
              </div>
            </div>

            {/* ── Stats ── */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: 14, marginBottom: 22,
              animation: 'fadeUp 0.4s ease 0.05s both',
            }}>
              <StatCard label="Assigned"    value={total}          icon="📋" />
              <StatCard label="Completed"   value={done}           icon="✅" accent="var(--success)" />
              <StatCard label="In Progress" value={inProg}         icon="⚡" accent="var(--primary)" />
              <StatCard label="Overdue"     value={overdue.length} icon="⚠️" accent="var(--danger)" />
            </div>

            {/* ── My Progress ── */}
            {total > 0 && (
              <Card style={{ marginBottom: 20, animation: 'fadeUp 0.4s ease 0.1s both' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-display)', marginBottom: 4 }}>
                      My Progress
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text3)' }}>
                      {done} of {total} tasks completed
                    </div>
                  </div>
                  <div style={{
                    fontSize: 32, fontWeight: 800, letterSpacing: '-1px',
                    fontFamily: 'var(--font-display)',
                    color: pct === 100 ? 'var(--success)' : 'var(--primary)',
                  }}>
                    {pct}%
                  </div>
                </div>
                <ProgressBar value={pct} color={pct === 100 ? 'var(--success)' : undefined} />
                {pct === 100 && (
                  <div style={{ marginTop: 12, fontSize: 13, color: 'var(--success)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                    🎉 All tasks completed — great work!
                  </div>
                )}
              </Card>
            )}

            {/* ── Overdue Alert (members prompted to update status) ── */}
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
                  background: 'var(--danger-light)', fontSize: 18,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '1px solid rgba(255,77,109,0.22)', flexShrink: 0,
                }}>⚠️</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--danger)' }}>
                    {overdue.length} overdue task{overdue.length !== 1 ? 's' : ''}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 2 }}>
                    Click <strong style={{ color: 'var(--text)' }}>"Update"</strong> on each task to change its status
                  </div>
                </div>
              </div>
            )}

            {/* ── Task List with filter tabs ── */}
            <Card style={{ animation: 'fadeUp 0.4s ease 0.18s both' }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
                  My Assigned Tasks
                </div>
                <div style={{ fontSize: 12, color: 'var(--text3)' }}>
                  Click "Update" to change task status
                </div>
              </div>

              {/* Filter tabs */}
              <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
                {filters.map(f => {
                  const isActive = activeFilter === f.key;
                  return (
                    <button
                      key={f.key}
                      onClick={() => setActiveFilter(f.key)}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        padding: '5px 12px',
                        borderRadius: 'var(--radius-pill)',
                        border: `1px solid ${isActive ? f.color : 'var(--border)'}`,
                        background: isActive ? `${f.color}18` : 'transparent',
                        color: isActive ? f.color : 'var(--text3)',
                        cursor: 'pointer',
                        fontSize: 12, fontWeight: isActive ? 700 : 500,
                        fontFamily: 'var(--font)',
                        transition: 'all 0.15s',
                        boxShadow: isActive ? `0 0 10px ${f.color}25` : 'none',
                      }}
                    >
                      {f.label}
                      <span style={{
                        background: isActive ? f.color : 'var(--surface2)',
                        color: isActive ? '#fff' : 'var(--text3)',
                        fontSize: 10, fontWeight: 700,
                        padding: '1px 6px', borderRadius: 8, minWidth: 16, textAlign: 'center',
                      }}>
                        {f.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Task items */}
              {filteredTasks.length === 0 ? (
                <EmptyState
                  icon={activeFilter === 'overdue' ? '🎉' : activeFilter === 'done' ? '⏳' : '🌟'}
                  title={
                    activeFilter === 'overdue' ? 'No overdue tasks!'
                    : activeFilter === 'done' ? 'Nothing completed yet'
                    : total === 0 ? 'No tasks assigned yet'
                    : `No ${activeFilter === 'in-progress' ? 'in-progress' : activeFilter} tasks`
                  }
                  description={
                    total === 0
                      ? 'Your admin will assign tasks to you soon'
                      : activeFilter === 'overdue'
                      ? "You're all caught up — great job!"
                      : 'Try a different filter'
                  }
                />
              ) : (
                filteredTasks.map(t => (
                  <TaskCard
                    key={t.id || t._id}
                    task={t}
                    compact
                    onUpdateStatus={t => setStatusModal(t)}
                    // No onEdit prop — members cannot edit task details
                  />
                ))
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
