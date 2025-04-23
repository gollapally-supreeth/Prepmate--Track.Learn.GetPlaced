import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { GripVertical, Clock, Tag, Trash2, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface PlannerTaskCardProps {
  title: string;
  dueTime: string;
  description: string;
  subject: string;
  priority: 'High' | 'Medium' | 'Low';
  completed: boolean;
  id: string;
  onComplete: (id: string) => void;
  onMoveToInProgress: (id: string) => void;
  onRemove: (id: string) => void;
}

const priorityColors = {
  High: 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20',
  Medium: 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/20',
  Low: 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20'
};

const subjectColors = {
  CSE: 'text-violet-600 dark:text-violet-400 bg-violet-100 dark:bg-violet-900/20',
  'Web Dev': 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20',
  DBMS: 'text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/20',
  'Operating Systems': 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/20',
  Programming: 'text-pink-600 dark:text-pink-400 bg-pink-100 dark:bg-pink-900/20',
  Networks: 'text-cyan-600 dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-900/20'
};

export const PlannerTaskCard: React.FC<PlannerTaskCardProps> = ({
  title,
  dueTime,
  description,
  subject,
  priority,
  completed,
  id,
  onComplete,
  onMoveToInProgress,
  onRemove
}) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className="group"
    >
      <Card className={cn(
        "relative border transition-all duration-200",
        completed ? "opacity-80" : "hover:border-primary/30",
        "bg-card dark:bg-card/80 backdrop-blur-sm"
      )}>
        <CardContent className="p-4">
          <div className="absolute left-2 top-1/2 -translate-y-1/2 opacity-50 group-hover:opacity-100 cursor-grab active:cursor-grabbing">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
          
          <div className="ml-6 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2">
                <Checkbox
                  checked={completed}
                  onCheckedChange={() => onComplete(id)}
                  className="mt-1"
                />
                <div>
                  <h3 className={cn(
                    "font-medium line-clamp-2",
                    completed && "line-through text-muted-foreground"
                  )}>
                    {title}
                  </h3>
                  {description && (
                    <p className={cn(
                      "text-sm text-muted-foreground mt-1 line-clamp-2",
                      completed && "line-through"
                    )}>
                      {description}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-2">
              {dueTime && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{dueTime}</span>
                </div>
              )}
              
              {subject && (
                <span className={cn(
                  "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
                  subjectColors[subject as keyof typeof subjectColors] || "bg-gray-100 text-gray-600"
                )}>
                  <Tag className="h-3 w-3" />
                  {subject}
                </span>
              )}
              
              <span className={cn(
                "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                priorityColors[priority]
              )}>
                {priority}
              </span>
            </div>

            <div className="flex items-center gap-2 pt-2">
              {!completed && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs hover:text-primary"
                  onClick={() => onMoveToInProgress(id)}
                >
                  <ArrowRight className="h-3 w-3 mr-1" />
                  Move to Progress
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs text-destructive hover:text-destructive"
                onClick={() => onRemove(id)}
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Remove
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
