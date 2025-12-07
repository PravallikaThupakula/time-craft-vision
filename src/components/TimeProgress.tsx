import { MAX_MINUTES_PER_DAY } from '@/types/activity';

interface TimeProgressProps {
  usedMinutes: number;
}

export function TimeProgress({ usedMinutes }: TimeProgressProps) {
  const percentage = (usedMinutes / MAX_MINUTES_PER_DAY) * 100;
  const remainingMinutes = MAX_MINUTES_PER_DAY - usedMinutes;
  
  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins} minutes`;
    if (mins === 0) return `${hours} hours`;
    return `${hours}h ${mins}m`;
  };

  const getProgressColor = (): string => {
    if (percentage >= 100) return 'gradient-accent';
    if (percentage >= 80) return 'gradient-warm';
    return 'gradient-primary';
  };

  return (
    <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-foreground">Daily Progress</h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            {formatTime(usedMinutes)} logged
          </p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-gradient">
            {Math.round(percentage)}%
          </span>
          <p className="text-xs text-muted-foreground">
            {remainingMinutes > 0 ? `${formatTime(remainingMinutes)} left` : 'Complete!'}
          </p>
        </div>
      </div>
      
      <div className="h-4 bg-secondary rounded-full overflow-hidden">
        <div
          className={`h-full ${getProgressColor()} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      
      <div className="flex justify-between mt-3 text-xs text-muted-foreground">
        <span>0h</span>
        <span>6h</span>
        <span>12h</span>
        <span>18h</span>
        <span>24h</span>
      </div>
    </div>
  );
}
