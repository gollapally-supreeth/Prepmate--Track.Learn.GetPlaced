
import React from 'react';
import { useFocusTimer } from './FocusTimerContext';
import { TimerDisplay } from './TimerDisplay';
import { TaskList } from './TaskList';
import { cn } from '@/lib/utils';
import { Timer } from 'lucide-react';

interface FocusTimerSidebarProps {
  className?: string;
}

export function FocusTimerSidebar({ className }: FocusTimerSidebarProps) {
  const { state } = useFocusTimer();
  
  return (
    <div className={cn("space-y-4 pb-4", className)}>
      <div className="flex items-center gap-2 px-3 mb-2">
        <Timer className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-medium">Focus Timer</h2>
      </div>
      
      <div className="px-2">
        <TimerDisplay compact />
      </div>
      
      <div className="border-t border-sidebar-border pt-2">
        <TaskList compact />
      </div>
    </div>
  );
}
