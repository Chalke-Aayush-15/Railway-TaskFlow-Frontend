import React from 'react';
import { Badge, StatusDot, Button, Avatar } from './UI';
import { formatDateShort, isOverdue, getTaskId, getStatusOrOverdue } from '../utils/helpers';

export default function TaskCard({ task, onEdit, onUpdateStatus, compact = false }) {
  const od = isOverdue(task);
  const effectiveStatus = getStatusOrOverdue(task);

  if (compact) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
        background: 'var(--surface2)', borderRadius: 'var(--radius)',
        border: '1px solid var(--border)', marginBottom: 8,
        transition: 'border-color 0.15s',
      }}
        onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
        onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
      >
        <StatusDot status={effectiveStatus} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', textDecoration: task.status === 'done' ? 'line-through' : 'none', opacity: task.status === 'done' ? 0.6 : 1 }}>
            {task.title}
          </div>
          {task.dueDate && (
            <div style={{ fontSize: 11, color: od ? 'var(--danger)' : 'var(--text3)', marginTop: 2 }}>
              {od ? '⚠ ' : ''}Due {formatDateShort(task.dueDate)}
            </div>
          )}
        </div>
        <Badge type={effectiveStatus}>{effectiveStatus === 'in-progress' ? 'In Progress' : effectiveStatus.charAt(0).toUpperCase() + effectiveStatus.slice(1)}</Badge>
        {onUpdateStatus && (
          <Button variant="subtle" size="sm" onClick={() => onUpdateStatus(task)}>Update</Button>
        )}
      </div>
    );
  }

  return (
    <div style={{
      background: 'var(--surface)', borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)',
      padding: 16, marginBottom: 10, transition: 'box-shadow 0.15s, border-color 0.15s',
    }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow)'; e.currentTarget.style.borderColor = 'var(--border2)'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', flex: 1, paddingRight: 10, textDecoration: task.status === 'done' ? 'line-through' : 'none', opacity: task.status === 'done' ? 0.7 : 1 }}>
          {task.title}
        </div>
        <Badge type={effectiveStatus} style={{ flexShrink: 0 }}>
          {effectiveStatus === 'in-progress' ? 'In Progress' : effectiveStatus.charAt(0).toUpperCase() + effectiveStatus.slice(1)}
        </Badge>
      </div>

      {task.description && (
        <div style={{ fontSize: 12, color: 'var(--text3)', lineHeight: 1.5, marginBottom: 10 }}>
          {task.description.length > 90 ? task.description.slice(0, 90) + '…' : task.description}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
        {task.dueDate ? (
          <span style={{ fontSize: 11, color: od ? 'var(--danger)' : 'var(--text3)', display: 'flex', alignItems: 'center', gap: 4 }}>
            📅 {formatDateShort(task.dueDate)}{od ? ' · Overdue' : ''}
          </span>
        ) : <span />}
        <div style={{ display: 'flex', gap: 6 }}>
          {onUpdateStatus && <Button variant="subtle" size="sm" onClick={() => onUpdateStatus(task)}>Update</Button>}
          {onEdit && <Button variant="ghost" size="sm" onClick={() => onEdit(task)}>Edit</Button>}
        </div>
      </div>
    </div>
  );
}
