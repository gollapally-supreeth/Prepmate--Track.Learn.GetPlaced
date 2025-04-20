
import React from 'react';
import { useFocusTimer } from './FocusTimerContext';
import { cn } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  CartesianGrid,
  Cell,
} from 'recharts';

interface StatsDisplayProps {
  className?: string;
}

export function StatsDisplay({ className }: StatsDisplayProps) {
  const { state, formatTime } = useFocusTimer();
  const { stats, goals } = state;
  
  // Calculate percentage of daily goal completed
  const dailyProgress = Math.min(100, (stats.todayFocusTime / (goals.dailyFocusTime * 60)) * 100);
  
  // Calculate percentage of weekly goal completed
  const weeklyProgress = Math.min(100, (stats.todaySessions / goals.dailySessions) * 100);
  
  // Prepare data for weekly chart
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date().getDay();
  
  const weeklyChartData = stats.weeklyData.map((value, index) => ({
    name: daysOfWeek[index],
    minutes: Math.round(value / 60),
    isToday: index === today
  }));
  
  const chartStyle = {
    fontSize: '10px',
  };
  
  const todayFocusHours = Math.floor(stats.todayFocusTime / 3600);
  const todayFocusMinutes = Math.floor((stats.todayFocusTime % 3600) / 60);
  const formattedTodayFocus = `${todayFocusHours}h ${todayFocusMinutes}m`;
  
  const totalFocusHours = Math.floor(stats.totalFocusTime / 3600);
  const totalFocusMinutes = Math.floor((stats.totalFocusTime % 3600) / 60);
  const formattedTotalFocus = `${totalFocusHours}h ${totalFocusMinutes}m`;
  
  return (
    <div className={cn("space-y-4", className)}>
      <h2 className="text-lg font-semibold">Focus Statistics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Today's Focus Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md">Today's Focus</CardTitle>
            <CardDescription>Progress toward your daily goal</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-1">
              <span className="text-muted-foreground text-sm">
                {formattedTodayFocus} / {goals.dailyFocusTime}m
              </span>
              <span className="text-sm font-medium">{Math.round(dailyProgress)}%</span>
            </div>
            <Progress value={dailyProgress} className="h-2" />
            
            <div className="flex items-center justify-between mt-4">
              <div className="text-center flex-1">
                <p className="text-xs text-muted-foreground">Sessions</p>
                <p className="text-lg font-semibold">{stats.todaySessions}</p>
              </div>
              <div className="text-center flex-1">
                <p className="text-xs text-muted-foreground">Tasks Done</p>
                <p className="text-lg font-semibold">{stats.completedTasks}</p>
              </div>
              <div className="text-center flex-1">
                <p className="text-xs text-muted-foreground">Streak</p>
                <p className="text-lg font-semibold">{stats.streak} days</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Weekly Activity Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md">Weekly Activity</CardTitle>
            <CardDescription>Your focus time for the week</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[140px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={weeklyChartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  style={chartStyle}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#666" opacity={0.2} />
                  <XAxis dataKey="name" tick={chartStyle} axisLine={false} tickLine={false} />
                  <YAxis tick={chartStyle} axisLine={false} tickLine={false} />
                  <RechartsTooltip 
                    formatter={(value: number) => [`${value} min`, 'Focus Time']}
                    labelFormatter={(label) => `${label}`}
                    contentStyle={{ fontSize: '12px' }}
                  />
                  <Bar dataKey="minutes" fill="var(--primary)" radius={[4, 4, 0, 0]}>
                    {weeklyChartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.isToday ? 'var(--focus-purple)' : 'var(--primary)'} 
                        opacity={entry.isToday ? 1 : 0.7}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-4 text-center">
          <p className="text-3xl font-bold">{formattedTotalFocus}</p>
          <p className="text-xs text-muted-foreground mt-1">Total Focus Time</p>
        </Card>
        
        <Card className="p-4 text-center">
          <p className="text-3xl font-bold">{stats.totalSessions}</p>
          <p className="text-xs text-muted-foreground mt-1">Total Sessions</p>
        </Card>
        
        <Card className="p-4 text-center">
          <p className="text-3xl font-bold">{Math.floor(stats.totalSessions / stats.completedTasks || 1)}</p>
          <p className="text-xs text-muted-foreground mt-1">Sessions per Task</p>
        </Card>
      </div>
    </div>
  );
}
