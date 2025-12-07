import { Calendar, Clock, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  onAddActivity: () => void;
}

export function EmptyState({ onAddActivity }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 animate-fade-in-up">
      <div className="relative mb-8">
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
            <Calendar className="w-12 h-12 text-primary" />
          </div>
        </div>
        <div className="absolute -top-2 -right-2 w-12 h-12 rounded-full gradient-accent flex items-center justify-center shadow-lg animate-bounce">
          <Clock className="w-6 h-6 text-accent-foreground" />
        </div>
      </div>
      
      <h3 className="text-2xl font-bold text-foreground mb-3">
        No Activities Yet
      </h3>
      
      <p className="text-muted-foreground text-center max-w-md mb-8 leading-relaxed">
        Start tracking your day by logging your first activity. See how you spend your 24 hours and gain insights into your daily routine.
      </p>
      
      <Button 
        onClick={onAddActivity}
        variant="hero"
        size="lg"
        className="gap-2"
      >
        <Plus className="w-5 h-5" />
        Log Your First Activity
      </Button>
      
      <div className="mt-12 grid grid-cols-3 gap-6 text-center">
        {[
          { emoji: '📊', label: 'Track Time' },
          { emoji: '📈', label: 'Analyze Patterns' },
          { emoji: '🎯', label: 'Optimize Days' },
        ].map((item, i) => (
          <div 
            key={item.label} 
            className={`flex flex-col items-center gap-2 opacity-0 animate-fade-in-up stagger-${i + 1}`}
          >
            <span className="text-3xl">{item.emoji}</span>
            <span className="text-sm text-muted-foreground font-medium">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
