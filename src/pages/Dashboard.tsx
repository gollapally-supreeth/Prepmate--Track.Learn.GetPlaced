
import React, { useState } from 'react';
import { StatsCard } from '@/components/StatsCard';
import { ProgressCard } from '@/components/ProgressCard';
import { ProgressChart } from '@/components/ProgressChart';
import { TaskCard } from '@/components/TaskCard';
import { ExamCountdown } from '@/components/ExamCountdown';
import { RecentActivity } from '@/components/RecentActivity';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  LineChart, 
  Book, 
  User, 
  CheckCircle, 
  BookOpen, 
  CalendarClock, 
  BarChart3, 
  Target,
  FileCheck,
  FileText
} from 'lucide-react';
import { format } from 'date-fns';

const Dashboard = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  
  const handleDismissWelcome = () => {
    setShowWelcome(false);
  };
  
  const handleTaskComplete = (taskId: string) => {
    // In a real app, update tasks in state/database
    console.log(`Task ${taskId} completed`);
  };
  
  // Sample data for dashboard
  const examCountdowns = [
    { examName: "Google Online Assessment", date: "April 28, 2025", daysLeft: 4 },
    { examName: "Microsoft Technical Interview", date: "May 5, 2025", daysLeft: 11 },
    { examName: "Campus Placement Round 1", date: "May 15, 2025", daysLeft: 21 }
  ];
  
  const tasks = [
    {
      id: "task1",
      title: "Complete DSA module",
      priority: "high",
      dueDate: new Date(2025, 3, 30),
      completed: false,
    },
    {
      id: "task2",
      title: "Update resume with projects",
      priority: "medium",
      dueDate: new Date(2025, 3, 27),
      completed: false,
    },
    {
      id: "task3",
      title: "Schedule mock interview",
      priority: "low",
      dueDate: new Date(2025, 3, 29),
      completed: true,
    }
  ];
  
  const activities = [
    {
      id: "activity1",
      title: "Completed DSA Quiz",
      timestamp: new Date(2025, 3, 24, 14, 30),
      type: "quiz",
      resultType: "success",
    },
    {
      id: "activity2",
      title: "Reviewed Interview Tips",
      timestamp: new Date(2025, 3, 24, 11, 15),
      type: "resource",
    },
    {
      id: "activity3",
      title: "Mock Interview Practice",
      timestamp: new Date(2025, 3, 23, 16, 45),
      type: "interview",
      resultType: "partial",
    },
    {
      id: "activity4",
      title: "Resume Updated",
      timestamp: new Date(2025, 3, 23, 10, 0),
      type: "resume",
    }
  ];
  
  // Calculate streak
  const currentStreak = 7; // In a real app, would be calculated
  const longestStreak = 14;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page title */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here's an overview of your progress and upcoming tasks.
        </p>
      </div>
      
      {/* Welcome card (conditionally shown) */}
      {showWelcome && (
        <div className="bg-gradient-to-r from-violet-500 to-purple-600 text-white p-6 rounded-lg shadow-lg">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h3 className="text-xl font-medium">Welcome to PrepMate!</h3>
              <p className="opacity-90 max-w-lg">
                Your all-in-one platform for acing technical interviews and landing your dream job. 
                Use the AI assistant, organize your resources, and track your progress all in one place.
              </p>
              <Button 
                variant="secondary" 
                className="mt-2"
                onClick={() => window.location.href = '/resources'}
              >
                Explore Resources
              </Button>
            </div>
            <Button 
              variant="ghost" 
              className="text-white opacity-80 hover:opacity-100" 
              size="sm"
              onClick={handleDismissWelcome}
            >
              Dismiss
            </Button>
          </div>
        </div>
      )}
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Study Streak"
          value={`${currentStreak} days`}
          icon={<CheckCircle className="text-green-500" />}
          trend={2}
          description="vs last week"
        />
        <StatsCard
          title="Resources Viewed"
          value="24"
          icon={<BookOpen className="text-blue-500" />}
          trend={5}
          description="vs last week"
        />
        <StatsCard
          title="Practice Interviews"
          value="7"
          icon={<User className="text-purple-500" />}
          trend={1}
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => window.location.href = '/interview'}
        />
        <StatsCard
          title="Mock Tests"
          value="12"
          icon={<Target className="text-amber-500" />}
          trend={-2}
          description="vs last week"
        />
      </div>
      
      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Progress cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ProgressCard 
              percent={65}
              label="DSA Progress" 
              icon={<Book className="h-5 w-5 text-blue-600" />} 
            />
            <ProgressCard 
              percent={42}
              label="Interview Readiness" 
              icon={<User className="h-5 w-5 text-purple-600" />} 
            />
            <ProgressCard 
              percent={78}
              label="Resume Score" 
              icon={<FileCheck className="h-5 w-5 text-green-600" />} 
            />
          </div>
          
          {/* Progress chart */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium">Study Progress</h3>
                <p className="text-sm text-muted-foreground">Last 2 weeks study time</p>
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <Calendar className="h-4 w-4" />
                <span>April 2025</span>
              </Button>
            </div>
            <ProgressChart />
          </Card>
          
          {/* Recent activity */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Recent Activity</h3>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
            <RecentActivity activities={activities} />
          </Card>
        </div>
        
        {/* Right column */}
        <div className="space-y-6">
          {/* Calendar card */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <CalendarClock className="h-5 w-5 text-purple-600" />
                <span>Upcoming Exams</span>
              </h3>
            </div>
            <div className="space-y-3">
              {examCountdowns.map((exam, i) => (
                <ExamCountdown
                  key={i}
                  examName={exam.examName}
                  date={exam.date}
                  daysLeft={exam.daysLeft}
                />
              ))}
            </div>
          </Card>
          
          {/* Tasks card */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-indigo-600" />
                <span>Tasks</span>
              </h3>
              <Button size="sm">Add Task</Button>
            </div>
            <div className="space-y-3">
              {tasks.map(task => (
                <TaskCard 
                  key={task.id}
                  title={task.title}
                  dueTime={task.dueDate.toLocaleDateString()}
                  subject={task.priority === "high" ? "High" : task.priority === "medium" ? "Medium" : "Low"}
                  priority={task.priority === "high" ? "High" : task.priority === "medium" ? "Medium" : "Low"}
                  completed={task.completed}
                  id={parseInt(task.id.replace("task", ""))}
                  onComplete={() => handleTaskComplete(task.id)}
                />
              ))}
            </div>
          </Card>
          
          {/* Quick links card */}
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start gap-2" asChild>
                <a href="/resources">
                  <Book className="h-4 w-4" /> DSA Resources
                </a>
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2" asChild>
                <a href="/interview">
                  <User className="h-4 w-4" /> Interview Practice
                </a>
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2" asChild>
                <a href="/resume">
                  <FileText className="h-4 w-4" /> Resume Builder
                </a>
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2" asChild>
                <a href="/progress">
                  <BarChart3 className="h-4 w-4" /> Progress Tracker
                </a>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
