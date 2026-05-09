import dayjs from 'dayjs';

export function formatDate(dateString: string): string {
  return dayjs(dateString).format('YYYY-MM-DD HH:mm:ss');
}

export function formatDateShort(dateString: string): string {
  return dayjs(dateString).format('YYYY-MM-DD');
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}小时${mins}分钟`;
  }
  return `${mins}分钟`;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}