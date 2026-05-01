import React, { useState } from 'react';
import { Badge, StatusDot, Button, Avatar } from './UI';
import { formatDateShort, isOverdue, getTaskId, getStatusOrOverdue } from '../utils/helpers';

export default function TaskCard({ task, onEdit, onUpdateStatus, compact = false }) {
  const [hov, setHov] = useState(false);
  const od = isOverdue(task);
  const effectiveStatus = getStatusOrOverdue(task);

  const statusLabel = effectiveStatus === 'in-progress'
    ? 'In Progress'
    : effectiveStatus.charAt(0).toUpperCase() + effectiveStatus.slice(1);

  if (compact) {
    return (
      <div
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '11px 14px',
          background: hov ? 'var(--surface3)' : 'var(--surface2)',
          borderRadius: 'var(--radius)',
          border: `1px solid ${hov ? (od ? 'rgba(255,77,109,0.30)' : 'var(--border2)') : 'var(--border)'}`,
          marginBottom: 7,
          transition: 'all 0.15s ease',
        }}
      >
        <StatusDot status={effectiveStatus} size={8} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 13, fontWeight: 600, color: 'var(--text)',
            textDecoration: task.status === 'done' ? 'line-through' : 'none',
            opacity: task.status === 'done' ? 0.55 : 1,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {task.title}
          </div>
          {task.dueDate && (
            <div style={{
              fontSize: 11, marginTop: 2,
              color: od ? 'var(--danger)' : 'var(--text3)',
              fontWeight: od ? 600 : 400,
            }}>
              {od ? '⚠ Overdue · ' : ''}Due {formatDateShort(task.dueDate)}
            </div>
          )}
        </div>
        <Badge type={effectiveStatus}>{statusLabel}</Badge>
        {onUpdateStatus && (
          <Button variant="subtle" size="sm" onClick={() => onUpdateStatus(task)}>
            Update
          </Button>
        )}
      </div>
    );
  }

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? 'var(--surface2)' : 'var(--surface)',
        borderRadius: 'var(--radius-lg)',
        border: `1px solid ${hov ? 'var(--border2)' : 'var(--border)'}`,
        boxShadow: hov ? 'var(--shadow)' : 'var(--shadow-sm)',
        padding: '16px',
        marginBottom: 10,
        transition: 'all 0.2s ease',
        transform: hov ? 'translateY(-1px)' : 'translateY(0)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Left-side status accent */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: 3,
        background: effectiveStatus === 'done' ? 'var(--success)'
          : effectiveStatus === 'in-progress' ? 'var(--primary)'
          : effectiveStatus === 'overdue' ? 'var(--danger)'
          : 'var(--border2)',
        opacity: hov ? 1 : 0.5,
        transition: 'opacity 0.2s',
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8, paddingLeft: 4 }}>
        <div style={{
          fontSize: 13, fontWeight: 700, color: 'var(--text)', flex: 1, paddingRight: 10,
          textDecoration: task.status === 'done' ? 'line-through' : 'none',
          opacity: task.status === 'done' ? 0.6 : 1,
          lineHeight: 1.4,
        }}>
          {task.title}
        </div>
        <Badge type={effectiveStatus} style={{ flexShrink: 0 }}>
          {statusLabel}
        </Badge>
      </div>

      {task.description && (
        <div style={{ fontSize: 12, color: 'var(--text3)', lineHeight: 1.55, marginBottom: 10, paddingLeft: 4 }}>
          {task.description.length > 90 ? task.description.slice(0, 90) + '…' : task.description}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, paddingLeft: 4 }}>
        {task.dueDate ? (
          <span style={{
            fontSize: 11, color: od ? 'var(--danger)' : 'var(--text3)',
            fontWeight: od ? 600 : 400,
            display: 'flex', alignItems: 'center', gap: 4,
          }}>
            📅 {formatDateShort(task.dueDate)}{od ? ' · Overdue' : ''}
          </span>
        ) : <span />}
        <div style={{ display: 'flex', gap: 6 }}>
          {onUpdateStatus && (
            <Button variant="subtle" size="sm" onClick={() => onUpdateStatus(task)}>
              Update
            </Button>
          )}
          {onEdit && (
            <Button variant="ghost" size="sm" onClick={() => onEdit(task)}>
              Edit
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
