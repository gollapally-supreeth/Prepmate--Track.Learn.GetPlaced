
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import StatsCard from '@/components/StatsCard';
import TaskCard from '@/components/TaskCard';
import ProgressChart from '@/components/ProgressChart';
import RecentActivity from '@/components/RecentActivity';
import ExamCountdown from '@/components/ExamCountdown';
import {
  Award,
  Book,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  Code,
  FileCheck,
  Graduation,
  LineChart,
  ListChecks,
  MessageSquare,
  Pen,
  Plus,
  Star,
  Target,
  User
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Data for various sections
  const taskData = [
    { 
      id: '1',
      title: 'Complete DSA Assignment',
      dueTime: '11:59 PM',
      subject: 'Data Structures',
      priority: 'High' as const,
      completed: false,
      onComplete: () => console.log('Task 1 completed')
    },
    { 
      id: '2',
      title: 'Review Binary Tree Notes',
      dueTime: '3:30 PM',
      subject: 'Data Structures',
      priority: 'Medium' as const,
      completed: false,
      onComplete: () => console.log('Task 2 completed')
    },
    { 
      id: '3',
      title: 'Practice Interview Questions',
      dueTime: '6:00 PM',
      subject: 'Interview Prep',
      priority: 'High' as const,
      completed: false,
      onComplete: () => console.log('Task 3 completed')
    },
    { 
      id: '4',
      title: 'Update Resume',
      dueTime: '4:15 PM',
      subject: 'Career Prep',
      priority: 'Medium' as const,
      completed: true,
      onComplete: () => console.log('Task 4 completed')
    },
    { 
      id: '5',
      title: 'Check Study Group Updates',
      dueTime: '12:30 PM',
      subject: 'General',
      priority: 'Low' as const,
      completed: false,
      onComplete: () => console.log('Task 5 completed')
    },
  ];

  const exams = [
    { 
      examName: 'Data Structures Midterm', 
      examDate: '2025-05-15', 
      daysLeft: 22 
    },
    { 
      examName: 'Algorithms Final', 
      examDate: '2025-06-10', 
      daysLeft: 48 
    },
    { 
      examName: 'Technical Interview (Google)', 
      examDate: '2025-05-05', 
      daysLeft: 12 
    }
  ];

  const stats = [
    {
      title: 'Total Study Hours',
      value: '32.5h',
      trend: 12,
      color: 'blue',
      icon: <Clock className="h-4 w-4 text-blue-600" />
    },
    {
      title: 'Problems Solved',
      value: '124',
      trend: 8,
      color: 'purple',
      icon: <Code className="h-4 w-4 text-purple-600" />
    },
    {
      title: 'Completion Rate',
      value: '85%',
      trend: -3,
      color: 'orange',
      icon: <CheckCircle className="h-4 w-4 text-orange-600" />
    },
    {
      title: 'Mock Interviews',
      value: '7',
      trend: 20,
      color: 'green',
      icon: <MessageSquare className="h-4 w-4 text-green-600" />
    }
  ];

  return (
    <div className="animate-fade-in container py-4 space-y-6 max-w-screen-xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, Pardhu! Track your progress and stay organized.
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => navigate('/planner')}
          >
            <Calendar className="h-4 w-4" />
            View Planner
          </Button>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Task
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full" 
        onValueChange={(value) => setActiveTab(value)}
      >
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tasks">Tasks & Assignments</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, index) => (
              <StatsCard
                key={index}
                title={stat.title}
                value={stat.value}
                trend={stat.trend}
                color={stat.color}
                icon={stat.icon}
              />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Tasks for Today */}
            <Card className="lg:col-span-2">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Today's Tasks</h3>
                  <Button variant="ghost" size="sm" onClick={() => navigate('/planner')}>
                    View All
                  </Button>
                </div>
                <div className="space-y-3">
                  {taskData.slice(0, 4).map((task) => (
                    <TaskCard
                      key={task.id}
                      id={task.id}
                      title={task.title}
                      dueTime={task.dueTime}
                      subject={task.subject}
                      priority={task.priority}
                      completed={task.completed}
                      onComplete={task.onComplete}
                    />
                  ))}
                </div>
              </div>
            </Card>

            {/* Right Column - Upcoming Exams and Progress */}
            <div className="flex flex-col gap-6">
              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-medium mb-4">Upcoming Exams</h3>
                  <div className="space-y-4">
                    {exams.map((exam, index) => (
                      <ExamCountdown 
                        key={index} 
                        examName={exam.examName} 
                        examDate={exam.examDate} 
                        daysLeft={exam.daysLeft} 
                      />
                    ))}
                  </div>
                </div>
              </Card>

              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-medium mb-4">Weekly Progress</h3>
                  <div className="h-40 w-full">
                    <ProgressChart />
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="mt-6">
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-medium mb-4">Recent Activities</h3>
                <RecentActivity />
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <Card className="lg:col-span-8">
              <div className="p-6">
                <h3 className="text-lg font-medium mb-4">All Tasks</h3>
                <div className="space-y-3">
                  {taskData.map((task) => (
                    <TaskCard
                      key={task.id}
                      id={task.id}
                      title={task.title}
                      dueTime={task.dueTime}
                      subject={task.subject}
                      priority={task.priority}
                      completed={task.completed}
                      onComplete={task.onComplete}
                    />
                  ))}
                </div>
              </div>
            </Card>
            <Card className="lg:col-span-4">
              <div className="p-6">
                <h3 className="text-lg font-medium mb-4">Task Statistics</h3>
                <div className="space-y-4">
                  <div className="bg-muted rounded-lg p-3">
                    <p className="text-sm text-muted-foreground">Completion Rate</p>
                    <div className="flex items-center justify-between">
                      <p className="text-2xl font-bold">85%</p>
                      <div className="text-sm text-green-600 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                        +12%
                      </div>
                    </div>
                  </div>
                  <div className="bg-muted rounded-lg p-3">
                    <p className="text-sm text-muted-foreground">Tasks Due Today</p>
                    <p className="text-2xl font-bold">5</p>
                  </div>
                  <div className="bg-muted rounded-lg p-3">
                    <p className="text-sm text-muted-foreground">Completed This Week</p>
                    <p className="text-2xl font-bold">23</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Additional tabs content here */}
        <TabsContent value="progress" className="animate-fade-in">
          {/* Progress tab content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-medium mb-4">Weekly Progress</h3>
                <div className="h-64 w-full">
                  <ProgressChart />
                </div>
              </div>
            </Card>
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-medium mb-4">Performance Metrics</h3>
                <div className="space-y-3">
                  <div className="bg-muted rounded-lg p-3">
                    <p className="text-sm text-muted-foreground">DSA Problems Solved</p>
                    <div className="flex items-center justify-between">
                      <p className="text-2xl font-bold">124</p>
                      <p className="text-sm text-green-600">+8% this week</p>
                    </div>
                  </div>
                  <div className="bg-muted rounded-lg p-3">
                    <p className="text-sm text-muted-foreground">Study Hours</p>
                    <div className="flex items-center justify-between">
                      <p className="text-2xl font-bold">32.5</p>
                      <p className="text-sm text-green-600">+4.5 hours</p>
                    </div>
                  </div>
                  <div className="bg-muted rounded-lg p-3">
                    <p className="text-sm text-muted-foreground">Mock Interviews</p>
                    <div className="flex items-center justify-between">
                      <p className="text-2xl font-bold">7</p>
                      <p className="text-sm text-green-600">+2 this week</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="resources" className="animate-fade-in">
          {/* Resources tab content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <div className="p-6">
                <h3 className="text-lg font-medium mb-4">Recent Resources</h3>
                {/* Recent resources list */}
                <div className="space-y-3">
                  <div className="flex items-center p-3 rounded-lg border">
                    <div className="bg-blue-100 p-2 rounded-md mr-3">
                      <Book className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Introduction to Dynamic Programming</p>
                      <p className="text-sm text-muted-foreground">PDF • Added 2 days ago</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 rounded-lg border">
                    <div className="bg-purple-100 p-2 rounded-md mr-3">
                      <Code className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium">Binary Tree Implementation</p>
                      <p className="text-sm text-muted-foreground">Code • Added 3 days ago</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 rounded-lg border">
                    <div className="bg-amber-100 p-2 rounded-md mr-3">
                      <FileCheck className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-medium">Resume Template - Software Engineer</p>
                      <p className="text-sm text-muted-foreground">Document • Added 1 week ago</p>
                    </div>
                  </div>
                </div>
                <Button className="w-full mt-3" variant="outline">View All Resources</Button>
              </div>
            </Card>
            
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-medium mb-4">Recommended</h3>
                {/* Recommended resources */}
                <div className="space-y-3">
                  <div className="p-3 rounded-lg border bg-blue-50/50 border-blue-100">
                    <div className="flex items-center mb-2">
                      <Award className="h-4 w-4 text-blue-600 mr-2" />
                      <p className="text-sm font-medium text-blue-900">Top Recommendation</p>
                    </div>
                    <p className="font-medium">Graph Algorithms Masterclass</p>
                    <p className="text-sm text-muted-foreground">Based on your study patterns</p>
                  </div>
                  
                  <div className="p-3 rounded-lg border">
                    <p className="font-medium">LeetCode Contest Preparation</p>
                    <p className="text-sm text-muted-foreground">14 problems with solutions</p>
                  </div>
                  
                  <div className="p-3 rounded-lg border">
                    <p className="font-medium">System Design Interview Tips</p>
                    <p className="text-sm text-muted-foreground">Video • 45 minutes</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
