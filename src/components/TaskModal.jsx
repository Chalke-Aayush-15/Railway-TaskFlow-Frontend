import React, { useState, useEffect } from 'react';
import { Modal, Input, Textarea, Select, Button } from './UI';
import { useToast } from '../context/ToastContext';
import api from '../utils/api';
import { getTaskId } from '../utils/helpers';

export default function TaskModal({ task, projectId, projects = [], members = [], onClose, onSaved }) {
  const { show } = useToast();
  const isEdit = !!task;
  const [form, setForm] = useState({
    title: task?.title || '',
    description: task?.description || '',
    projectId: task?.project_id || task?.projectId || projectId || '',
    assigned_to: task?.assigned_to || task?.assignedTo || '',
    status: task?.status || 'todo',
    due_date: task?.due_date ? task.due_date.slice(0, 10) : '',
  });
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!form.title.trim()) return show('Title is required', 'error');
    if (!form.projectId) return show('Please select a project', 'error');
    setLoading(true);

    // Build payload with correct snake_case field names the API expects
    const payload = {
      title: form.title.trim(),
      description: form.description || null,
      status: form.status,
      due_date: form.due_date || null,
      assigned_to: form.assigned_to ? Number(form.assigned_to) : null,
    };

    try {
      if (isEdit) {
        await api.patch(`/tasks/${getTaskId(task)}`, payload);
        show('Task updated!');
      } else {
        await api.post(`/projects/${form.projectId}/tasks`, payload);
        show('Task created!');
      }
      onSaved?.();
      onClose();
    } catch (e) {
      show(e?.message || 'Something went wrong', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this task?')) return;
    setLoading(true);
    try {
      await api.delete(`/tasks/${getTaskId(task)}`);
      show('Task deleted');
      onSaved?.();
      onClose();
    } catch (e) {
      show(e?.message || 'Could not delete task', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title={isEdit ? 'Edit Task' : 'Create New Task'} onClose={onClose}>
      <Input
        label="Title" placeholder="What needs to be done?" value={form.title}
        onChange={e => set('title', e.target.value)}
      />
      <Textarea
        label="Description" placeholder="Add more details..." value={form.description}
        onChange={e => set('description', e.target.value)}
      />
      {!projectId && (
        <Select label="Project" value={form.projectId} onChange={e => set('projectId', e.target.value)}>
          <option value="">Select project</option>
          {projects.map(p => <option key={p.id || p._id} value={p.id || p._id}>{p.name}</option>)}
        </Select>
      )}
      {members.length > 0 && (
        <Select label="Assign To" value={form.assigned_to} onChange={e => set('assigned_to', e.target.value)}>
          <option value="">Unassigned</option>
          {members.map(m => <option key={m.id || m._id} value={m.id || m._id}>{m.name}</option>)}
        </Select>
      )}
      <Select label="Status" value={form.status} onChange={e => set('status', e.target.value)}>
        <option value="todo">To Do</option>
        <option value="in-progress">In Progress</option>
        <option value="done">Done</option>
      </Select>
      <Input label="Due Date" type="date" value={form.due_date} onChange={e => set('due_date', e.target.value)} />

      <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
        {isEdit && (
          <Button variant="danger" onClick={handleDelete} loading={loading} style={{ marginRight: 'auto' }}>
            Delete
          </Button>
        )}
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button variant="primary" onClick={handleSubmit} loading={loading} style={{ flex: 1 }}>
          {isEdit ? 'Save Changes' : 'Create Task'}
        </Button>
      </div>
    </Modal>
  );
}
