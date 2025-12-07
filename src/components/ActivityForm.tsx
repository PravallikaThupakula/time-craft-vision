import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ActivityCategory, CATEGORY_LABELS, CATEGORY_ICONS, Activity } from '@/types/activity';
import { toast } from 'sonner';

interface ActivityFormProps {
  onSubmit: (activity: { name: string; category: ActivityCategory; duration: number }) => boolean;
  onCancel: () => void;
  remainingMinutes: number;
  editingActivity?: Activity | null;
  onUpdate?: (id: string, updates: { name: string; category: ActivityCategory; duration: number }) => boolean;
}

export function ActivityForm({ 
  onSubmit, 
  onCancel, 
  remainingMinutes, 
  editingActivity,
  onUpdate 
}: ActivityFormProps) {
  const [name, setName] = useState(editingActivity?.name ?? '');
  const [category, setCategory] = useState<ActivityCategory>(editingActivity?.category ?? 'work');
  const [duration, setDuration] = useState(editingActivity?.duration.toString() ?? '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const maxDuration = editingActivity 
    ? remainingMinutes + editingActivity.duration 
    : remainingMinutes;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const durationNum = parseInt(duration, 10);
    
    if (!name.trim()) {
      toast.error('Please enter an activity name');
      return;
    }
    
    if (!duration || durationNum <= 0) {
      toast.error('Please enter a valid duration');
      return;
    }
    
    if (durationNum > maxDuration) {
      toast.error(`Duration exceeds available time. Max: ${maxDuration} minutes`);
      return;
    }

    setIsSubmitting(true);
    
    // Simulate slight delay for UX
    await new Promise(resolve => setTimeout(resolve, 200));

    let success: boolean;
    if (editingActivity && onUpdate) {
      success = onUpdate(editingActivity.id, { name: name.trim(), category, duration: durationNum });
    } else {
      success = onSubmit({ name: name.trim(), category, duration: durationNum });
    }
    
    if (success) {
      toast.success(editingActivity ? 'Activity updated!' : 'Activity added!');
      onCancel();
    } else {
      toast.error('Failed to save activity. Check the duration.');
    }
    
    setIsSubmitting(false);
  };

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm animate-fade-in">
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-md mx-4 animate-scale-in">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">
            {editingActivity ? 'Edit Activity' : 'Add Activity'}
          </h2>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name">Activity Name</Label>
            <Input
              id="name"
              placeholder="e.g., Morning workout, Client meeting..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-12"
              autoFocus
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as ActivityCategory)}>
              <SelectTrigger className="h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(CATEGORY_LABELS) as ActivityCategory[]).map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    <span className="flex items-center gap-2">
                      <span>{CATEGORY_ICONS[cat]}</span>
                      <span>{CATEGORY_LABELS[cat]}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <span className="text-sm text-muted-foreground">
                Available: {formatTime(maxDuration)}
              </span>
            </div>
            <Input
              id="duration"
              type="number"
              min="1"
              max={maxDuration}
              placeholder="e.g., 60"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="h-12"
            />
            <div className="flex gap-2 mt-2">
              {[15, 30, 60, 120].map((mins) => (
                <Button
                  key={mins}
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setDuration(mins.toString())}
                  disabled={mins > maxDuration}
                  className="flex-1"
                >
                  {formatTime(mins)}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="hero"
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : editingActivity ? 'Update' : 'Add Activity'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
