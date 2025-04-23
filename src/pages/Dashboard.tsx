import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { StatsCard } from '@/components/StatsCard';
import { TaskCard } from '@/components/TaskCard';
import { ProgressChart } from '@/components/ProgressChart';
import { RecentActivity } from '@/components/RecentActivity';
import { ExamCountdown } from '@/components/ExamCountdown';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  CalendarCheck, 
  Clock, 
  Code, 
  FileText, 
  LayoutDashboard, 
  LineChart, 
  MessageSquare, 
  GraduationCap, 
  Lightbulb, 
  ListChecks,
  BookOpen,
  ArrowRight
} from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="container space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Track your progress and stay on top of your goals.</p>
        </div>
        <Button>
          <CalendarCheck className="mr-2 h-4 w-4" />
          View Planner
        </Button>
      </div>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <StatsCard
          title="Total Study Hours"
          value="147h"
          percentageIncrease="+12%"
          icon={Clock}
        />
        <StatsCard
          title="Completed Tasks"
          value="23/30"
          percentageIncrease="+8%"
          icon={ListChecks}
        />
        <StatsCard
          title="Resources Explored"
          value="85"
          percentageIncrease="+25%"
          icon={BookOpen}
        />
        <StatsCard
          title="Quizzes Passed"
          value="18/20"
          percentageIncrease="+5%"
          icon={Code}
        />
      </motion.div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div 
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Progress Overview</CardTitle>
              <CardDescription>Your learning journey so far.</CardDescription>
            </CardHeader>
            <CardContent>
              <ProgressChart />
            </CardContent>
            <CardFooter className="justify-between">
              <p className="text-sm text-muted-foreground">Updated 1 minute ago</p>
              <Button variant="outline" size="sm">View Full Report</Button>
            </CardFooter>
          </Card>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <ExamCountdown examDate="2024-05-15" examName="Data Structures Exam" />
        </motion.div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>What you've been up to.</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px] pr-2">
                <RecentActivity />
              </ScrollArea>
            </CardContent>
            <CardFooter className="justify-end">
              <Button variant="outline" size="sm">View All</Button>
            </CardFooter>
          </Card>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.8 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Today's Tasks</CardTitle>
              <CardDescription>Stay productive and achieve your goals.</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px] pr-2">
                <TaskCard />
              </ScrollArea>
            </CardContent>
            <CardFooter className="justify-between">
              <p className="text-sm text-muted-foreground">3 tasks remaining</p>
              <Button variant="outline" size="sm">Add Task</Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
