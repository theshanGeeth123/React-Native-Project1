import dayjs from 'dayjs';

export const formatDate = (value?: string): string => {
  if (!value) return 'Not scheduled';
  const parsedDate = dayjs(value);
  return parsedDate.isValid() ? parsedDate.format('MMM D, YYYY') : 'Not scheduled';
};

export const formatShortDate = (value?: string): string => {
  if (!value) return 'TBA';
  const parsedDate = dayjs(value);
  return parsedDate.isValid() ? parsedDate.format('MMM D') : 'TBA';
};

export const formatTaskDateTime = (date?: string, time?: string): string => {
  if (!date) return 'Not scheduled';
  const parsedDate = dayjs(`${date}T${time || '09:00'}`);
  return parsedDate.isValid() ? parsedDate.format('ddd, MMM D • h:mm A') : 'Not scheduled';
};

export const formatDuration = (minutes: number): string => {
  if (!Number.isFinite(minutes) || minutes <= 0) return '0m';
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
};

export const formatPriorityLabel = (priority: StudyTaskPriority): string => {
  const labels: Record<StudyTaskPriority, string> = {
    high: 'High priority',
    medium: 'Medium priority',
    low: 'Low priority',
  };

  return labels[priority];
};

export const formatStatusLabel = (status: StudyTaskStatus): string => {
  const labels: Record<StudyTaskStatus, string> = {
    todo: 'To do',
    'in-progress': 'In progress',
    completed: 'Completed',
  };

  return labels[status];
};

export const clampProgress = (value: number): number => Math.min(Math.max(value, 0), 100);

export const createId = (prefix = 'item') =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

export const getInitials = (nameOrEmail?: string | null) => {
  if (!nameOrEmail) return 'S';
  const safe = nameOrEmail.trim();
  if (!safe) return 'S';

  const emailName = safe.includes('@') ? safe.split('@')[0] : safe;
  const parts = emailName.split(/[\s._-]+/).filter(Boolean);
  const initials = parts.slice(0, 2).map((part) => part[0]?.toUpperCase()).join('');
  return initials || safe[0].toUpperCase();
};
