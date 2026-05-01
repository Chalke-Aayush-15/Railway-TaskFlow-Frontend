import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import Topbar from '../components/Topbar';
import { Card, Button, Modal, Input, EmptyState, Spinner, Badge, Avatar } from '../components/UI';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../utils/api';
import { formatDate, getAvatarStyle } from '../utils/helpers';

const PROJECT_ICONS = ['📋', '🎯', '🚀', '💡', '⚡', '🔥', '🛠', '🌐'];

function getProjectIcon(name = '') {
  return PROJECT_ICONS[name.charCodeAt(0) % PROJECT_ICONS.length];
}

export default function ProjectsPage() {
  const { isAdmin } = useAuth();
  const { show } = useToast();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [createName, setCreateName] = useState('');
  const [creating, setCreating] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get('/projects');
      setProjects(res.projects || res || []);
    } catch (e) {
      show(e, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    if (!createName.trim()) return show('Project name is required', 'error');
    setCreating(true);
    try {
      await api.post('/projects', { name: createName.trim() });
      show('Project created!');
      setCreateName('');
      setShowCreate(false);
      load();
    } catch (e) {
      show(e, 'error');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this project? All tasks will be removed.')) return;
    try {
      await api.delete(`/projects/${id}`);
      show('Project deleted');
      load();
    } catch (e) {
      show(e, 'error');
    }
  };

  return (
    <AppLayout>
      <Topbar
        title="Projects"
        subtitle={`${projects.length} project${projects.length !== 1 ? 's' : ''}`}
        actions={
          isAdmin && (
            <Button variant="primary" size="sm" onClick={() => setShowCreate(true)}>
              + New Project
            </Button>
          )
        }
      />

      <div style={{ padding: 28, animation: 'fadeIn 0.3s ease both' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 80 }}>
            <Spinner size={32} />
          </div>
        ) : projects.length === 0 ? (
          <Card>
            <EmptyState
              icon="📁"
              title="No projects yet"
              description={isAdmin ? 'Create your first project to get started' : 'No projects have been created yet'}
              action={isAdmin && <Button variant="primary" onClick={() => setShowCreate(true)}>Create First Project</Button>}
            />
          </Card>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 18 }}>
            {projects.map((p) => {
              const pid = p.id || p._id;
              const { color, bg } = getAvatarStyle(p.name);
              return (
                <div
                  key={pid}
                  onClick={() => navigate(`/projects/${pid}`)}
                  style={{
                    background: 'var(--surface)', borderRadius: 'var(--radius-xl)',
                    border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)',
                    padding: 22, cursor: 'pointer', transition: 'all 0.18s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = 'var(--border2)'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
                >
                  {/* Header */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 12,
                      background: bg, display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontSize: 22,
                    }}>
                      {getProjectIcon(p.name)}
                    </div>
                    <Badge type="info" style={{ fontSize: 10 }}>
                      {p.memberCount || 0} members
                    </Badge>
                  </div>

                  {/* Name */}
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 5 }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 18 }}>
                    Created {formatDate(p.createdAt)}
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Button
                      variant="primary" size="sm"
                      style={{ flex: 1, justifyContent: 'center' }}
                      onClick={e => { e.stopPropagation(); navigate(`/projects/${pid}`); }}
                    >
                      View Tasks →
                    </Button>
                    {isAdmin && (
                      <Button
                        variant="ghost" size="sm"
                        onClick={e => handleDelete(pid, e)}
                        style={{ color: 'var(--danger)', borderColor: 'var(--danger-light)' }}
                      >
                        🗑
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showCreate && (
        <Modal title="Create New Project" onClose={() => { setShowCreate(false); setCreateName(''); }}>
          <Input
            label="Project Name"
            placeholder="e.g. Website Redesign, Q4 Campaign..."
            value={createName}
            onChange={e => setCreateName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleCreate()}
            autoFocus
          />
          <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: -10, marginBottom: 16 }}>
            Press Enter or click Create to save
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Button variant="ghost" onClick={() => { setShowCreate(false); setCreateName(''); }} style={{ flex: 1 }}>Cancel</Button>
            <Button variant="primary" onClick={handleCreate} loading={creating} style={{ flex: 1 }}>Create Project</Button>
          </div>
        </Modal>
      )}
    </AppLayout>
  );
}
