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

export function getEventProgress(due: string, created?: string): number {
  if (!created) return 0;
  const start = new Date(created); start.setHours(0, 0, 0, 0);
  const end = new Date(due); end.setHours(0, 0, 0, 0);
  const now = new Date(); now.setHours(0, 0, 0, 0);
  const total = Math.max(1, (end.getTime() - start.getTime()) / 86400000);
  const elapsed = (now.getTime() - start.getTime()) / 86400000;
  return Math.min(Math.max((elapsed / total) * 100, 0), 100);
}

export function formatDate(due: string): string {
  const date = new Date(due);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function splitEvents(events: FiniteEvent[]): { upcoming: FiniteEvent[]; past: FiniteEvent[] } {
  const sorted = [...events].sort((a, b) => getDaysLeft(a.due) - getDaysLeft(b.due));
  return {
    upcoming: sorted.filter(e => getDaysLeft(e.due) >= 0),
    past: sorted.filter(e => getDaysLeft(e.due) < 0),
  };
}

export type UrgencyTier = 'critical' | 'soon' | 'normal' | 'distant' | 'past';

export function getUrgencyTier(due: string): UrgencyTier {
  const days = getDaysLeft(due);
  if (days < 0) return 'past';
  if (days <= 1) return 'critical';
  if (days <= 7) return 'soon';
  if (days <= 30) return 'normal';
  return 'distant';
}

export function getRelativeTimeLabel(due: string): string {
  const days = getDaysLeft(due);
  if (days < 0) {
    const abs = Math.abs(days);
    if (abs === 1) return 'yesterday';
    if (abs < 7) return `${abs} days ago`;
    if (abs < 30) return `${Math.floor(abs / 7)} weeks ago`;
    return `${Math.floor(abs / 30)} months ago`;
  }
  if (days === 0) return 'today';
  if (days === 1) return 'tomorrow';
  if (days < 7) return `in ${days} days`;
  if (days < 14) return 'next week';
  if (days < 30) return `in ${Math.floor(days / 7)} weeks`;
  if (days < 60) return 'next month';
  return `in ${Math.floor(days / 30)} months`;
}

export function getDaysSince(created: string): number {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const d = new Date(created); d.setHours(0, 0, 0, 0);
  return Math.floor((today.getTime() - d.getTime()) / 86400000);
}

export function hexToRgba(hex: string, opacity: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${opacity})`;
}
