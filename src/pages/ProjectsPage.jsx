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
  const { user, isAdmin } = useAuth();
  const { show } = useToast();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [createName, setCreateName] = useState('');
  const [creating, setCreating] = useState(false);
  const [createDescription, setCreateDescription] = useState('');
  const [createdBy, setCreatedBy] = useState('');

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
  console.log('User ID in ProjectsPage:', user?.id);

  const handleCreate = async () => {
    if (!createName.trim()) return show('Project name is required', 'error');
    setCreating(true);
    try {
      await api.post('/projects', { name: createName.trim(),
  description: createDescription,
  createdBy: user?.id || user?._id });
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

      <div style={{ padding: 28, animation: 'fadeIn 0.4s ease both' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 80 }}>
            <div style={{ textAlign: 'center' }}>
              <Spinner size={36} />
              <div style={{ marginTop: 16, fontSize: 13, color: 'var(--text3)' }}>Loading projects…</div>
            </div>
          </div>
        ) : projects.length === 0 ? (
          <Card>
            <EmptyState
              icon="📁"
              title="No projects yet"
              description={isAdmin ? 'Create your first project to get started' : 'No projects have been created yet'}
              action={isAdmin && (
                <Button variant="primary" onClick={() => setShowCreate(true)}>
                  Create First Project
                </Button>
              )}
            />
          </Card>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 18,
            animation: 'fadeUp 0.4s ease both',
          }}>
            {projects.map((p) => {
              const pid = p.id || p._id;
              const { color, bg } = getAvatarStyle(p.name);
              return (
                <ProjectCard
                  key={pid}
                  project={p}
                  pid={pid}
                  bg={bg}
                  isAdmin={isAdmin}
                  onNavigate={() => navigate(`/projects/${pid}`)}
                  onDelete={(e) => handleDelete(pid, e)}
                />
              );
            })}
          </div>
        )}
      </div>

      {showCreate && (
      <Modal
        title="Create New Project"
        onClose={() => {
          setShowCreate(false);
          setCreateName('');
          setCreateDescription('');
          setCreatedBy('');
        }}
      >
        <Input
          label="Project Name"
          placeholder="e.g. Website Redesign, Q4 Campaign…"
          value={createName}
          onChange={e => setCreateName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleCreate()}
          autoFocus
        />

        <Input
          label="Description"
          placeholder="Brief description of the project"
          value={createDescription}
          onChange={e => setCreateDescription(e.target.value)}
        />

        {/* <Input
          label="Created By (User ID)"
          placeholder="Enter creator user ID"
          type="number"
          value={createdBy}
          onChange={e => setCreatedBy(e.target.value)}
        /> */}
        

        <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: -10, marginBottom: 18 }}>
          Press Enter or click Create to save
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <Button
            variant="ghost"
            onClick={() => {
              setShowCreate(false);
              setCreateName('');
              setCreateDescription('');
              setCreatedBy('');
            }}
            style={{ flex: 1 }}
          >
            Cancel
          </Button>

          <Button
            variant="primary"
            onClick={handleCreate}
            loading={creating}
            style={{ flex: 1 }}
          >
            Create Project
          </Button>
        </div>
      </Modal>
    )}
    </AppLayout>
  );
}


function ProjectCard({ project: p, pid, bg, isAdmin, onNavigate, onDelete }) {
  const [hov, setHov] = useState(false);

  return (
    <div
      onClick={onNavigate}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? 'var(--surface2)' : 'var(--surface)',
        borderRadius: 'var(--radius-xl)',
        border: `1px solid ${hov ? 'var(--primary-border)' : 'var(--border)'}`,
        boxShadow: hov ? 'var(--shadow-lg), var(--shadow-glow)' : 'var(--shadow)',
        padding: 22, cursor: 'pointer',
        transition: 'all 0.22s ease',
        transform: hov ? 'translateY(-3px)' : 'translateY(0)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top accent on hover */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: 'linear-gradient(90deg, var(--primary), var(--accent-2, #845EC2))',
        opacity: hov ? 1 : 0,
        transition: 'opacity 0.22s ease',
      }} />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{
          width: 46, height: 46, borderRadius: 12,
          background: bg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 22,
          border: '1px solid rgba(255,255,255,0.06)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        }}>
          {getProjectIcon(p.name)}
        </div>
        <Badge type="info" style={{ fontSize: 10 }}>
          {p.memberCount || 0} members
        </Badge>
      </div>

      {/* Name */}
      <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 5, fontFamily: 'var(--font-display)' }}>
        {p.name}
      </div>
      <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 18 }}>
        Created {formatDate(p.createdAt)}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8 }}>
        <Button
          variant="primary" size="sm"
          style={{ flex: 1, justifyContent: 'center' }}
          onClick={e => { e.stopPropagation(); onNavigate(); }}
        >
          View Tasks →
        </Button>
        {isAdmin && (
          <Button
            variant="ghost" size="sm"
            onClick={onDelete}
            style={{ color: 'var(--danger)', borderColor: 'rgba(255,77,109,0.22)' }}
          >
            🗑
          </Button>
        )}
      </div>
    </div>
  );
}
