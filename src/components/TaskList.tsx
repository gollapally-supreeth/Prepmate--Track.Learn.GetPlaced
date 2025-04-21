
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Task {
  title: string;
  deadline: string;
  priority: "High" | "Medium" | "Low";
  progress: number;
}

interface TaskListProps {
  tasks: Task[];
}

export function TaskList({ tasks }: TaskListProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-500/10 text-red-500";
      case "Medium":
        return "bg-yellow-500/10 text-yellow-500";
      case "Low":
        return "bg-green-500/10 text-green-500";
      default:
        return "bg-gray-500/10 text-gray-500";
    }
  };

  return (
    <div className="space-y-4">
      {tasks.map((task, index) => (
        <div key={index} className="flex flex-col gap-2 p-4 rounded-lg border border-border/50 bg-card hover:bg-accent/5 transition-colors">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">{task.title}</h3>
            <Badge variant="outline" className={cn("px-2 py-0.5", getPriorityColor(task.priority))}>
              {task.priority}
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <Progress value={task.progress} className="flex-1" />
            <span className="text-sm text-muted-foreground">{task.progress}%</span>
          </div>
          <p className="text-xs text-muted-foreground">Due: {task.deadline}</p>
        </div>
      ))}
    </div>
  );
}
