import { useMemo } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Clock, Activity as ActivityIcon, TrendingUp, Calendar } from 'lucide-react';
import { Activity, CATEGORY_COLORS, CATEGORY_LABELS, ActivityCategory, MAX_MINUTES_PER_DAY } from '@/types/activity';
import { format } from 'date-fns';

interface AnalyticsDashboardProps {
  activities: Activity[];
  date: Date;
}

export function AnalyticsDashboard({ activities, date }: AnalyticsDashboardProps) {
  const stats = useMemo(() => {
    const categoryTotals: Record<ActivityCategory, number> = {
      work: 0,
      sleep: 0,
      exercise: 0,
      study: 0,
      entertainment: 0,
      other: 0,
    };

    activities.forEach(activity => {
      categoryTotals[activity.category] += activity.duration;
    });

    const totalMinutes = activities.reduce((sum, a) => sum + a.duration, 0);
    const totalHours = totalMinutes / 60;

    const pieData = Object.entries(categoryTotals)
      .filter(([_, value]) => value > 0)
      .map(([category, value]) => ({
        name: CATEGORY_LABELS[category as ActivityCategory],
        value,
        color: CATEGORY_COLORS[category as ActivityCategory],
        hours: (value / 60).toFixed(1),
      }));

    const barData = activities
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 8)
      .map(activity => ({
        name: activity.name.length > 15 ? activity.name.slice(0, 15) + '...' : activity.name,
        duration: activity.duration,
        hours: (activity.duration / 60).toFixed(1),
        color: CATEGORY_COLORS[activity.category],
      }));

    return {
      totalMinutes,
      totalHours,
      activityCount: activities.length,
      categoryTotals,
      pieData,
      barData,
      completionPercent: Math.round((totalMinutes / MAX_MINUTES_PER_DAY) * 100),
    };
  }, [activities]);

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Daily Analytics</h2>
          <p className="text-muted-foreground flex items-center gap-2 mt-1">
            <Calendar className="w-4 h-4" />
            {format(date, 'EEEE, MMMM d, yyyy')}
          </p>
        </div>
        <div className="h-14 w-14 rounded-2xl gradient-primary flex items-center justify-center shadow-glow">
          <TrendingUp className="w-7 h-7 text-primary-foreground" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Time', value: formatDuration(stats.totalMinutes), icon: Clock, color: 'from-primary to-purple-500' },
          { label: 'Activities', value: stats.activityCount.toString(), icon: ActivityIcon, color: 'from-accent to-teal-400' },
          { label: 'Completion', value: `${stats.completionPercent}%`, icon: TrendingUp, color: 'from-amber-500 to-orange-500' },
          { label: 'Top Category', value: stats.pieData[0]?.name || 'N/A', icon: Calendar, color: 'from-rose-500 to-pink-500' },
        ].map((stat, i) => (
          <div
            key={stat.label}
            className="bg-card rounded-2xl p-5 border border-border hover:shadow-lg transition-all duration-300 animate-fade-in-up"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon className="w-5 h-5 text-primary-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="text-xl font-bold text-foreground mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-card rounded-2xl p-6 border border-border">
          <h3 className="font-semibold text-foreground mb-4">Time by Category</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {stats.pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => formatDuration(value)}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px',
                    padding: '12px',
                  }}
                />
                <Legend
                  formatter={(value) => <span className="text-foreground text-sm">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-card rounded-2xl p-6 border border-border">
          <h3 className="font-semibold text-foreground mb-4">Top Activities</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.barData} layout="vertical">
                <XAxis type="number" tickFormatter={(v) => `${v}m`} />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  width={100}
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                />
                <Tooltip
                  formatter={(value: number) => formatDuration(value)}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px',
                    padding: '12px',
                  }}
                />
                <Bar 
                  dataKey="duration" 
                  radius={[0, 6, 6, 0]}
                >
                  {stats.barData.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-card rounded-2xl p-6 border border-border">
        <h3 className="font-semibold text-foreground mb-4">Category Breakdown</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {(Object.keys(CATEGORY_LABELS) as ActivityCategory[]).map((category) => {
            const minutes = stats.categoryTotals[category];
            const percentage = stats.totalMinutes > 0 ? Math.round((minutes / stats.totalMinutes) * 100) : 0;
            
            return (
              <div
                key={category}
                className="p-4 rounded-xl border border-border hover:shadow-md transition-all duration-200"
                style={{ backgroundColor: `${CATEGORY_COLORS[category]}10` }}
              >
                <div className="text-2xl mb-2">
                  {category === 'work' && '💼'}
                  {category === 'sleep' && '😴'}
                  {category === 'exercise' && '🏃'}
                  {category === 'study' && '📚'}
                  {category === 'entertainment' && '🎮'}
                  {category === 'other' && '📌'}
                </div>
                <p className="font-medium text-foreground">{CATEGORY_LABELS[category]}</p>
                <p className="text-sm text-muted-foreground">{formatDuration(minutes)}</p>
                <div className="mt-2 h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      width: `${percentage}%`,
                      backgroundColor: CATEGORY_COLORS[category]
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
