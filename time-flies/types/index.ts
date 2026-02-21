export interface Settings {
  birthYear: number;
  lifeExpectancy: number;
  sleepStart: number;
  sleepEnd: number;
  name: string;
  theme: 'dark';
  notifications: boolean;
  notifyMilestones: boolean;
  notifyDaily: boolean;
  dailyNotifyTime: number;
  showLifeTab: boolean;
  showSeconds: boolean;
  language: 'vi';
}

export interface TimeDataEntry {
  progress: number;
  left: number;
  unit: string;
}

export interface TimeData {
  day: TimeDataEntry;
  awake: TimeDataEntry;
  week: TimeDataEntry;
  month: TimeDataEntry;
  year: TimeDataEntry;
  life: TimeDataEntry;
}

export interface Quote {
  text: string;
  author: string;
}

export interface LifePhase {
  label: string;
  range: [number, number];
  color: string;
}
