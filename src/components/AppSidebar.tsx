
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sidebar, SidebarContent, SidebarHeader, SidebarFooter } from '@/components/ui/sidebar';
import { 
  LayoutDashboard, 
  CalendarCheck, 
  BookMarked, 
  FileText, 
  LineChart, 
  TestTube, 
  Timer, 
  MessageSquare, 
  Briefcase, 
  Settings,
  FileCheck 
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FocusTimerProvider } from './focus-timer/FocusTimerContext';
import { FocusTimerSidebar } from './focus-timer/FocusTimerSidebar';
import { motion } from "framer-motion";

export function AppSidebar() {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <Sidebar className="sidebar-purple-white">
      <SidebarHeader className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-black/30">
        <motion.div 
          className="flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-600/90 dark:from-primary dark:to-purple-700 flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-xl">P</span>
          </div>
          <h1 className="text-primary font-bold text-xl">Prepmate</h1>
        </motion.div>
      </SidebarHeader>
      
      <SidebarContent className="bg-gradient-to-b from-sidebar via-sidebar to-sidebar dark:from-black dark:via-black dark:to-black">
        <div className="px-3 py-2">
          <h2 className="text-primary/80 dark:text-primary/90 text-xs font-medium uppercase mb-2">Core Features</h2>
          <nav className="space-y-1">
            <Link to="/" className={`nav-link ${isActive('/')}`}>
              <LayoutDashboard size={18} className="text-primary/90 dark:text-primary/80" />
              <span className="text-sidebar-foreground dark:text-primary-foreground/90">Dashboard</span>
            </Link>
            <Link to="/planner" className={`nav-link ${isActive('/planner')}`}>
              <CalendarCheck size={18} className="text-primary/90 dark:text-primary/80" />
              <span className="text-sidebar-foreground dark:text-primary-foreground/90">Daily Planner</span>
            </Link>
            <Link to="/resources" className={`nav-link ${isActive('/resources')}`}>
              <BookMarked size={18} className="text-primary/90 dark:text-primary/80" />
              <span className="text-sidebar-foreground dark:text-primary-foreground/90">Resources Hub</span>
            </Link>
            <Link to="/notes" className={`nav-link ${isActive('/notes')}`}>
              <FileText size={18} className="text-primary/90 dark:text-primary/80" />
              <span className="text-sidebar-foreground dark:text-primary-foreground/90">Notes</span>
            </Link>
            <Link to="/progress" className={`nav-link ${isActive('/progress')}`}>
              <LineChart size={18} className="text-primary/90 dark:text-primary/80" />
              <span className="text-sidebar-foreground dark:text-primary-foreground/90">Progress Tracker</span>
            </Link>
            <Link to="/quizzes" className={`nav-link ${isActive('/quizzes')}`}>
              <TestTube size={18} className="text-primary/90 dark:text-primary/80" />
              <span className="text-sidebar-foreground dark:text-primary-foreground/90">Mock Tests</span>
            </Link>
            <Link to="/resume" className={`nav-link ${isActive('/resume')}`}>
              <FileCheck size={18} className="text-primary/90 dark:text-primary/80" />
              <span className="text-sidebar-foreground dark:text-primary-foreground/90">Resume Builder</span>
            </Link>
          </nav>
        </div>
        
        <div className="px-3 py-2 mt-4">
          <h2 className="text-primary/80 dark:text-primary/90 text-xs font-medium uppercase mb-2">Advanced Features</h2>
          <nav className="space-y-1">
            <Link to="/focus-timer" className={`nav-link ${isActive('/focus-timer')}`}>
              <Timer size={18} className="text-primary/90 dark:text-primary/80" />
              <span className="text-sidebar-foreground dark:text-primary-foreground/90">Focus Timer</span>
            </Link>
            <Link to="/interview" className={`nav-link ${isActive('/interview')}`}>
              <MessageSquare size={18} className="text-primary/90 dark:text-primary/80" />
              <span className="text-sidebar-foreground dark:text-primary-foreground/90">Interview Chatbot</span>
            </Link>
            <Link to="/placements" className={`nav-link ${isActive('/placements')}`}>
              <Briefcase size={18} className="text-primary/90 dark:text-primary/80" />
              <span className="text-sidebar-foreground dark:text-primary-foreground/90">Placement Tracker</span>
            </Link>
          </nav>
        </div>
        
        {/* Add Focus Timer to sidebar */}
        <div className="mt-6 border-t border-sidebar-border dark:border-zinc-800/50 pt-4">
          <FocusTimerProvider>
            <FocusTimerSidebar />
          </FocusTimerProvider>
        </div>
      </SidebarContent>
      
      <SidebarFooter className="bg-sidebar dark:bg-black border-t border-sidebar-border dark:border-zinc-800/50">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="w-8 h-8 border border-sidebar-border dark:border-zinc-700/50">
              <AvatarImage src="" alt="User" />
              <AvatarFallback className="bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary/90">P</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sidebar-foreground dark:text-primary-foreground/90 text-sm font-medium">Pardhu</p>
              <p className="text-sidebar-foreground/70 dark:text-primary-foreground/50 text-xs">Student</p>
            </div>
          </div>
          <Settings size={18} className="text-primary/80 dark:text-primary/70 hover:text-primary dark:hover:text-primary cursor-pointer" />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
