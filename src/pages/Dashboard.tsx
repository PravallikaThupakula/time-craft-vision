import { useState } from 'react';
import { Plus, BarChart3 } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { DatePicker } from '@/components/DatePicker';
import { TimeProgress } from '@/components/TimeProgress';
import { ActivityList } from '@/components/ActivityList';
import { ActivityForm } from '@/components/ActivityForm';
import { EmptyState } from '@/components/EmptyState';
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard';
import { useActivities } from '@/hooks/useActivities';
import { Activity, ActivityCategory } from '@/types/activity';
import { toast } from 'sonner';

interface DashboardProps {
  userName: string;
  onLogout: () => void;
}

export function Dashboard({ userName, onLogout }: DashboardProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showForm, setShowForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);

  const {
    getActivitiesForDate,
    getDayData,
    getRemainingMinutes,
    addActivity,
    updateActivity,
    deleteActivity,
    canAnalyze,
  } = useActivities();

  const dayData = getDayData(selectedDate);
  const remainingMinutes = getRemainingMinutes(selectedDate);
  const activities = getActivitiesForDate(selectedDate);
  const canShowAnalytics = canAnalyze(selectedDate);

  const handleAddActivity = (activity: { name: string; category: ActivityCategory; duration: number }) => {
    return addActivity({
      ...activity,
      date: format(selectedDate, 'yyyy-MM-dd'),
    });
  };

  const handleUpdateActivity = (id: string, updates: { name: string; category: ActivityCategory; duration: number }) => {
    return updateActivity(id, updates);
  };

  const handleDeleteActivity = (id: string) => {
    deleteActivity(id);
    toast.success('Activity deleted');
  };

  const handleEditActivity = (activity: Activity) => {
    setEditingActivity(activity);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingActivity(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header userName={userName} onLogout={onLogout} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Date Navigation & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <DatePicker date={selectedDate} onDateChange={setSelectedDate} />
          
          <div className="flex items-center gap-3">
            {canShowAnalytics && (
              <Button
                variant={showAnalytics ? "default" : "outline"}
                onClick={() => setShowAnalytics(!showAnalytics)}
                className="gap-2"
              >
                <BarChart3 className="w-4 h-4" />
                {showAnalytics ? 'Hide Analytics' : 'Analyse'}
              </Button>
            )}
            <Button
              variant="hero"
              onClick={() => setShowForm(true)}
              disabled={remainingMinutes === 0}
              className="gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Activity
            </Button>
          </div>
        </div>

        {/* Main Content */}
        {showAnalytics && canShowAnalytics ? (
          <AnalyticsDashboard activities={activities} date={selectedDate} />
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Progress & Activities */}
            <div className="lg:col-span-2 space-y-6">
              <TimeProgress usedMinutes={dayData.totalMinutes} />
              
              {activities.length === 0 ? (
                <EmptyState onAddActivity={() => setShowForm(true)} />
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-foreground">
                      Today's Activities
                    </h2>
                    <span className="text-sm text-muted-foreground">
                      {activities.length} {activities.length === 1 ? 'activity' : 'activities'}
                    </span>
                  </div>
                  <ActivityList
                    activities={activities}
                    onEdit={handleEditActivity}
                    onDelete={handleDeleteActivity}
                  />
                </div>
              )}
            </div>

            {/* Right Column - Quick Stats */}
            <div className="space-y-6">
              <div className="bg-card rounded-2xl p-6 border border-border">
                <h3 className="font-semibold text-foreground mb-4">Quick Stats</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Time Logged</span>
                    <span className="font-semibold text-foreground">
                      {Math.floor(dayData.totalMinutes / 60)}h {dayData.totalMinutes % 60}m
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Time Remaining</span>
                    <span className="font-semibold text-foreground">
                      {Math.floor(remainingMinutes / 60)}h {remainingMinutes % 60}m
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Activities</span>
                    <span className="font-semibold text-foreground">{activities.length}</span>
                  </div>
                </div>
              </div>

              {canShowAnalytics && !showAnalytics && (
                <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-6 border border-primary/20">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <h3 className="font-semibold text-foreground">Ready to Analyse</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    You've logged activities for this day. Click analyse to see detailed insights.
                  </p>
                  <Button
                    variant="hero"
                    size="sm"
                    onClick={() => setShowAnalytics(true)}
                    className="w-full"
                  >
                    View Analytics
                  </Button>
                </div>
              )}

              {/* Tips Card */}
              <div className="bg-card rounded-2xl p-6 border border-border">
                <h3 className="font-semibold text-foreground mb-3">💡 Quick Tips</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Log activities as you go for accuracy</li>
                  <li>• Use categories to track patterns</li>
                  <li>• Review analytics daily for insights</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Activity Form Modal */}
      {showForm && (
        <ActivityForm
          onSubmit={handleAddActivity}
          onCancel={handleCloseForm}
          remainingMinutes={remainingMinutes}
          editingActivity={editingActivity}
          onUpdate={handleUpdateActivity}
        />
      )}
    </div>
  );
}
