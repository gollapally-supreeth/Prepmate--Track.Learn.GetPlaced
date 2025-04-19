
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { CheckCircle, Circle, CheckCircle2, MessageSquare } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  category: string;
}

// Mock preparation tasks data
const preparationTasks: Task[] = [
  { id: '1', title: 'Research company culture & values', completed: true, category: 'HR' },
  { id: '2', title: 'Prepare answers for common behavioral questions', completed: true, category: 'HR' },
  { id: '3', title: 'Review resume and be ready to explain all items', completed: false, category: 'HR' },
  { id: '4', title: 'Practice array and string coding problems', completed: true, category: 'Technical' },
  { id: '5', title: 'Review time and space complexity analysis', completed: false, category: 'Technical' },
  { id: '6', title: 'Practice system design for chat application', completed: false, category: 'Technical' },
  { id: '7', title: 'Prepare questions to ask the interviewer', completed: true, category: 'General' },
  { id: '8', title: 'Schedule a mock interview with a peer', completed: false, category: 'General' },
];

const InterviewPreparationTracker: React.FC = () => {
  const completedTasks = preparationTasks.filter(task => task.completed).length;
  const totalTasks = preparationTasks.length;
  const completionPercentage = Math.round((completedTasks / totalTasks) * 100);

  // Group tasks by category
  const tasksByCategory = preparationTasks.reduce((acc, task) => {
    if (!acc[task.category]) {
      acc[task.category] = [];
    }
    acc[task.category].push(task);
    return acc;
  }, {} as Record<string, Task[]>);
  
  return (
    <Card className="md:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1">
          <CardTitle>Interview Preparation</CardTitle>
          <CardDescription>
            {completedTasks} of {totalTasks} tasks completed ({completionPercentage}%)
          </CardDescription>
        </div>
        <Button size="sm">
          <MessageSquare className="h-4 w-4 mr-2" />
          Practice with AI
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.entries(tasksByCategory).map(([category, tasks]) => (
            <div key={category} className="space-y-2">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-medium">{category}</h4>
                <Badge variant="outline" className="text-xs">
                  {tasks.filter(t => t.completed).length}/{tasks.length}
                </Badge>
              </div>
              
              <div className="space-y-1">
                {tasks.map(task => (
                  <div key={task.id} className="flex items-start gap-2">
                    {task.completed ? (
                      <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                    )}
                    <span className={`text-sm ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                      {task.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default InterviewPreparationTracker;
