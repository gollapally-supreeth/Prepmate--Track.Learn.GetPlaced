
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatsCard } from '@/components/StatsCard';
import { TaskCard } from '@/components/TaskCard';
import { CalendarCheck, Clock, Target, BookOpen, LineChart, Brain, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ExamCountdown } from '@/components/ExamCountdown';
import ProgressTracker from '@/components/ProgressTracker';

// Sample data for upcoming exams/deadlines
const upcomingExams = [
  { key: '1', name: 'Google Online Assessment', date: 'May 15, 2025', course: 'DSA' },
  { key: '2', name: 'Microsoft Interview Round 1', date: 'May 22, 2025', course: 'System Design' },
  { key: '3', name: 'Amazon Final Round', date: 'June 5, 2025', course: 'Behavioral' }
];

const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight gradient-heading">Welcome back, Pardhu</h1>
        <p className="text-muted-foreground mt-1">Here's an overview of your progress and upcoming tasks.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Study Time"
          value="12h 30m"
          description="This week"
          trend={+15}
          icon={<Clock className="h-5 w-5 text-primary" />}
          color="bg-primary/15"
        />
        <StatsCard
          title="Tasks Completed"
          value="24/30"
          description="80% completion"
          trend={+5}
          icon={<CheckCircle2 className="h-5 w-5 text-emerald-500" />}
          color="bg-emerald-500/15"
        />
        <StatsCard
          title="Topics Covered"
          value="18"
          description="This month"
          trend={+8}
          icon={<BookOpen className="h-5 w-5 text-amber-500" />}
          color="bg-amber-500/15"
        />
        <StatsCard
          title="Mock Interviews"
          value="5"
          description="This month"
          trend={0}
          icon={<Target className="h-5 w-5 text-blue-500" />}
          color="bg-blue-500/15"
        />
      </div>

      {/* Progress Tracker */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
        {/* Progress Cards */}
        <Card className="col-span-1 card-enhanced">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              Learning Progress
            </CardTitle>
            <CardDescription>Your subject mastery</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Data Structures</span>
                <span className="font-medium">78%</span>
              </div>
              <Progress className="h-2" value={78} />
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Algorithms</span>
                <span className="font-medium">65%</span>
              </div>
              <Progress className="h-2" value={65} />
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>System Design</span>
                <span className="font-medium">42%</span>
              </div>
              <Progress className="h-2" value={42} />
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Database Management</span>
                <span className="font-medium">50%</span>
              </div>
              <Progress className="h-2" value={50} />
            </div>
            
            <Button variant="outline" size="sm" className="w-full mt-2">
              View All Subjects
            </Button>
          </CardContent>
        </Card>
        
        {/* Upcoming Tasks */}
        <Card className="col-span-1 card-enhanced">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  <CalendarCheck className="h-5 w-5 text-primary" />
                  Today's Tasks
                </CardTitle>
                <CardDescription>Your schedule for today</CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Add Task</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Task</DialogTitle>
                    <DialogDescription>Create a new task for your study schedule</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="task-name">Task Name</Label>
                      <Input id="task-name" placeholder="Enter task name" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="task-description">Description</Label>
                      <Textarea id="task-description" placeholder="Enter task description" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor="due-date">Due Date</Label>
                        <Input id="due-date" type="date" />
                      </div>
                      <div>
                        <Label htmlFor="priority">Priority</Label>
                        <select id="priority" className="w-full border border-input bg-background px-3 py-2 text-sm rounded-md">
                          <option>Low</option>
                          <option>Medium</option>
                          <option>High</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button>Save Task</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <TaskCard 
              title="Review Graph Algorithms"
              description="BFS, DFS, Dijkstra's Algorithm"
              status="in-progress"
              dueTime="2:00 PM"
              priority="high"
            />
            
            <TaskCard 
              title="Solve LeetCode Problems"
              description="5 medium difficulty problems"
              status="not-started"
              dueTime="4:00 PM"
              priority="medium"
            />
            
            <TaskCard 
              title="Watch System Design Lecture"
              description="Distributed Systems Fundamentals"
              status="completed"
              dueTime="10:00 AM"
              priority="medium"
            />
            
            <TaskCard 
              title="Prepare for Mock Interview"
              description="Review common behavioral questions"
              status="not-started"
              dueTime="7:00 PM"
              priority="high"
            />
            
            <Button variant="outline" size="sm" className="w-full mt-2">
              View All Tasks
            </Button>
          </CardContent>
        </Card>
        
        {/* Upcoming Exams */}
        <Card className="col-span-1 card-enhanced">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Upcoming Exams
            </CardTitle>
            <CardDescription>Prepare for these first</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingExams.map((exam) => (
              <ExamCountdown key={exam.key} examName={exam.name} examDate={exam.date} courseName={exam.course} />
            ))}
            
            <Button variant="outline" size="sm" className="w-full mt-2">
              View All Exams
            </Button>
          </CardContent>
        </Card>
      </div>
      
      {/* Activity and Progress Tabs */}
      <div className="grid grid-cols-1 gap-4">
        <Card className="w-full card-enhanced">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl flex items-center gap-2">
              <LineChart className="h-5 w-5 text-primary" />
              Performance Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="activity">
              <TabsList className="mb-4 w-full">
                <TabsTrigger value="activity" className="flex-1">Recent Activity</TabsTrigger>
                <TabsTrigger value="progress" className="flex-1">Progress Analysis</TabsTrigger>
                <TabsTrigger value="suggestions" className="flex-1">Suggestions</TabsTrigger>
              </TabsList>
              
              <TabsContent value="activity" className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/15 p-3 rounded-full">
                      <Target className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <h4 className="font-medium">Completed Mock Test: DSA Arrays & Strings</h4>
                        <Badge>85%</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">You scored better than 70% of test takers</p>
                      <p className="text-xs text-muted-foreground mt-1">Today at 10:32 AM</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="bg-emerald-500/15 p-3 rounded-full">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <h4 className="font-medium">Completed System Design Chapter 4</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">You've reached 42% completion of the course</p>
                      <p className="text-xs text-muted-foreground mt-1">Yesterday at 4:15 PM</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-500/15 p-3 rounded-full">
                      <BookOpen className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <h4 className="font-medium">Saved 3 new resources</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">Interview preparation materials from Google</p>
                      <p className="text-xs text-muted-foreground mt-1">Yesterday at 2:45 PM</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="progress" className="h-80">
                <ProgressTracker />
              </TabsContent>
              
              <TabsContent value="suggestions" className="space-y-4">
                <div className="rounded-lg border bg-accent/50 p-4">
                  <h4 className="font-medium mb-2">Recommended Next Steps</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      Complete more problems on graph algorithms
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      Schedule a mock interview focusing on system design
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      Review feedback from previous mock tests
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      Start the advanced database course
                    </li>
                  </ul>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
