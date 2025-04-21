
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Clock, Tag, Play, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

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
    High: 'text-focus-red bg-focus-red/10',
    Medium: 'text-focus-yellow bg-focus-yellow/10',
    Low: 'text-focus-green bg-focus-green/10',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={cn(
        "group transition-all duration-200 hover:shadow-lg border-2",
        completed ? "bg-muted/50 border-muted" : "bg-card hover:border-primary/20"
      )}>
        <CardContent className="flex items-start gap-3 p-4">
          <div className="mt-1">
            {completed ? (
              <CheckCircle2 size={18} className="text-primary/70" />
            ) : (
              <button
                onClick={() => onComplete(id)}
                className={cn(
                  "w-4 h-4 rounded-full border-2 transition-colors hover:border-primary",
                  priorityColors[priority].split(' ')[0].replace('text', 'border')
                )}
              />
            )}
          </div>
          <div className="flex-1">
            <h3 className={cn(
              "font-medium text-sm mb-1",
              completed && "line-through text-muted-foreground"
            )}>
              {title}
            </h3>
            <p className="text-xs text-muted-foreground">{description}</p>
            <div className="mt-3 flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1 text-primary/70">
                <Clock size={14} />
                <span>{dueTime}</span>
              </div>
              <div className={cn(
                "px-2 py-1 rounded-full flex items-center gap-1",
                priorityColors[priority]
              )}>
                <Tag size={12} />
                <span>{subject}</span>
              </div>
            </div>
          </div>
        </CardContent>
        <div className="flex justify-end items-center gap-2 py-2 px-4 border-t bg-muted/5">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onMoveToInProgress(id)}
            className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
          >
            <Play size={14} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onRemove(id)}
            className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 size={14} />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
