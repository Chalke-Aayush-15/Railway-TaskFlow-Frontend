import React, { useEffect, useState } from 'react';
import AppLayout from '../components/AppLayout';
import Topbar from '../components/Topbar';
import TaskCard from '../components/TaskCard';
import UpdateStatusModal from '../components/UpdateStatusModal';
import { Card, EmptyState, Spinner, Badge } from '../components/UI';
import { useToast } from '../context/ToastContext';
import api from '../utils/api';
import { isOverdue } from '../utils/helpers';

const FILTERS = ['all', 'todo', 'in-progress', 'done', 'overdue'];

const FILTER_LABELS = {
  all: 'All', todo: 'To Do', 'in-progress': 'In Progress', done: 'Done', overdue: 'Overdue',
};

const FILTER_META = {
  all:          { color: 'var(--text2)',   bg: 'var(--surface2)',  activeBg: 'var(--surface3)' },
  todo:         { color: '#9ca3af',        bg: 'rgba(107,114,128,0.08)', activeBg: 'rgba(107,114,128,0.16)' },
  'in-progress':{ color: 'var(--primary)', bg: 'var(--primary-light)', activeBg: 'rgba(255,107,53,0.16)' },
  done:         { color: 'var(--success)', bg: 'var(--success-light)', activeBg: 'rgba(0,201,167,0.16)' },
  overdue:      { color: 'var(--danger)',  bg: 'var(--danger-light)', activeBg: 'rgba(255,77,109,0.16)' },
};

export default function MyTasksPage() {
  const { show } = useToast();
  const [tasks, setTasks]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState('all');
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

  const filtered = tasks.filter(t => {
    if (filter === 'all')     return true;
    if (filter === 'overdue') return isOverdue(t);
    return t.status === filter;
  });

  const counts = {
    all:           tasks.length,
    todo:          tasks.filter(t => t.status === 'todo').length,
    'in-progress': tasks.filter(t => t.status === 'in-progress').length,
    done:          tasks.filter(t => t.status === 'done').length,
    overdue:       tasks.filter(t => isOverdue(t)).length,
  };

  return (
    <AppLayout>
      <Topbar
        title="My Tasks"
        subtitle={`${tasks.length} total assigned`}
      />

      <div style={{ padding: 28, animation: 'fadeIn 0.4s ease both' }}>
        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 24, flexWrap: 'wrap', animation: 'fadeUp 0.4s ease 0.05s both' }}>
          {FILTERS.map(f => {
            const meta = FILTER_META[f];
            const isActive = filter === f;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  padding: '7px 15px',
                  borderRadius: 'var(--radius-pill)',
                  border: `1px solid ${isActive ? meta.color : 'var(--border)'}`,
                  background: isActive ? meta.bg : 'var(--surface)',
                  color: isActive ? meta.color : 'var(--text2)',
                  cursor: 'pointer',
                  fontSize: 13, fontWeight: isActive ? 700 : 500,
                  fontFamily: 'var(--font)',
                  transition: 'all 0.15s ease',
                  boxShadow: isActive ? `0 0 12px ${meta.color}30` : 'none',
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = meta.color;
                    e.currentTarget.style.color = meta.color;
                    e.currentTarget.style.background = meta.bg;
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.color = 'var(--text2)';
                    e.currentTarget.style.background = 'var(--surface)';
                  }
                }}
              >
                {FILTER_LABELS[f]}
                <span style={{
                  background: isActive ? meta.color : 'var(--surface2)',
                  color: isActive ? '#fff' : 'var(--text3)',
                  fontSize: 10, fontWeight: 700,
                  padding: '1px 7px', borderRadius: 10,
                  minWidth: 18, textAlign: 'center',
                  transition: 'all 0.15s',
                }}>
                  {counts[f]}
                </span>
              </button>
            );
          })}
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 80 }}>
            <div style={{ textAlign: 'center' }}>
              <Spinner size={36} />
              <div style={{ marginTop: 16, fontSize: 13, color: 'var(--text3)' }}>Loading tasks…</div>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <Card>
            <EmptyState
              icon={filter === 'overdue' ? '🎉' : filter === 'done' ? '⏳' : '📭'}
              title={
                filter === 'overdue' ? 'No overdue tasks!'
                : filter === 'done' ? 'Nothing completed yet'
                : 'No tasks here'
              }
              description={
                filter === 'all' ? 'Your admin will assign tasks to you soon'
                : `No ${FILTER_LABELS[filter].toLowerCase()} tasks`
              }
            />
          </Card>
        ) : (
          <div>
            {filter === 'all' ? (
              <>
                {counts.overdue > 0 && (
                  <Section title="Overdue" count={counts.overdue} color="var(--danger)">
                    {tasks.filter(t => isOverdue(t)).map(t => (
                      <TaskCard key={t.id || t._id} task={t} compact onUpdateStatus={t => setStatusModal(t)} />
                    ))}
                  </Section>
                )}
                {counts['in-progress'] > 0 && (
                  <Section title="In Progress" count={counts['in-progress']} color="var(--primary)">
                    {tasks.filter(t => t.status === 'in-progress' && !isOverdue(t)).map(t => (
                      <TaskCard key={t.id || t._id} task={t} compact onUpdateStatus={t => setStatusModal(t)} />
                    ))}
                  </Section>
                )}
                {counts.todo > 0 && (
                  <Section title="To Do" count={counts.todo} color="#9ca3af">
                    {tasks.filter(t => t.status === 'todo' && !isOverdue(t)).map(t => (
                      <TaskCard key={t.id || t._id} task={t} compact onUpdateStatus={t => setStatusModal(t)} />
                    ))}
                  </Section>
                )}
                {counts.done > 0 && (
                  <Section title="Done" count={counts.done} color="var(--success)">
                    {tasks.filter(t => t.status === 'done').map(t => (
                      <TaskCard key={t.id || t._id} task={t} compact onUpdateStatus={t => setStatusModal(t)} />
                    ))}
                  </Section>
                )}
              </>
            ) : (
              <Card>
                {filtered.map(t => (
                  <TaskCard key={t.id || t._id} task={t} compact onUpdateStatus={t => setStatusModal(t)} />
                ))}
              </Card>
            )}
          </div>
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

function Section({ title, count, color, children }) {
  const [open, setOpen] = useState(true);
  return (
    <div style={{ marginBottom: 20, animation: 'fadeUp 0.3s ease both' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: 8, width: '100%',
          background: 'none', border: 'none', cursor: 'pointer', padding: '0 0 12px',
          fontFamily: 'var(--font)',
        }}
      >
        <div style={{
          width: 7, height: 7, borderRadius: '50%', background: color,
          boxShadow: `0 0 8px ${color}80`,
        }} />
        <span style={{
          fontSize: 11, fontWeight: 700, color: 'var(--text2)',
          textTransform: 'uppercase', letterSpacing: '0.08em',
        }}>
          {title}
        </span>
        <span style={{
          background: 'var(--surface2)', color: 'var(--text3)',
          fontSize: 10, fontWeight: 700, padding: '1px 7px',
          borderRadius: 10, border: '1px solid var(--border)',
        }}>
          {count}
        </span>
        <span style={{
          marginLeft: 'auto', color: 'var(--text3)', fontSize: 13,
          transition: 'transform 0.2s',
          transform: open ? 'rotate(0deg)' : 'rotate(-90deg)',
        }}>
          ▾
        </span>
      </button>
      {open && (
        <div style={{
          background: 'var(--surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)',
          padding: '4px 8px',
          animation: 'fadeUp 0.2s ease both',
        }}>
          {children}
        </div>
      )}
    </div>
  );
}
