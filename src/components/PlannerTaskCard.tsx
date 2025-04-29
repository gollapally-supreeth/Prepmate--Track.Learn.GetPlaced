import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { GripVertical, Clock, Tag, Trash2, ArrowRight, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useTaskStore } from '@/contexts/TaskStoreContext';
import { nanoid } from 'nanoid';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
  expanded?: boolean;
  onExpand?: () => void;
  editing?: boolean;
  onEdit?: () => void;
  current?: boolean;
  onSetCurrent?: () => void;
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
  expanded,
  onExpand,
  editing,
  onEdit,
  current,
  onSetCurrent,
  onRemove
}) => {
  const { tasks, addTask, editTask } = useTaskStore();
  const alreadyInFocus = tasks.find(t => t.id === id)?.inFocus;
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className={cn("group", current && "ring-2 ring-primary/60")}
    >
      <Card className={cn(
        "relative border border-muted-foreground/10 shadow-sm transition-all duration-200 bg-white/90 dark:bg-zinc-900/80 backdrop-blur rounded-xl",
        completed ? "opacity-70" : "hover:shadow-md hover:border-primary/20",
        current && "border-primary/60 shadow-lg"
      )}>
        <div className="absolute top-3 right-3 z-10 flex gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    'relative rounded-full p-1 h-7 w-7 opacity-80 hover:opacity-100 transition',
                    alreadyInFocus ? 'text-muted-foreground cursor-not-allowed' : 'text-primary',
                    'bg-transparent shadow-none border-none'
                  )}
                  disabled={alreadyInFocus}
                  tabIndex={-1}
                  onClick={e => {
                    e.stopPropagation();
                    if (!alreadyInFocus) {
                      editTask(id, { inFocus: true, origin: 'planner' });
                    }
                  }}
                >
                  <Clock className="h-4 w-4" />
                  <span className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full p-0.5 flex items-center justify-center" style={{ width: 14, height: 14 }}>
                    <Info className="h-2.5 w-2.5" />
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left" className="text-xs">
                {alreadyInFocus ? 'Already in Focus Timer' : 'Send to Focus Timer'}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {onExpand && (
            <Button variant="ghost" size="icon" className="h-7 w-7 p-0" onClick={onExpand}>
              {expanded ? <GripVertical className="h-4 w-4 rotate-90" /> : <GripVertical className="h-4 w-4" />}
            </Button>
          )}
        </div>
        <CardContent className="p-5 pb-4">
          <div className="absolute left-2 top-1/2 -translate-y-1/2 opacity-80 cursor-grab active:cursor-grabbing">
            <GripVertical className="h-4 w-4 text-muted-foreground/40" />
          </div>
          <div className="ml-8 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={completed}
                  onCheckedChange={() => onComplete(id)}
                  className="mt-1 border-muted-foreground/30"
                />
                <div>
                  <h3 className={cn(
                    "font-semibold text-base line-clamp-2 text-zinc-900 dark:text-zinc-100",
                    completed && "line-through text-muted-foreground"
                  )}>
                    {title}
                  </h3>
                  {description && (
                    <p className={cn(
                      "text-sm text-muted-foreground mt-0.5 line-clamp-2",
                      completed && "line-through"
                    )}>
                      {description}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              {dueTime && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/60 rounded px-2 py-0.5">
                  <Clock className="h-3 w-3" />
                  {dueTime}
                </span>
              )}
              {subject && (
                <span className={cn(
                  "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-muted/60 text-muted-foreground",
                  subjectColors[subject as keyof typeof subjectColors]
                )}>
                  <Tag className="h-3 w-3" />
                  {subject}
                </span>
              )}
              <span className={cn(
                "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-muted/60 text-muted-foreground",
                priorityColors[priority]
              )}>
                {priority}
              </span>
            </div>
            <div className="flex items-center gap-2 pt-2 justify-end">
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
            {expanded && (
              <div className="mt-2 text-xs text-muted-foreground bg-muted/40 rounded p-3 border border-muted-foreground/10">
                <div><strong>Description:</strong> {description}</div>
                <div><strong>Due:</strong> {dueTime}</div>
                <div><strong>Subject:</strong> {subject}</div>
                <div><strong>Priority:</strong> {priority}</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
