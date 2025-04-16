
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TaskCard } from '@/components/TaskCard';
import { ProgressCard } from '@/components/ProgressCard';
import { StatsCard } from '@/components/StatsCard';
import { ExamCountdown } from '@/components/ExamCountdown';
import { CalendarCheck, BookMarked, LineChart, Award, Clock, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold">Hey Pardhu, Ready to crush it today? 🚀</h1>
        <p className="text-muted-foreground mt-1">Let's make progress on your goals!</p>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Daily Streak"
          value="7 days"
          icon={<Flame size={24} className="text-primary" />}
          trend={5}
          trendLabel="vs last week"
        />
        <StatsCard
          title="Study Time Today"
          value="2h 15m"
          icon={<Clock size={24} className="text-focus-blue" />}
          trend={-10}
          trendLabel="vs yesterday"
        />
        <StatsCard
          title="Tasks Completed"
          value="8/12"
          icon={<CalendarCheck size={24} className="text-focus-green" />}
        />
        <StatsCard
          title="Overall Progress"
          value="68%"
          icon={<Award size={24} className="text-focus-yellow" />}
          trend={12}
          trendLabel="this week"
        />
      </div>
      
      {/* Upcoming Exams */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Upcoming Exams</h2>
          <Button variant="outline" size="sm">Add Exam</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ExamCountdown
            examName="Data Structures Mid-Term"
            date="May 5, 2025"
            daysLeft={12}
          />
          <ExamCountdown
            examName="Operating Systems Final"
            date="May 20, 2025"
            daysLeft={27}
          />
          <ExamCountdown
            examName="Web Development Project"
            date="June 10, 2025"
            daysLeft={48}
          />
        </div>
      </div>
      
      {/* Main Content Tabs */}
      <Tabs defaultValue="tasks">
        <TabsList className="grid grid-cols-3 w-full max-w-md mb-4">
          <TabsTrigger value="tasks" className="flex items-center gap-2">
            <CalendarCheck size={16} />
            <span>Today's Tasks</span>
          </TabsTrigger>
          <TabsTrigger value="resources" className="flex items-center gap-2">
            <BookMarked size={16} />
            <span>Resources</span>
          </TabsTrigger>
          <TabsTrigger value="progress" className="flex items-center gap-2">
            <LineChart size={16} />
            <span>Progress</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Tasks Tab */}
        <TabsContent value="tasks" className="mt-0">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Today's Priority Tasks</h3>
                <Button size="sm">Add Task</Button>
              </div>
              
              <div className="space-y-3">
                <TaskCard
                  title="Complete DSA Assignment #3"
                  dueTime="Today, 4:00 PM"
                  subject="CSE"
                  priority="High"
                />
                <TaskCard
                  title="Review OS Process Synchronization"
                  dueTime="Today, 6:00 PM"
                  subject="Operating Systems"
                  priority="Medium"
                />
                <TaskCard
                  title="Prepare for Technical Interview"
                  dueTime="Today, 8:00 PM"
                  subject="Placement Prep"
                  priority="High"
                />
                <TaskCard
                  title="Read Chapter 5 of Database Systems"
                  dueTime="Today, 2:00 PM"
                  subject="DBMS"
                  priority="Medium"
                  completed={true}
                />
              </div>
              
              <div className="mt-4 flex justify-center">
                <Button variant="outline" size="sm" className="w-full">
                  View All Tasks
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Resources Tab */}
        <TabsContent value="resources" className="mt-0">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Recently Added Resources</h3>
                <Button size="sm">Add Resource</Button>
              </div>
              
              <div className="space-y-3">
                <div className="bg-muted/30 rounded-lg p-4">
                  <h4 className="font-medium mb-2">DSA Mastery Course</h4>
                  <p className="text-sm text-muted-foreground mb-3">A comprehensive video series covering all Data Structure topics for interviews.</p>
                  <Button variant="outline" size="sm">Open Resource</Button>
                </div>
                
                <div className="bg-muted/30 rounded-lg p-4">
                  <h4 className="font-medium mb-2">Operating Systems Notes</h4>
                  <p className="text-sm text-muted-foreground mb-3">Complete compilation of OS concepts with diagrams and examples.</p>
                  <Button variant="outline" size="sm">Open Resource</Button>
                </div>
              </div>
              
              <div className="mt-4 flex justify-center">
                <Button variant="outline" size="sm" className="w-full">
                  View All Resources
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Progress Tab */}
        <TabsContent value="progress" className="mt-0">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Subject Progress</h3>
              
              <div className="space-y-3">
                <ProgressCard 
                  subject="Data Structures & Algorithms" 
                  progress={60} 
                  color="bg-focus-blue"
                />
                <ProgressCard 
                  subject="Web Development" 
                  progress={30} 
                  color="bg-focus-green"
                />
                <ProgressCard 
                  subject="Operating Systems" 
                  progress={90} 
                  color="bg-focus-purple"
                />
                <ProgressCard 
                  subject="Database Management" 
                  progress={45} 
                  color="bg-focus-yellow"
                />
              </div>
              
              <div className="mt-4 flex justify-center">
                <Button variant="outline" size="sm" className="w-full">
                  View Detailed Progress
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
