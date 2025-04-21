
import React from 'react';
import { useFocusTimer } from './FocusTimerContext';
import { TimerDisplay } from './TimerDisplay';
import { TaskList } from './TaskList';
import { cn } from '@/lib/utils';
import { Timer, BookMarked } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

interface FocusTimerSidebarProps {
  className?: string;
}

export function FocusTimerSidebar({ className }: FocusTimerSidebarProps) {
  const { state } = useFocusTimer();
  
  // Fetch the last accessed resources (in a real app, this would come from a real storage)
  const recentResources = [
    { id: 1, title: "Data Structures Basics", type: "video" },
    { id: 2, title: "Algorithms Primer", type: "article" }
  ];
  
  return (
    <motion.div 
      className={cn("space-y-4 pb-4", className)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex items-center gap-2 px-3 mb-2">
        <Timer className="h-4 w-4 text-primary dark:text-primary/90" />
        <h2 className="text-sm font-medium text-sidebar-foreground dark:text-primary-foreground/90">Focus Timer</h2>
      </div>
      
      <div className="px-2">
        <TimerDisplay compact />
      </div>
      
      <div className="border-t border-sidebar-border dark:border-zinc-800/50 pt-2">
        <TaskList compact />
      </div>
      
      {/* Quick Resource Access */}
      <div className="border-t border-sidebar-border dark:border-zinc-800/50 pt-2 px-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1">
            <BookMarked className="h-3.5 w-3.5 text-primary/80" />
            <span className="text-xs font-medium text-sidebar-foreground/90">Recent Resources</span>
          </div>
          <Link to="/resources">
            <Badge variant="outline" className="h-5 text-[10px] bg-primary/5 hover:bg-primary/10">
              View All
            </Badge>
          </Link>
        </div>
        <div className="space-y-1 mt-1">
          {recentResources.map(resource => (
            <Link 
              key={resource.id} 
              to="/resources" 
              className="block text-[11px] px-2 py-1.5 rounded-md text-sidebar-foreground/80 hover:bg-primary/10 hover:text-primary truncate"
            >
              <div className="flex items-center gap-1">
                <span className={cn(
                  "w-1.5 h-1.5 rounded-full",
                  resource.type === 'video' ? 'bg-focus-red' : 
                  resource.type === 'article' ? 'bg-focus-green' : 'bg-focus-blue'
                )}></span>
                {resource.title}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
