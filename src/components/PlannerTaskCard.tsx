import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Clock, Tag, Play, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlannerTaskCardProps {
  title: string;
  dueTime: string;
  subject: string;
  description: string;
  priority: "High" | "Medium" | "Low";
  completed?: boolean;
  id: number;
  onComplete: (id: number) => void;
  onMoveToInProgress: (id: number) => void;
  onRemove: (id: number) => void;
}

export function PlannerTaskCard({
  title,
  dueTime,
  subject,
  description,
  priority,
  completed = false,
  id,
  onComplete,
  onMoveToInProgress,
  onRemove,
}: PlannerTaskCardProps) {
  const priorityColors = {
    High: 'text-focus-red',
    Medium: 'text-focus-yellow',
    Low: 'text-focus-green',
  };

  return (
    <Card className={cn("flex flex-col shadow-sm hover:shadow transition-shadow", completed ? "bg-muted/50" : "bg-card")}>
      <CardContent className="flex items-start gap-3 p-4">
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
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
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
      </CardContent>
      <div className='flex flex-row justify-end items-center gap-2 py-2 px-4 border-t'>
        <Button variant="outline" size="icon" onClick={() => onMoveToInProgress(id)}>
          <Play size={16} />
        </Button>
        <Button variant="destructive" size="icon" onClick={() => onRemove(id)}>
          <Trash2 size={16} />
        </Button>
      </div>
    </Card>
  );
}