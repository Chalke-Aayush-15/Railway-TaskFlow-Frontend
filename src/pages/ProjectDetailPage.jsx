import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import Topbar from '../components/Topbar';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import UpdateStatusModal from '../components/UpdateStatusModal';
import { Button, Modal, Input, Avatar, Badge, EmptyState, Spinner, Divider } from '../components/UI';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../utils/api';
import { formatDate, getInitials } from '../utils/helpers';

const COLUMNS = [
  { key: 'todo',        label: 'To Do',       color: '#9ca3af' },
  { key: 'in-progress', label: 'In Progress',  color: 'var(--primary)' },
  { key: 'done',        label: 'Done',         color: 'var(--success)' },
];

export default function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { show } = useToast();

  const [project, setProject]     = useState(null);
  const [tasks, setTasks]         = useState([]);
  const [members, setMembers]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [taskModal, setTaskModal] = useState(null); // null | { task? }
  const [statusModal, setStatusModal] = useState(null);
  const [addMemberModal, setAddMemberModal] = useState(false);
  const [memberId, setMemberId]   = useState('');
  const [addingMember, setAddingMember] = useState(false);
  const [view, setView]           = useState('kanban'); // kanban | list

  const load = async () => {
    setLoading(true);
    try {
      const [projRes, tasksRes, membersRes] = await Promise.all([
        api.get(`/projects/${id}`).catch(() => null),
        api.get(`/projects/${id}/tasks`),
        api.get(`/projects/${id}/members`),
      ]);
      setProject(projRes?.project || projRes);
      setTasks(tasksRes?.tasks || tasksRes || []);
      setMembers(membersRes?.members || membersRes || []);
    } catch (e) {
      show(e, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  const handleAddMember = async () => {
    if (!memberId.trim()) return show('User ID is required', 'error');
    setAddingMember(true);
    try {
      await api.post(`/projects/${id}/members`, { userId: memberId.trim() });
      show('Member added!');
      setMemberId('');
      setAddMemberModal(false);
      load();
    } catch (e) {
      show(e, 'error');
    } finally {
      setAddingMember(false);
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!window.confirm('Remove this member from the project?')) return;
    try {
      await api.delete(`/projects/${id}/members/${userId}`);
      show('Member removed');
      load();
    } catch (e) {
      show(e, 'error');
    }
  };

  const tasksByStatus = (status) => tasks.filter(t => t.status === status);
  const total = tasks.length;
  const done  = tasks.filter(t => t.status === 'done').length;

  return (
    <AppLayout>
      <Topbar
        title={project?.name || 'Project'}
        subtitle={`${total} tasks · ${members.length} members`}
        actions={
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {/* View toggle */}
            <div style={{ display: 'flex', background: 'var(--surface2)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', overflow: 'hidden' }}>
              {[['kanban', '⬜'], ['list', '≡']].map(([v, icon]) => (
                <button key={v} onClick={() => setView(v)} style={{
                  padding: '5px 12px', border: 'none', cursor: 'pointer', fontSize: 14,
                  background: view === v ? 'var(--primary)' : 'transparent',
                  color: view === v ? '#fff' : 'var(--text3)',
                  transition: 'all 0.15s',
                }}>
                  {icon}
                </button>
              ))}
            </div>
            {isAdmin && (
              <>
                <Button variant="ghost" size="sm" onClick={() => setAddMemberModal(true)}>+ Member</Button>
                <Button variant="primary" size="sm" onClick={() => setTaskModal({})}>+ Task</Button>
              </>
            )}
          </div>
        }
      />

      <div style={{ padding: 28, animation: 'fadeIn 0.3s ease both' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 22 }}>
          <button onClick={() => navigate('/projects')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)', fontSize: 13 }}>
            Projects
          </button>
          <span style={{ color: 'var(--text3)', fontSize: 13 }}>/</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{project?.name}</span>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 80 }}><Spinner size={32} /></div>
        ) : (
          <>
            {/* Progress mini */}
            {total > 0 && (
              <div style={{ marginBottom: 22, background: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ height: 6, background: 'var(--surface2)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${Math.round(done / total * 100)}%`, background: 'linear-gradient(90deg, var(--primary), var(--accent))', borderRadius: 3, transition: 'width 0.6s' }} />
                  </div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', whiteSpace: 'nowrap' }}>
                  {done}/{total} done · {Math.round(done / total * 100)}%
                </div>
                {/* Member avatars */}
                <div style={{ display: 'flex', marginLeft: 8 }}>
                  {members.slice(0, 5).map((m, i) => (
                    <Avatar key={m.id || m._id} name={m.name} size={26}
                      style={{ marginLeft: i === 0 ? 0 : -8, border: '2px solid var(--surface)', zIndex: members.length - i }}
                    />
                  ))}
                  {members.length > 5 && (
                    <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--surface2)', border: '2px solid var(--surface)', marginLeft: -8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: 'var(--text3)', fontWeight: 700 }}>
                      +{members.length - 5}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* KANBAN */}
            {view === 'kanban' ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
                {COLUMNS.map(col => {
                  const colTasks = tasksByStatus(col.key);
                  return (
                    <div key={col.key}>
                      {/* Column header */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: col.color }} />
                        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                          {col.label}
                        </div>
                        <div style={{ marginLeft: 'auto', background: 'var(--surface2)', color: 'var(--text3)', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 10, border: '1px solid var(--border)' }}>
                          {colTasks.length}
                        </div>
                      </div>

                      {/* Tasks */}
                      <div style={{ minHeight: 120 }}>
                        {colTasks.length ? (
                          colTasks.map(t => (
                            <TaskCard
                              key={t.id || t._id} task={t}
                              onEdit={isAdmin ? t => setTaskModal({ task: t }) : undefined}
                              onUpdateStatus={t => setStatusModal(t)}
                            />
                          ))
                        ) : (
                          <div style={{
                            border: '2px dashed var(--border)', borderRadius: 'var(--radius-lg)',
                            padding: '28px 16px', textAlign: 'center', color: 'var(--text3)', fontSize: 12,
                          }}>
                            No {col.label.toLowerCase()} tasks
                          </div>
                        )}
                        {isAdmin && (
                          <button
                            onClick={() => setTaskModal({ defaultStatus: col.key })}
                            style={{
                              width: '100%', padding: '8px', border: '1px dashed var(--border)',
                              borderRadius: 'var(--radius)', background: 'transparent', cursor: 'pointer',
                              color: 'var(--text3)', fontSize: 12, marginTop: 8,
                              transition: 'all 0.15s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text3)'; }}
                          >
                            + Add task
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* LIST VIEW */
              <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', overflow: 'hidden' }}>
                {tasks.length === 0 ? (
                  <EmptyState icon="📭" title="No tasks yet" description={isAdmin ? 'Click + Task to create the first task' : 'No tasks in this project'} />
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border)' }}>
                        {['Task', 'Status', 'Due Date', isAdmin ? 'Actions' : ''].filter(Boolean).map(h => (
                          <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {tasks.map(t => (
                        <tr key={t.id || t._id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.1s' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', textDecoration: t.status === 'done' ? 'line-through' : 'none', opacity: t.status === 'done' ? 0.6 : 1 }}>{t.title}</div>
                            {t.description && <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>{t.description.slice(0, 60)}…</div>}
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <Badge type={t.status}>{t.status === 'in-progress' ? 'In Progress' : t.status.charAt(0).toUpperCase() + t.status.slice(1)}</Badge>
                          </td>
                          <td style={{ padding: '14px 16px', fontSize: 12, color: 'var(--text3)' }}>
                            {formatDate(t.dueDate)}
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ display: 'flex', gap: 6 }}>
                              <Button variant="subtle" size="sm" onClick={() => setStatusModal(t)}>Update</Button>
                              {isAdmin && <Button variant="ghost" size="sm" onClick={() => setTaskModal({ task: t })}>Edit</Button>}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {/* Members panel */}
            {members.length > 0 && (
              <div style={{ marginTop: 24, background: 'var(--surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>Team Members ({members.length})</div>
                  {isAdmin && <Button variant="ghost" size="sm" onClick={() => setAddMemberModal(true)}>+ Add</Button>}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
                  {members.map(m => (
                    <div key={m.id || m._id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'var(--surface2)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                      <Avatar name={m.name} size={32} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'capitalize' }}>{m.role}</div>
                      </div>
                      {isAdmin && (
                        <button onClick={() => handleRemoveMember(m.id || m._id)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)', fontSize: 14, padding: '2px 4px', borderRadius: 4 }}
                          title="Remove member"
                        >✕</button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Task Modal */}
      {taskModal !== null && (
        <TaskModal
          task={taskModal.task}
          projectId={id}
          members={members}
          onClose={() => setTaskModal(null)}
          onSaved={load}
        />
      )}

      {/* Status Modal */}
      {statusModal && (
        <UpdateStatusModal
          task={statusModal}
          onClose={() => setStatusModal(null)}
          onSaved={load}
        />
      )}

      {/* Add Member Modal */}
      {addMemberModal && (
        <Modal title="Add Team Member" onClose={() => { setAddMemberModal(false); setMemberId(''); }} width={400}>
          <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 16, lineHeight: 1.6 }}>
            Ask the team member to copy their <strong>User ID</strong> from their Profile page, then paste it below.
          </div>
          <Input
            label="User ID"
            placeholder="Paste user ID here..."
            value={memberId}
            onChange={e => setMemberId(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAddMember()}
            autoFocus
          />
          <div style={{ display: 'flex', gap: 10 }}>
            <Button variant="ghost" onClick={() => { setAddMemberModal(false); setMemberId(''); }} style={{ flex: 1 }}>Cancel</Button>
            <Button variant="primary" onClick={handleAddMember} loading={addingMember} style={{ flex: 1 }}>Add Member</Button>
          </div>
        </Modal>
      )}
    </AppLayout>
  );
}
