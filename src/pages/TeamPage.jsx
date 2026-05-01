import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import Topbar from '../components/Topbar';
import { Card, Avatar, Badge, EmptyState, Spinner, StatCard } from '../components/UI';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../utils/api';
import { formatDate } from '../utils/helpers';

export default function TeamPage() {
  const { isAdmin } = useAuth();
  const { show } = useToast();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [projectMembers, setProjectMembers] = useState({}); // { projectId: members[] }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) { navigate('/dashboard'); return; }
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const projRes = await api.get('/projects');
      const projs = projRes.projects || projRes || [];
      setProjects(projs);

      // load members for each project
      const membersMap = {};
      await Promise.all(
        projs.map(async p => {
          const pid = p.id || p._id;
          try {
            const mRes = await api.get(`/projects/${pid}/members`);
            membersMap[pid] = mRes.members || mRes || [];
          } catch { membersMap[pid] = []; }
        })
      );
      setProjectMembers(membersMap);
    } catch (e) {
      show(e, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Deduplicate members across all projects
  const allMembersMap = {};
  Object.values(projectMembers).flat().forEach(m => {
    const id = m.id || m._id;
    if (!allMembersMap[id]) allMembersMap[id] = { ...m, projectCount: 0 };
    allMembersMap[id].projectCount++;
  });
  const allMembers = Object.values(allMembersMap);
  const admins  = allMembers.filter(m => m.role === 'admin');
  const members = allMembers.filter(m => m.role !== 'admin');

  return (
    <AppLayout>
      <Topbar title="Team" subtitle={`${allMembers.length} total members across ${projects.length} projects`} />

      <div style={{ padding: 28, animation: 'fadeIn 0.3s ease both' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 80 }}><Spinner size={32} /></div>
        ) : (
          <>
            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 14, marginBottom: 26 }}>
              <StatCard label="Total Members" value={allMembers.length} icon="👥" />
              <StatCard label="Admins"    value={admins.length}  icon="🔑" accent="var(--purple)" />
              <StatCard label="Members"   value={members.length} icon="👤" accent="var(--primary)" />
              <StatCard label="Projects"  value={projects.length} icon="📁" accent="var(--accent)" />
            </div>

            {allMembers.length === 0 ? (
              <Card>
                <EmptyState icon="👥" title="No team members yet" description="Add members to your projects to see them here" />
              </Card>
            ) : (
              <>
                {/* Admins */}
                {admins.length > 0 && (
                  <div style={{ marginBottom: 24 }}>
                    <SectionHeader title="Admins" count={admins.length} color="var(--purple)" />
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
                      {admins.map(m => <MemberCard key={m.id || m._id} member={m} projects={projects} projectMembers={projectMembers} />)}
                    </div>
                  </div>
                )}

                {/* Members */}
                {members.length > 0 && (
                  <div style={{ marginBottom: 24 }}>
                    <SectionHeader title="Members" count={members.length} color="var(--primary)" />
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
                      {members.map(m => <MemberCard key={m.id || m._id} member={m} projects={projects} projectMembers={projectMembers} />)}
                    </div>
                  </div>
                )}

                {/* Projects breakdown */}
                <div>
                  <SectionHeader title="Project Breakdown" count={projects.length} color="var(--accent)" />
                  <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--border)' }}>
                          {['Project', 'Members', 'Created'].map(h => (
                            <th key={h} style={{ padding: '12px 18px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {projects.map(p => {
                          const pid = p.id || p._id;
                          const mems = projectMembers[pid] || [];
                          return (
                            <tr key={pid} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.1s' }}
                              onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
                              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                            >
                              <td style={{ padding: '14px 18px' }}>
                                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{p.name}</div>
                              </td>
                              <td style={{ padding: '14px 18px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                  <div style={{ display: 'flex' }}>
                                    {mems.slice(0, 4).map((m, i) => (
                                      <Avatar key={m.id || m._id} name={m.name} size={24}
                                        style={{ marginLeft: i === 0 ? 0 : -8, border: '2px solid var(--surface)' }}
                                      />
                                    ))}
                                  </div>
                                  <span style={{ fontSize: 12, color: 'var(--text3)' }}>{mems.length} member{mems.length !== 1 ? 's' : ''}</span>
                                </div>
                              </td>
                              <td style={{ padding: '14px 18px', fontSize: 12, color: 'var(--text3)' }}>{formatDate(p.createdAt)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
}

function SectionHeader({ title, count, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{title}</span>
      <span style={{ background: 'var(--surface2)', color: 'var(--text3)', fontSize: 11, fontWeight: 700, padding: '1px 7px', borderRadius: 10, border: '1px solid var(--border)' }}>{count}</span>
    </div>
  );
}

function MemberCard({ member, projects, projectMembers }) {
  const memberProjects = projects.filter(p => {
    const pid = p.id || p._id;
    const mems = projectMembers[pid] || [];
    return mems.some(m => (m.id || m._id) === (member.id || member._id));
  });

  return (
    <div style={{
      background: 'var(--surface)', borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border)', padding: '18px', boxShadow: 'var(--shadow-sm)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <Avatar name={member.name} size={40} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{member.name}</div>
          <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 1 }}>{member.email}</div>
        </div>
        <Badge type={member.role === 'admin' ? 'admin' : 'member'}>{member.role}</Badge>
      </div>
      <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 6 }}>
        {member.projectCount} project{member.projectCount !== 1 ? 's' : ''}
      </div>
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        {memberProjects.slice(0, 3).map(p => (
          <span key={p.id || p._id} style={{ background: 'var(--primary-light)', color: 'var(--primary)', fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 10 }}>
            {p.name}
          </span>
        ))}
        {memberProjects.length > 3 && (
          <span style={{ background: 'var(--surface2)', color: 'var(--text3)', fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 10 }}>
            +{memberProjects.length - 3} more
          </span>
        )}
      </div>
    </div>
  );
}
