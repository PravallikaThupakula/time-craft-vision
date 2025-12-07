import { Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Activity, CATEGORY_COLORS, CATEGORY_LABELS, CATEGORY_ICONS } from '@/types/activity';

interface ActivityListProps {
  activities: Activity[];
  onEdit: (activity: Activity) => void;
  onDelete: (id: string) => void;
}

export function ActivityList({ activities, onEdit, onDelete }: ActivityListProps) {
  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="space-y-3">
      {activities.map((activity, index) => (
        <div
          key={activity.id}
          className="group bg-card rounded-xl p-4 border border-border hover:shadow-md transition-all duration-200 animate-fade-in-up"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
              style={{ backgroundColor: `${CATEGORY_COLORS[activity.category]}20` }}
            >
              {CATEGORY_ICONS[activity.category]}
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-foreground truncate">
                {activity.name}
              </h4>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className="text-xs font-medium px-2 py-0.5 rounded-full"
                  style={{ 
                    backgroundColor: `${CATEGORY_COLORS[activity.category]}20`,
                    color: CATEGORY_COLORS[activity.category]
                  }}
                >
                  {CATEGORY_LABELS[activity.category]}
                </span>
                <span className="text-sm text-muted-foreground">
                  {formatDuration(activity.duration)}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(activity)}
                className="h-8 w-8"
              >
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(activity.id)}
                className="h-8 w-8 text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
