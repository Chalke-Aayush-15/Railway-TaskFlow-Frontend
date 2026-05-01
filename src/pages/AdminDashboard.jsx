import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import Topbar from '../components/Topbar';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import UpdateStatusModal from '../components/UpdateStatusModal';
import { Modal, Input } from '../components/UI';
import {
  StatCard, Card, EmptyState, Spinner, Button, Badge, ProgressBar, Avatar,
} from '../components/UI';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../utils/api';
import { isOverdue, getGreeting, formatDate } from '../utils/helpers';

export default function AdminDashboard() {
  const { user } = useAuth();
  const { show } = useToast();
  const navigate = useNavigate();

  const [tasks, setTasks]       = useState([]);
  const [projects, setProjects] = useState([]);
  const [allMembers, setAllMembers] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [taskModal, setTaskModal]   = useState(null);
  const [statusModal, setStatusModal] = useState(null);
  const [createProjectModal, setCreateProjectModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [creatingProject, setCreatingProject] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [tasksRes, projRes] = await Promise.all([
        api.get('/tasks/me/assigned').catch(() => ({ tasks: [] })),
        api.get('/projects').catch(() => ({ projects: [] })),
      ]);
      const projs = projRes.projects || projRes || [];
      const taskList = tasksRes.tasks || tasksRes || [];
      setTasks(taskList);
      setProjects(projs);

      // Load members from all projects (deduplicated)
      const membersMap = {};
      await Promise.all(projs.map(async p => {
        try {
          const mRes = await api.get(`/projects/${p.id || p._id}/members`);
          (mRes.members || mRes || []).forEach(m => {
            membersMap[m.id || m._id] = m;
          });
        } catch {}
      }));
      setAllMembers(Object.values(membersMap));
    } catch (e) {
      show(e, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return show('Project name is required', 'error');
    setCreatingProject(true);
    try {
      await api.post('/projects', { name: newProjectName.trim() });
      show('Project created!');
      setNewProjectName('');
      setCreateProjectModal(false);
      load();
    } catch (e) {
      show(e, 'error');
    } finally {
      setCreatingProject(false);
    }
  };

  const total        = tasks.length;
  const done         = tasks.filter(t => t.status === 'done').length;
  const inProg       = tasks.filter(t => t.status === 'in-progress').length;
  const overdueTasks = tasks.filter(t => isOverdue(t));
  const pct          = total ? Math.round((done / total) * 100) : 0;

  return (
    <AppLayout>
      <Topbar
        title={`${getGreeting()}, ${user?.name?.split(' ')[0]} 👋`}
        subtitle="Admin command centre · manage your team"
        actions={
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="ghost" size="sm" onClick={() => setCreateProjectModal(true)}>
              📁 New Project
            </Button>
            <Button variant="primary" size="sm" onClick={() => setTaskModal({})}>
              + Assign Task
            </Button>
          </div>
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
            {/* ── Admin Quick Actions Banner ── */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(255,107,53,0.10) 0%, rgba(132,94,194,0.08) 100%)',
              border: '1px solid var(--primary-border)',
              borderRadius: 'var(--radius-xl)',
              padding: '20px 24px',
              marginBottom: 22,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              gap: 16,
              animation: 'fadeUp 0.4s ease both',
            }}>
              <div>
                <div style={{
                  fontSize: 11, fontWeight: 700, color: 'var(--primary)',
                  textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 5,
                }}>
                  🔑 Admin Control Panel
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 3 }}>
                  {projects.length} project{projects.length !== 1 ? 's' : ''} · {allMembers.length} team member{allMembers.length !== 1 ? 's' : ''}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text3)' }}>
                  You can create projects, assign tasks, and manage your team
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
                <ActionButton icon="📁" label="New Project" onClick={() => setCreateProjectModal(true)} />
                <ActionButton icon="✅" label="Assign Task" primary onClick={() => setTaskModal({})} />
                <ActionButton icon="👥" label="View Team" onClick={() => navigate('/team')} />
              </div>
            </div>

            {/* ── Stats ── */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: 14, marginBottom: 22,
              animation: 'fadeUp 0.4s ease 0.05s both',
            }}>
              <StatCard label="Total Tasks"   value={total}               icon="📋" />
              <StatCard label="Completed"     value={done}                icon="✅" accent="var(--success)" />
              <StatCard label="In Progress"   value={inProg}              icon="⚡" accent="var(--primary)" />
              <StatCard label="Overdue"       value={overdueTasks.length} icon="⚠️" accent="var(--danger)" />
              <StatCard label="Projects"      value={projects.length}     icon="📁" accent="var(--accent-2)" />
              <StatCard label="Team Members"  value={allMembers.length}   icon="👥" accent="var(--success)" />
            </div>

            {/* ── Progress bar ── */}
            {total > 0 && (
              <Card style={{ marginBottom: 20, animation: 'fadeUp 0.4s ease 0.1s both' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-display)', marginBottom: 4 }}>
                      Team Task Completion
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text3)' }}>
                      {done} of {total} tasks across all projects
                    </div>
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-display)', letterSpacing: '-1px' }}>
                    {pct}%
                  </div>
                </div>
                <ProgressBar value={pct} />
                <div style={{ display: 'flex', gap: 20, marginTop: 12 }}>
                  {[
                    { color: 'var(--success)', label: `${done} done` },
                    { color: 'var(--primary)', label: `${inProg} in progress` },
                    { color: '#9ca3af',        label: `${total - done - inProg} to do` },
                    { color: 'var(--danger)',  label: `${overdueTasks.length} overdue` },
                  ].map(({ color, label }) => (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text3)' }}>
                      <div style={{ width: 7, height: 7, borderRadius: '50%', background: color, boxShadow: `0 0 6px ${color}60` }} />
                      {label}
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* ── Two-column: Overdue + Projects ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 20, animation: 'fadeUp 0.4s ease 0.15s both' }}>

              {/* Overdue — admin can act */}
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
                  overdueTasks.slice(0, 5).map(t => (
                    <TaskCard
                      key={t.id || t._id} task={t} compact
                      onUpdateStatus={t => setStatusModal(t)}
                    />
                  ))
                ) : (
                  <EmptyState icon="🎉" title="No overdue tasks!" description="Your team is on track" />
                )}
              </Card>

              {/* Active Projects — admin can navigate to manage */}
              <Card>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
                    Active Projects
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => navigate('/projects')}>
                    View All →
                  </Button>
                </div>
                {projects.length === 0 ? (
                  <EmptyState
                    icon="📁"
                    title="No projects yet"
                    action={
                      <Button variant="primary" size="sm" onClick={() => setCreateProjectModal(true)}>
                        Create First Project
                      </Button>
                    }
                  />
                ) : (
                  projects.slice(0, 4).map(p => (
                    <div
                      key={p.id || p._id}
                      onClick={() => navigate(`/projects/${p.id || p._id}`)}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '10px 14px', marginBottom: 8,
                        background: 'var(--surface2)',
                        borderRadius: 'var(--radius)',
                        border: '1px solid var(--border)',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary-border)'; e.currentTarget.style.background = 'var(--surface3)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--surface2)'; }}
                    >
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{p.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 1 }}>{p.memberCount || 0} members</div>
                      </div>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <Button
                          variant="primary" size="sm"
                          onClick={e => { e.stopPropagation(); setTaskModal({ projectId: p.id || p._id }); }}
                        >
                          + Task
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </Card>
            </div>

            {/* ── Team Members at a glance ── */}
            {allMembers.length > 0 && (
              <Card style={{ animation: 'fadeUp 0.4s ease 0.2s both' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
                    Team Members
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => navigate('/team')}>
                    Full Team View →
                  </Button>
                </div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {allMembers.slice(0, 8).map(m => (
                    <div
                      key={m.id || m._id}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '8px 12px',
                        background: 'var(--surface2)',
                        borderRadius: 'var(--radius)',
                        border: '1px solid var(--border)',
                        transition: 'border-color 0.15s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border2)'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                    >
                      <Avatar name={m.name} size={26} />
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', lineHeight: 1.2 }}>{m.name}</div>
                        <div style={{ fontSize: 10, color: 'var(--text3)', textTransform: 'capitalize' }}>{m.role}</div>
                      </div>
                    </div>
                  ))}
                  {allMembers.length > 8 && (
                    <div style={{
                      display: 'flex', alignItems: 'center', padding: '8px 14px',
                      background: 'var(--surface2)', borderRadius: 'var(--radius)',
                      border: '1px solid var(--border)', fontSize: 12, color: 'var(--text3)',
                    }}>
                      +{allMembers.length - 8} more
                    </div>
                  )}
                </div>
              </Card>
            )}
          </>
        )}
      </div>

      {/* ── Create Project Modal ── */}
      {createProjectModal && (
        <Modal title="Create New Project" onClose={() => { setCreateProjectModal(false); setNewProjectName(''); }} width={400}>
          <Input
            label="Project Name"
            placeholder="e.g. Website Redesign, Q4 Campaign…"
            value={newProjectName}
            onChange={e => setNewProjectName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleCreateProject()}
            autoFocus
          />
          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <Button variant="ghost" onClick={() => { setCreateProjectModal(false); setNewProjectName(''); }} style={{ flex: 1 }}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreateProject} loading={creatingProject} style={{ flex: 1 }}>
              Create Project
            </Button>
          </div>
        </Modal>
      )}

      {/* ── Assign Task Modal ── */}
      {taskModal !== null && (
        <TaskModal
          projectId={taskModal.projectId}
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

/* ── Small action button helper ── */
function ActionButton({ icon, label, onClick, primary }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
        padding: '10px 16px',
        background: primary
          ? (hov ? 'var(--primary-dark)' : 'var(--primary)')
          : (hov ? 'var(--surface3)' : 'var(--surface2)'),
        border: `1px solid ${primary ? 'transparent' : (hov ? 'var(--border2)' : 'var(--border)')}`,
        borderRadius: 'var(--radius)',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        transform: hov ? 'translateY(-1px)' : 'none',
        boxShadow: primary && hov ? '0 4px 14px rgba(255,107,53,0.35)' : 'none',
      }}
    >
      <span style={{ fontSize: 18 }}>{icon}</span>
      <span style={{
        fontSize: 11, fontWeight: 600, fontFamily: 'var(--font)',
        color: primary ? '#fff' : 'var(--text2)',
        whiteSpace: 'nowrap',
      }}>
        {label}
      </span>
    </button>
  );
}
