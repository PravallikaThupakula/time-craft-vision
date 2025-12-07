import { useState, useEffect, useCallback } from 'react';
import { Activity, DayData, MAX_MINUTES_PER_DAY } from '@/types/activity';
import { format } from 'date-fns';

const STORAGE_KEY = 'time-tracker-activities';

export function useActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setActivities(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse stored activities:', e);
      }
    }
  }, []);

  // Save to localStorage whenever activities change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
  }, [activities]);

  const getActivitiesForDate = useCallback((date: Date): Activity[] => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return activities.filter(a => a.date === dateStr);
  }, [activities]);

  const getDayData = useCallback((date: Date): DayData => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayActivities = getActivitiesForDate(date);
    const totalMinutes = dayActivities.reduce((sum, a) => sum + a.duration, 0);
    
    return {
      date: dateStr,
      activities: dayActivities,
      totalMinutes,
    };
  }, [getActivitiesForDate]);

  const getRemainingMinutes = useCallback((date: Date): number => {
    const dayData = getDayData(date);
    return MAX_MINUTES_PER_DAY - dayData.totalMinutes;
  }, [getDayData]);

  const addActivity = useCallback((activity: Omit<Activity, 'id' | 'createdAt'>): boolean => {
    const dateActivities = activities.filter(a => a.date === activity.date);
    const currentTotal = dateActivities.reduce((sum, a) => sum + a.duration, 0);
    
    if (currentTotal + activity.duration > MAX_MINUTES_PER_DAY) {
      return false;
    }

    const newActivity: Activity = {
      ...activity,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };

    setActivities(prev => [...prev, newActivity]);
    return true;
  }, [activities]);

  const updateActivity = useCallback((id: string, updates: Partial<Omit<Activity, 'id' | 'createdAt'>>): boolean => {
    const activity = activities.find(a => a.id === id);
    if (!activity) return false;

    const otherActivities = activities.filter(a => a.id !== id && a.date === activity.date);
    const otherTotal = otherActivities.reduce((sum, a) => sum + a.duration, 0);
    const newDuration = updates.duration ?? activity.duration;

    if (otherTotal + newDuration > MAX_MINUTES_PER_DAY) {
      return false;
    }

    setActivities(prev => 
      prev.map(a => a.id === id ? { ...a, ...updates } : a)
    );
    return true;
  }, [activities]);

  const deleteActivity = useCallback((id: string): void => {
    setActivities(prev => prev.filter(a => a.id !== id));
  }, []);

  const canAnalyze = useCallback((date: Date): boolean => {
    const dayData = getDayData(date);
    return dayData.totalMinutes > 0;
  }, [getDayData]);

  return {
    activities,
    getActivitiesForDate,
    getDayData,
    getRemainingMinutes,
    addActivity,
    updateActivity,
    deleteActivity,
    canAnalyze,
  };
}
