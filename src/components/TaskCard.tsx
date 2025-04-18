
import React from 'react';
import { Card } from '@/components/ui/card';
import { CheckCircle2, Clock, Tag } from 'lucide-react';
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
    High: 'text-focus-red',
    Medium: 'text-focus-yellow',
    Low: 'text-focus-green',
  };
  return (
    <Card className={cn(
      "flex items-start gap-3 p-4 shadow-sm hover:shadow transition-shadow",
      completed ? "bg-muted/50" : "bg-card"
    )}>
      <div className="mt-1">
        {completed ? (
          <CheckCircle2 size={18} className="text-focus-green" onClick={() => onComplete(id)} />
        ) : (
          <button
            onClick={() => onComplete(id)}
            className={cn(
              "w-4 h-4 rounded-full border-2",
              priorityColors[priority]
            )}
          >
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
            <span>{subject}</span>
            </div>
          </div>
        </div>
    </Card>
  );
}
