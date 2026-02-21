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

export interface AwakeTimeDataEntry extends TimeDataEntry {
  elapsed: number;
  total: number;
}

export interface SecondsData {
  today: number;
  todayLeft: number;
}

export interface TimeData {
  day: TimeDataEntry;
  awake: AwakeTimeDataEntry;
  week: TimeDataEntry;
  month: TimeDataEntry;
  year: TimeDataEntry;
  life: TimeDataEntry;
  seconds: SecondsData;
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
