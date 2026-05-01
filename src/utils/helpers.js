export const AVATAR_COLORS = [
  { bg: '#EFF6FF', color: '#1d4ed8' },
  { bg: '#ECFDF5', color: '#065f46' },
  { bg: '#F5F3FF', color: '#5b21b6' },
  { bg: '#FFFBEB', color: '#92400e' },
  { bg: '#FEF2F2', color: '#991b1b' },
  { bg: '#ECFEFF', color: '#0e7490' },
  { bg: '#FFF7ED', color: '#9a3412' },
];

export function getAvatarStyle(name = '') {
  const idx = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

export function getInitials(name = '') {
  return name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2) || 'U';
}

export function formatDate(date) {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

export function formatDateShort(date) {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function isOverdue(task) {
  if (!task?.dueDate || task.status === 'done') return false;
  return new Date(task.dueDate) < new Date();
}

export function getTaskId(task) {
  return task?.id || task?._id;
}

export function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export const STATUS_CONFIG = {
  'todo':        { label: 'To Do',       dot: '#9ca3af', badge: 'badge-todo' },
  'in-progress': { label: 'In Progress', dot: '#3B82F6', badge: 'badge-progress' },
  'done':        { label: 'Done',        dot: '#10b981', badge: 'badge-done' },
  'overdue':     { label: 'Overdue',     dot: '#ef4444', badge: 'badge-overdue' },
};

export function getStatusOrOverdue(task) {
  return isOverdue(task) ? 'overdue' : task.status;
}
