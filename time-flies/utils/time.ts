import type { Settings, TimeData } from '@/types';

export const DEFAULT_SETTINGS: Settings = {
  birthYear: 1995,
  lifeExpectancy: 75,
  sleepStart: 23,
  sleepEnd: 6,
  name: '',
  theme: 'dark',
  showLifeTab: true,
  showSeconds: true,
  language: 'vi',
};

export function isSleepHour(h: number, sleepStart: number, sleepEnd: number): boolean {
  if (sleepStart > sleepEnd) return h >= sleepStart || h < sleepEnd;
  return h >= sleepStart && h < sleepEnd;
}

export function getTimeData(settings: Settings): TimeData {
  const now = new Date();
  const { birthYear, lifeExpectancy, sleepStart, sleepEnd } = settings;

  const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dayEnd = new Date(dayStart);
  dayEnd.setDate(dayEnd.getDate() + 1);
  const dayProgress = ((now.getTime() - dayStart.getTime()) / (dayEnd.getTime() - dayStart.getTime())) * 100;
  const dayHoursLeft = (dayEnd.getTime() - now.getTime()) / 3600000;

  // Awake time calculation
  const sleepHours = sleepStart > sleepEnd ? (24 - sleepStart + sleepEnd) : (sleepEnd - sleepStart);
  const awakeHours = 24 - sleepHours;
  const currentHour = now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600;
  let awakeElapsed = 0;
  if (sleepStart > sleepEnd) {
    if (currentHour >= sleepEnd && currentHour < sleepStart) {
      awakeElapsed = currentHour - sleepEnd;
    } else {
      awakeElapsed = awakeHours;
    }
  } else {
    if (currentHour >= sleepStart || currentHour < sleepEnd) {
      awakeElapsed = awakeHours;
    } else {
      awakeElapsed = Math.max(0, currentHour - sleepEnd);
    }
  }
  const awakeProgress = Math.min((awakeElapsed / awakeHours) * 100, 100);
  const awakeLeft = Math.max(awakeHours - awakeElapsed, 0);

  const dayOfWeek = now.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() + mondayOffset);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);
  const weekProgress = ((now.getTime() - weekStart.getTime()) / (weekEnd.getTime() - weekStart.getTime())) * 100;
  const weekDaysLeft = (weekEnd.getTime() - now.getTime()) / 86400000;

  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const monthProgress = ((now.getTime() - monthStart.getTime()) / (monthEnd.getTime() - monthStart.getTime())) * 100;
  const monthDaysLeft = (monthEnd.getTime() - now.getTime()) / 86400000;

  const yearStart = new Date(now.getFullYear(), 0, 1);
  const yearEnd = new Date(now.getFullYear() + 1, 0, 1);
  const yearProgress = ((now.getTime() - yearStart.getTime()) / (yearEnd.getTime() - yearStart.getTime())) * 100;
  const yearDaysLeft = (yearEnd.getTime() - now.getTime()) / 86400000;

  const birthDate = new Date(birthYear, 0, 1);
  const lifeEnd = new Date(birthYear + lifeExpectancy, 0, 1);
  const lifeProgress = Math.min(((now.getTime() - birthDate.getTime()) / (lifeEnd.getTime() - birthDate.getTime())) * 100, 100);
  const lifeYearsLeft = Math.max((lifeEnd.getTime() - now.getTime()) / (365.25 * 86400000), 0);

  const secondsToday = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

  return {
    day: { progress: dayProgress, left: dayHoursLeft, unit: 'hrs' },
    awake: { progress: awakeProgress, left: awakeLeft, unit: 'hrs', elapsed: awakeElapsed, total: awakeHours, leftSeconds: Math.round(awakeLeft * 3600) },
    week: { progress: weekProgress, left: weekDaysLeft, unit: 'days' },
    month: { progress: monthProgress, left: monthDaysLeft, unit: 'days' },
    year: { progress: yearProgress, left: yearDaysLeft, unit: 'days' },
    life: { progress: lifeProgress, left: lifeYearsLeft, unit: 'yrs' },
    seconds: { today: secondsToday, todayLeft: 86400 - secondsToday },
  };
}
