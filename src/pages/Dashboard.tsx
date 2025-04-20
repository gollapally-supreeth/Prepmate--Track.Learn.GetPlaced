
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { TaskCard } from "@/components/TaskCard";
import { StatsCard } from "@/components/StatsCard";
import { ExamCountdown } from "@/components/ExamCountdown";
import { ProgressCard } from "@/components/ProgressCard";
import { ProgressTracker } from "@/components/ProgressTracker";
import { PlannerTaskCard } from "@/components/PlannerTaskCard";
import { Clock, Calendar, BookOpen, GraduationCap } from 'lucide-react';

// Mock data for the dashboard
const mockExams = [
  {
    id: "1",
    name: "Data Structures & Algorithms Mid-term",
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    course: "Computer Science",
    timeRemaining: "5 days",
  },
  {
    id: "2",
    name: "Database Systems Final",
    date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000), // 12 days from now
    course: "Information Systems",
    timeRemaining: "12 days",
  },
];

const mockTasks = [
  {
    id: "1",
    title: "Complete DS&A Assignment 3",
    description: "Implement a Red-Black Tree",
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    priority: "High" as const,
    completed: false,
  },
  {
    id: "2",
    title: "Prepare Database ER Diagram",
    description: "For the student management system project",
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    priority: "Medium" as const,
    completed: false,
  },
  {
    id: "3",
    title: "Review Lecture Notes",
    description: "Topics: Normalizations and Transactions",
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    priority: "Low" as const,
    completed: true,
  },
];

const mockProgress = [
  { subject: "Data Structures", completion: 68 },
  { subject: "Algorithms", completion: 75 },
  { subject: "Database Systems", completion: 52 },
  { subject: "Computer Networks", completion: 30 },
];

const mockRecentActivities = [
  { name: "Submitted", value: 12 },
  { name: "Pending", value: 5 },
  { name: "Completed", value: 22 },
  { name: "Overdue", value: 2 },
];

// Helper functions
const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

const Dashboard = () => {
  const [currentTab, setCurrentTab] = useState("overview");
  const { toast } = useToast();
  
  // Define a state for managing the dialog
  const [addTaskDialogOpen, setAddTaskDialogOpen] = useState(false);

  // Function to handle task completion
  const handleCompleteTask = (id: string) => {
    toast({
      title: "Task marked as complete",
      description: `Task ID: ${id} has been completed.`,
    });
  };

  return (
    <motion.div
      className="container mx-auto py-6 space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-1 bg-primary rounded-full"></div>
          <h1 className="text-3xl font-bold gradient-heading">Dashboard</h1>
        </div>
        <Dialog open={addTaskDialogOpen} onOpenChange={setAddTaskDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Calendar className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* Add your task form components here */}
              <p className="text-center text-muted-foreground">Task form would go here</p>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="progress">My Progress</TabsTrigger>
          <TabsTrigger value="tasks">Tasks & Exams</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards Row */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Total Study Hours"
              value={127}
              description="Last 30 days"
              trend="up"
              trendValue="12%"
              icon={<Clock className="h-4 w-4 text-muted-foreground" />}
            />
            
            <StatsCard
              title="Active Courses"
              value={5}
              description="Currently enrolled"
              trend="same"
              icon={<BookOpen className="h-4 w-4 text-muted-foreground" />}
            />
            
            <StatsCard
              title="Upcoming Exams"
              value={3}
              description="Next 14 days"
              trend="up"
              trendValue="1"
              icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
            />
            
            <StatsCard
              title="Completion Rate"
              value={86}
              description="Assignments & quizzes"
              trend="up"
              trendValue="4%"
              icon={<GraduationCap className="h-4 w-4 text-muted-foreground" />}
            />
          </div>
          
          {/* Main Content Row */}
          <div className="grid gap-6 md:grid-cols-6">
            {/* Left column */}
            <div className="md:col-span-4 space-y-6">
              {/* Activity Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Your assignment and study task activities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={mockRecentActivities}>
                        <XAxis 
                          dataKey="name"
                          stroke="#888888"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          stroke="#888888"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(value) => `${value}`}
                        />
                        <Bar
                          dataKey="value"
                          radius={[4, 4, 0, 0]}
                          className="fill-primary"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              {/* Progress Tracker */}
              <ProgressTracker subjects={mockProgress} />
            </div>
            
            {/* Right column */}
            <div className="md:col-span-2 space-y-6">
              {/* Upcoming Exams */}
              <Card className="h-[215px]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Upcoming Exams</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[135px] px-4 py-2">
                    {mockExams.map((exam) => (
                      <ExamCountdown
                        key={exam.id}
                        name={exam.name}
                        date={exam.date.toISOString()}
                        course={exam.course}
                      />
                    ))}
                  </ScrollArea>
                </CardContent>
              </Card>
              
              {/* Course Progress */}
              <div className="grid grid-cols-2 gap-4">
                {mockProgress.slice(0, 2).map((subject, index) => (
                  <ProgressCard
                    key={index}
                    subject={subject.subject}
                    progress={subject.completion}
                  />
                ))}
              </div>
            </div>
          </div>
          
          {/* Bottom Row - Tasks */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Upcoming Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {mockTasks
                  .filter(task => !task.completed)
                  .slice(0, 3)
                  .map(task => (
                    <TaskCard
                      key={task.id}
                      id={task.id}
                      title={task.title}
                      description={task.description}
                      dueDate={task.dueDate}
                      priority={task.priority}
                      onComplete={() => handleCompleteTask(task.id)}
                    />
                  ))}
                  
                {mockTasks.filter(task => !task.completed).length === 0 && (
                  <div className="text-center p-4 text-muted-foreground">
                    No upcoming tasks. Great job!
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          {/* Progress tab content would go here */}
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold mb-2">Progress tracking details</h2>
            <p className="text-muted-foreground">
              This tab would show detailed progress tracking information
            </p>
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-6">
          {/* Tasks tab content would go here */}
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold mb-2">Tasks and Exams details</h2>
            <p className="text-muted-foreground">
              This tab would show detailed task and exam information
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default Dashboard;
