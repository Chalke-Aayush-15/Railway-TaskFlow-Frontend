import React, { useEffect, useState } from 'react';
import AppLayout from '../components/AppLayout';
import Topbar from '../components/Topbar';
import TaskCard from '../components/TaskCard';
import UpdateStatusModal from '../components/UpdateStatusModal';
import { Card, EmptyState, Spinner, Badge, Button } from '../components/UI';
import { useToast } from '../context/ToastContext';
import api from '../utils/api';
import { isOverdue } from '../utils/helpers';

const FILTERS = ['all', 'todo', 'in-progress', 'done', 'overdue'];

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
    all:          tasks.length,
    todo:         tasks.filter(t => t.status === 'todo').length,
    'in-progress': tasks.filter(t => t.status === 'in-progress').length,
    done:         tasks.filter(t => t.status === 'done').length,
    overdue:      tasks.filter(t => isOverdue(t)).length,
  };

  const FILTER_LABELS = {
    all: 'All', todo: 'To Do', 'in-progress': 'In Progress', done: 'Done', overdue: 'Overdue',
  };
  const FILTER_COLORS = {
    all: 'var(--text2)', todo: '#9ca3af', 'in-progress': 'var(--primary)',
    done: 'var(--success)', overdue: 'var(--danger)',
  };

  return (
    <AppLayout>
      <Topbar
        title="My Tasks"
        subtitle={`${tasks.length} total assigned`}
      />

      <div style={{ padding: 28, animation: 'fadeIn 0.3s ease both' }}>
        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 22, flexWrap: 'wrap' }}>
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px',
                borderRadius: 'var(--radius)', border: '1px solid',
                borderColor: filter === f ? FILTER_COLORS[f] : 'var(--border)',
                background: filter === f ? (f === 'all' ? 'var(--primary-light)' : f === 'overdue' ? 'var(--danger-light)' : f === 'done' ? 'var(--success-light)' : f === 'in-progress' ? 'var(--primary-light)' : 'var(--surface2)') : 'var(--surface)',
                color: filter === f ? FILTER_COLORS[f] : 'var(--text2)',
                cursor: 'pointer', fontSize: 13, fontWeight: filter === f ? 700 : 500,
                transition: 'all 0.15s',
              }}
            >
              {FILTER_LABELS[f]}
              <span style={{
                background: filter === f ? FILTER_COLORS[f] : 'var(--surface2)',
                color: filter === f ? '#fff' : 'var(--text3)',
                fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 10,
                minWidth: 18, textAlign: 'center',
              }}>
                {counts[f]}
              </span>
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 80 }}><Spinner size={32} /></div>
        ) : filtered.length === 0 ? (
          <Card>
            <EmptyState
              icon={filter === 'overdue' ? '🎉' : filter === 'done' ? '⏳' : '📭'}
              title={filter === 'overdue' ? 'No overdue tasks!' : filter === 'done' ? 'Nothing completed yet' : 'No tasks here'}
              description={filter === 'all' ? 'Your admin will assign tasks to you soon' : `No ${FILTER_LABELS[filter].toLowerCase()} tasks`}
            />
          </Card>
        ) : (
          <div>
            {/* Group by status when viewing all */}
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
    <div style={{ marginBottom: 20 }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: 8, width: '100%',
          background: 'none', border: 'none', cursor: 'pointer', padding: '0 0 12px',
        }}
      >
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{title}</span>
        <span style={{ background: 'var(--surface2)', color: 'var(--text3)', fontSize: 11, fontWeight: 700, padding: '1px 7px', borderRadius: 10, border: '1px solid var(--border)' }}>{count}</span>
        <span style={{ marginLeft: 'auto', color: 'var(--text3)', fontSize: 12 }}>{open ? '▾' : '▸'}</span>
      </button>
      {open && (
        <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', padding: '4px 8px' }}>
          {children}
        </div>
      )}
    </div>
  );
}
