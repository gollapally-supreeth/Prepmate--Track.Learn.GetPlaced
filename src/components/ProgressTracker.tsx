
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookMarked, 
  Code, 
  BrainCircuit, 
  Calculator, 
  FileText, 
  Flame, 
  Award, 
  LineChart,
  Clock,
  Trophy
} from 'lucide-react';

// Mock data for the progress tracker
const skillCategories = [
  { 
    id: 'dsa', 
    name: 'DSA', 
    icon: Code, 
    progress: 65,
    color: 'bg-primary',
    tasks: 45,
    totalTasks: 70,
    milestones: [
      { id: 1, title: 'Completed 50 DSA Questions', achieved: false, progress: 45, total: 50 },
      { id: 2, title: 'Mastered Arrays & Strings', achieved: true },
      { id: 3, title: 'Finished Graph Algorithms', achieved: false, progress: 3, total: 5 },
    ] 
  },
  { 
    id: 'webdev', 
    name: 'Web Dev', 
    icon: BookMarked, 
    progress: 80,
    color: 'bg-blue-500',
    tasks: 24,
    totalTasks: 30,
    milestones: [
      { id: 1, title: 'Built 3 Web Projects', achieved: true },
      { id: 2, title: 'Learned React Hooks', achieved: true },
      { id: 3, title: 'Mastered Backend Development', achieved: false, progress: 70, total: 100 },
    ] 
  },
  { 
    id: 'aiml', 
    name: 'AI/ML', 
    icon: BrainCircuit, 
    progress: 40, 
    color: 'bg-purple-500',
    tasks: 20,
    totalTasks: 50,
    milestones: [
      { id: 1, title: 'Completed ML Fundamentals', achieved: true },
      { id: 2, title: 'Built a Neural Network', achieved: false, progress: 1, total: 3 },
      { id: 3, title: 'Implemented 5 ML Models', achieved: false, progress: 2, total: 5 },
    ] 
  },
  { 
    id: 'aptitude', 
    name: 'Aptitude', 
    icon: Calculator, 
    progress: 75, 
    color: 'bg-green-500',
    tasks: 60,
    totalTasks: 80,
    milestones: [
      { id: 1, title: 'Mastered Quantitative Aptitude', achieved: false, progress: 75, total: 100 },
      { id: 2, title: 'Completed Logical Reasoning', achieved: true },
      { id: 3, title: 'Finished Verbal Ability', achieved: true },
    ] 
  },
  { 
    id: 'system_design', 
    name: 'System Design', 
    icon: FileText, 
    progress: 30, 
    color: 'bg-yellow-500',
    tasks: 12,
    totalTasks: 40,
    milestones: [
      { id: 1, title: 'Learned Scalable Systems', achieved: false, progress: 30, total: 100 },
      { id: 2, title: 'Designed Database Architecture', achieved: false, progress: 50, total: 100 },
      { id: 3, title: 'Implemented Microservices', achieved: false, progress: 10, total: 100 },
    ] 
  }
];

const weeklyActivity = [
  { day: 'Mon', hours: 2 },
  { day: 'Tue', hours: 3 },
  { day: 'Wed', hours: 1.5 },
  { day: 'Thu', hours: 4 },
  { day: 'Fri', hours: 2.5 },
  { day: 'Sat', hours: 5 },
  { day: 'Sun', hours: 3 }
];

const completionHistory = [
  { date: 'April 19, 2025', activity: 'Solved 3 Leetcode questions', category: 'DSA' },
  { date: 'April 18, 2025', activity: 'Completed React hooks tutorial', category: 'Web Dev' },
  { date: 'April 17, 2025', activity: 'Practiced aptitude problems', category: 'Aptitude' },
  { date: 'April 16, 2025', activity: 'Started ML course', category: 'AI/ML' },
  { date: 'April 15, 2025', activity: 'Reviewed system design patterns', category: 'System Design' }
];

const recommendations = [
  { text: "You're 80% done with Web Dev - complete these 2 projects to master it", category: 'Web Dev' },
  { text: "Try these 5 array problems to improve your DSA skills", category: 'DSA' },
  { text: "Your aptitude score is good, but practice more on time & work", category: 'Aptitude' }
];

interface ProgressTrackerProps {
  subjects?: {
    subject: string;
    completion: number;
  }[];
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ subjects = skillCategories.map(cat => ({ subject: cat.name, completion: cat.progress })) }) => {
  const [activeCategory, setActiveCategory] = useState('dsa');
  const currentCategory = skillCategories.find(cat => cat.id === activeCategory) || skillCategories[0];
  const streak = 7; // Mock data for streak

  return (
    <div className="progress-tracker space-y-6">
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <Card className="w-full md:w-2/3">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <LineChart className="h-5 w-5 text-primary" />
              Preparation Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="dsa" className="w-full" onValueChange={setActiveCategory}>
              <TabsList className="grid grid-cols-3 md:grid-cols-5 mb-4">
                {skillCategories.map(category => (
                  <TabsTrigger 
                    key={category.id} 
                    value={category.id}
                    className="text-xs md:text-sm"
                  >
                    <category.icon className="h-4 w-4 mr-1" />
                    <span className="hidden md:inline">{category.name}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {skillCategories.map(category => (
                <TabsContent key={category.id} value={category.id} className="space-y-4">
                  <div className="flex justify-between items-end">
                    <h3 className="text-lg font-medium">{category.name} Progress</h3>
                    <span className="text-sm font-medium">{category.progress}%</span>
                  </div>
                  <Progress value={category.progress} className={`h-2 ${category.color}`} />
                  
                  <div className="mt-4 space-y-2">
                    <h4 className="text-sm font-medium">Tasks Completed</h4>
                    <p className="text-lg font-bold">{category.tasks}/{category.totalTasks}</p>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        <Card className="w-full md:w-1/3">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Learning Streaks
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-3 rounded-full">
                <Flame className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current Streak</p>
                <p className="text-2xl font-bold">{streak} days</p>
              </div>
            </div>
            
            <div className="space-y-2 mt-4">
              <h4 className="text-sm font-medium">Weekly Stats</h4>
              <div className="flex items-end gap-1 h-20">
                {weeklyActivity.map((day, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-primary rounded-sm" 
                      style={{ height: `${(day.hours/5)*100}%` }}
                    ></div>
                    <span className="text-xs mt-1">{day.day}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-3 mt-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                20 hours this week
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Milestones & Goals */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              Milestones & Goals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentCategory.milestones.map(milestone => (
                <div key={milestone.id} className="flex items-start gap-3">
                  <div className={`mt-1 h-5 w-5 rounded-full flex items-center justify-center ${milestone.achieved ? 'bg-primary' : 'bg-muted'}`}>
                    {milestone.achieved && <Award className="h-3 w-3 text-white" />}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${milestone.achieved ? 'text-primary' : ''}`}>
                      {milestone.title}
                      {milestone.achieved && <Badge className="ml-2 bg-primary/20 text-primary text-xs">Completed</Badge>}
                    </p>
                    {!milestone.achieved && milestone.progress && (
                      <div className="mt-1">
                        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary" 
                            style={{ width: `${(milestone.progress/milestone.total)*100}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {milestone.progress}/{milestone.total} completed
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Task Completion History */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {completionHistory.map((item, idx) => (
                <div key={idx} className="flex gap-4 items-start">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.activity}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">{item.category}</Badge>
                      <span className="text-xs text-muted-foreground">{item.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Smart Recommendations */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <BrainCircuit className="h-5 w-5 text-primary" />
            Smart Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendations.map((rec, idx) => (
              <Card key={idx} className="bg-muted/50">
                <CardContent className="p-4">
                  <Badge className="mb-2">{rec.category}</Badge>
                  <p className="text-sm">{rec.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Fix: Adding named export to fix module import issue
export { ProgressTracker };
export default ProgressTracker;
