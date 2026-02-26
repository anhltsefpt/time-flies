import type { FiniteEvent } from '@/types';

export const EVENT_COLORS = [
  '#F97316', '#3B82F6', '#22C55E', '#EC4899',
  '#8B5CF6', '#EF4444', '#F59E0B', '#6366F1',
];

export function getDaysLeft(due: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(due);
  d.setHours(0, 0, 0, 0);
  return Math.ceil((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export function getEventProgress(due: string): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const dueDate = new Date(due);
  dueDate.setHours(0, 0, 0, 0);
  const totalDays = Math.max(1, Math.ceil((dueDate.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)));
  const elapsed = totalDays - Math.max(getDaysLeft(due), 0);
  return Math.min((elapsed / totalDays) * 100, 100);
}

export function formatVietnameseDate(due: string): string {
  const date = new Date(due);
  return date.toLocaleDateString('vi-VN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function splitEvents(events: FiniteEvent[]): { upcoming: FiniteEvent[]; past: FiniteEvent[] } {
  const sorted = [...events].sort((a, b) => getDaysLeft(a.due) - getDaysLeft(b.due));
  return {
    upcoming: sorted.filter(e => getDaysLeft(e.due) >= 0),
    past: sorted.filter(e => getDaysLeft(e.due) < 0),
  };
}

export function hexToRgba(hex: string, opacity: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${opacity})`;
}
