import React, { useState } from 'react';
import { Modal, Select, Button } from './UI';
import { useToast } from '../context/ToastContext';
import api from '../utils/api';
import { getTaskId } from '../utils/helpers';

export default function UpdateStatusModal({ task, onClose, onSaved }) {
  const { show } = useToast();
  const [status, setStatus] = useState(task.status);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await api.patch(`/tasks/${getTaskId(task)}`, { status });
      show('Status updated!');
      onSaved?.();
      onClose();
    } catch (e) {
      show(e, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Update Task Status" onClose={onClose} width={380}>
      <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 16 }}>
        <strong style={{ color: 'var(--text)' }}>{task.title}</strong>
      </div>
      <Select label="New Status" value={status} onChange={e => setStatus(e.target.value)} style={{ marginBottom: 20 }}>
        <option value="todo">To Do</option>
        <option value="in-progress">In Progress</option>
        <option value="done">Done</option>
      </Select>
      <div style={{ display: 'flex', gap: 10 }}>
        <Button variant="ghost" onClick={onClose} style={{ flex: 1 }}>Cancel</Button>
        <Button variant="primary" onClick={handleUpdate} loading={loading} style={{ flex: 1 }}>Update</Button>
      </div>
    </Modal>
  );
}
