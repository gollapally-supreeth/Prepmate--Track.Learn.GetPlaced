
import React from 'react';
import { Card } from '@/components/ui/card';
import { CheckCircle2, Clock, Tag, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  title: string;
  dueTime: string;
  subject: string;
  priority: "High" | "Medium" | "Low";
  completed?: boolean;
  id: number;
  onComplete: (id: number) => void;
}

export function TaskCard({ title, dueTime, subject, priority, completed = false, id, onComplete }: TaskCardProps) {
  const priorityColors = {
    High: 'text-focus-red border-focus-red',
    Medium: 'text-focus-yellow border-focus-yellow',
    Low: 'text-focus-green border-focus-green',
  };
  
  const priorityBgs = {
    High: 'bg-focus-red/10',
    Medium: 'bg-focus-yellow/10',
    Low: 'bg-focus-green/10',
  };
  
  return (
    <Card className={cn(
      "group flex items-start gap-3 p-4 transition-all duration-200",
      completed 
        ? "bg-muted/30 border-muted" 
        : `hover:shadow-md hover:border-${priority.toLowerCase()}-400/30 card-hover`,
      priorityBgs[priority]
    )}>
      <div className="mt-1">
        {completed ? (
          <CheckCircle2 
            size={20} 
            className="text-focus-green cursor-pointer hover:scale-110 transition-transform" 
            onClick={() => onComplete(id)} 
          />
        ) : (
          <button
            onClick={() => onComplete(id)}
            className={cn(
              "w-5 h-5 rounded-full border-2 flex items-center justify-center hover:scale-110 transition-transform",
              priorityColors[priority]
            )}
          >
            <Circle size={12} className={cn(
              "opacity-0 group-hover:opacity-100 transition-opacity",
              priorityColors[priority]
            )} />
          </button>
        )}
      </div>
      <div className="flex-1">
        <h3 className={cn(
          "font-medium text-sm",
          completed && "line-through text-muted-foreground"
        )}>
          {title}
        </h3>
        <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>{dueTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <Tag size={14} />
            <span className={cn(
              "px-2 py-0.5 rounded-full",
              priorityBgs[priority]
            )}>{subject}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
