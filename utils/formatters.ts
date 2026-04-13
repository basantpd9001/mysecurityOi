import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns';

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return format(d, 'MMM dd, yyyy');
}

export function formatTime(date: Date | string): string {
  const d = new Date(date);
  return format(d, 'hh:mm a');
}

export function formatDateTime(date: Date | string): string {
  const d = new Date(date);
  return format(d, 'MMM dd, yyyy · hh:mm a');
}

export function formatRelativeTime(date: Date | string): string {
  const d = new Date(date);
  if (isToday(d)) {
    return `Today at ${format(d, 'hh:mm a')}`;
  }
  if (isYesterday(d)) {
    return `Yesterday at ${format(d, 'hh:mm a')}`;
  }
  return formatDistanceToNow(d, { addSuffix: true });
}

export function formatAddress(address: string): string {
  if (!address) return 'Unknown location';
  // Trim long addresses to first two parts
  const parts = address.split(',').slice(0, 3);
  return parts.map(p => p.trim()).join(', ');
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function formatSteps(steps: number): string {
  if (steps >= 1000) {
    return `${(steps / 1000).toFixed(1)}k`;
  }
  return String(steps);
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}
