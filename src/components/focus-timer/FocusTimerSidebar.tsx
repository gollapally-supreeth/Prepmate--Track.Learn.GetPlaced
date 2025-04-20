
import React from 'react';
import { useFocusTimer } from './FocusTimerContext';
import { TimerDisplay } from './TimerDisplay';
import { TaskList } from './TaskList';
import { cn } from '@/lib/utils';
import { Timer } from 'lucide-react';
import { motion } from 'framer-motion';

interface FocusTimerSidebarProps {
  className?: string;
}

export function FocusTimerSidebar({ className }: FocusTimerSidebarProps) {
  const { state } = useFocusTimer();
  
  return (
    <motion.div 
      className={cn("space-y-4 pb-4", className)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex items-center gap-2 px-3 mb-2">
        <Timer className="h-4 w-4 text-purple-600 dark:text-purple-400" />
        <h2 className="text-sm font-medium text-purple-900 dark:text-purple-100">Focus Timer</h2>
      </div>
      
      <div className="px-2">
        <TimerDisplay compact />
      </div>
      
      <div className="border-t border-purple-200 dark:border-zinc-800 pt-2">
        <TaskList compact />
      </div>
    </motion.div>
  );
}
