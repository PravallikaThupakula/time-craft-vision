export type ActivityCategory = 
  | 'work'
  | 'sleep'
  | 'exercise'
  | 'study'
  | 'entertainment'
  | 'other';

export interface Activity {
  id: string;
  name: string;
  category: ActivityCategory;
  duration: number; // in minutes
  date: string; // YYYY-MM-DD format
  createdAt: string;
}

export interface DayData {
  date: string;
  activities: Activity[];
  totalMinutes: number;
}

export const CATEGORY_COLORS: Record<ActivityCategory, string> = {
  work: 'hsl(243, 75%, 59%)',
  sleep: 'hsl(174, 72%, 46%)',
  exercise: 'hsl(142, 71%, 45%)',
  study: 'hsl(45, 93%, 47%)',
  entertainment: 'hsl(280, 68%, 60%)',
  other: 'hsl(220, 9%, 46%)',
};

export const CATEGORY_LABELS: Record<ActivityCategory, string> = {
  work: 'Work',
  sleep: 'Sleep',
  exercise: 'Exercise',
  study: 'Study',
  entertainment: 'Entertainment',
  other: 'Other',
};

export const CATEGORY_ICONS: Record<ActivityCategory, string> = {
  work: '💼',
  sleep: '😴',
  exercise: '🏃',
  study: '📚',
  entertainment: '🎮',
  other: '📌',
};

export const MAX_MINUTES_PER_DAY = 1440; // 24 hours
