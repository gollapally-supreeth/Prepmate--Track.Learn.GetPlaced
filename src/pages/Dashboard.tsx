import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CalendarIcon, CheckCircle2, Circle, Star } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface Task {
  id: string;
  title: string;
  dueTime: string;
  subject: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
}

const TaskCard: React.FC<Task> = ({ id, title, dueTime, subject, priority, completed, onComplete }) => {
  return (
    <Card className="shadow-sm border-none">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground">
          <CalendarIcon className="mr-2 h-4 w-4 inline-block" />
          <span>{dueTime}</span>
        </div>
        <div className="text-sm text-muted-foreground">Subject: {subject}</div>
        <div className="flex items-center mt-2">
          Priority:
          <Badge variant="secondary" className="ml-2">
            {priority}
          </Badge>
        </div>
        <button
          onClick={onComplete}
          className="mt-4 w-full bg-primary text-primary-foreground rounded-md py-2 text-sm font-medium hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
        >
          Mark as Complete
        </button>
      </CardContent>
    </Card>
  );
};

const Dashboard: React.FC = () => {
  const upcomingTasks: Task[] = [
    {
      id: '1',
      title: 'Prepare Presentation',
      dueTime: '10:00 AM',
      subject: 'Marketing',
      priority: 'high',
      completed: false,
    },
    {
      id: '2',
      title: 'Meeting with Team',
      dueTime: '11:30 AM',
      subject: 'Project Management',
      priority: 'medium',
      completed: false,
    },
    {
      id: '3',
      title: 'Review Code',
      dueTime: '2:00 PM',
      subject: 'Software Development',
      priority: 'high',
      completed: false,
    },
  ];

  const mockProgressData = [
    { label: 'DSA', value: 70 },
    { label: 'System Design', value: 40 },
    { label: 'Frontend', value: 80 },
  ];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Overview Section */}
        <Card className="bg-white shadow-md rounded-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Overview</CardTitle>
            <CardDescription>Quick summary of your progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Total Tasks</span>
                <Badge variant="secondary">15</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Completed Tasks</span>
                <Badge variant="outline">10</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Pending Tasks</span>
                <Badge variant="destructive">5</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Tracker Section */}
        <Card className="bg-white shadow-md rounded-md md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Progress Tracker</CardTitle>
            <CardDescription>Track your progress in different areas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockProgressData.map((item) => (
              <div key={item.label} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.label}</span>
                  <span className="text-sm text-muted-foreground">{item.value}%</span>
                </div>
                <Progress value={item.value} />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Tasks Section */}
        <Card className="bg-white shadow-md rounded-md lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Upcoming Tasks</CardTitle>
            <CardDescription>Your tasks for today</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingTasks.map((task, index) => (
              <TaskCard
                key={index}
                id={`task-${index}`}
                title={task.title}
                dueTime={task.dueTime}
                subject={task.subject}
                priority={task.priority}
                completed={task.completed}
                onComplete={() => {}}
              />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
