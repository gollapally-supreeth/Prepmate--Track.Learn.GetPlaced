
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
    <Sidebar className="sidebar-purple-white dark:bg-black">
      <SidebarHeader className="p-4 bg-gradient-to-r from-purple-100/80 to-purple-200/50 dark:from-purple-900/20 dark:to-purple-800/10 dark:bg-black">
        <motion.div 
          className="flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-800 flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-xl">P</span>
          </div>
          <h1 className="text-purple-900 dark:text-purple-200 font-bold text-xl">Prepmate</h1>
        </motion.div>
      </SidebarHeader>
      
      <SidebarContent className="bg-gradient-to-b from-white to-purple-50 dark:from-black dark:to-black dark:bg-black">
        <div className="px-3 py-2">
          <h2 className="text-purple-800/90 dark:text-purple-300/90 text-xs font-medium uppercase mb-2">Core Features</h2>
          <nav className="space-y-1">
            <Link to="/" className={`nav-link ${isActive('/')}`}>
              <LayoutDashboard size={18} className="text-purple-600 dark:text-purple-400" />
              <span className="text-purple-900 dark:text-purple-100">Dashboard</span>
            </Link>
            <Link to="/planner" className={`nav-link ${isActive('/planner')}`}>
              <CalendarCheck size={18} className="text-purple-600 dark:text-purple-400" />
              <span className="text-purple-900 dark:text-purple-100">Daily Planner</span>
            </Link>
            <Link to="/resources" className={`nav-link ${isActive('/resources')}`}>
              <BookMarked size={18} className="text-purple-600 dark:text-purple-400" />
              <span className="text-purple-900 dark:text-purple-100">Resources Hub</span>
            </Link>
            <Link to="/notes" className={`nav-link ${isActive('/notes')}`}>
              <FileText size={18} className="text-purple-600 dark:text-purple-400" />
              <span className="text-purple-900 dark:text-purple-100">Notes</span>
            </Link>
            <Link to="/progress" className={`nav-link ${isActive('/progress')}`}>
              <LineChart size={18} className="text-purple-600 dark:text-purple-400" />
              <span className="text-purple-900 dark:text-purple-100">Progress Tracker</span>
            </Link>
            <Link to="/quizzes" className={`nav-link ${isActive('/quizzes')}`}>
              <TestTube size={18} className="text-purple-600 dark:text-purple-400" />
              <span className="text-purple-900 dark:text-purple-100">Mock Tests</span>
            </Link>
            <Link to="/resume" className={`nav-link ${isActive('/resume')}`}>
              <FileCheck size={18} className="text-purple-600 dark:text-purple-400" />
              <span className="text-purple-900 dark:text-purple-100">Resume Builder</span>
            </Link>
          </nav>
        </div>
        
        <div className="px-3 py-2 mt-4">
          <h2 className="text-purple-800/90 dark:text-purple-300/90 text-xs font-medium uppercase mb-2">Advanced Features</h2>
          <nav className="space-y-1">
            <Link to="/focus-timer" className={`nav-link ${isActive('/focus-timer')}`}>
              <Timer size={18} className="text-purple-600 dark:text-purple-400" />
              <span className="text-purple-900 dark:text-purple-100">Focus Timer</span>
            </Link>
            <Link to="/interview" className={`nav-link ${isActive('/interview')}`}>
              <MessageSquare size={18} className="text-purple-600 dark:text-purple-400" />
              <span className="text-purple-900 dark:text-purple-100">Interview Chatbot</span>
            </Link>
            <Link to="/placements" className={`nav-link ${isActive('/placements')}`}>
              <Briefcase size={18} className="text-purple-600 dark:text-purple-400" />
              <span className="text-purple-900 dark:text-purple-100">Placement Tracker</span>
            </Link>
          </nav>
        </div>
        
        {/* Add Focus Timer to sidebar */}
        <div className="mt-6 border-t border-purple-200 dark:border-zinc-800 pt-4">
          <FocusTimerProvider>
            <FocusTimerSidebar />
          </FocusTimerProvider>
        </div>
      </SidebarContent>
      
      <SidebarFooter className="bg-purple-50 dark:bg-black border-t border-purple-200 dark:border-zinc-800">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="w-8 h-8 border border-purple-200 dark:border-zinc-700">
              <AvatarImage src="" alt="User" />
              <AvatarFallback className="bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300">P</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-purple-900 dark:text-purple-100 text-sm font-medium">Pardhu</p>
              <p className="text-purple-600/70 dark:text-purple-300/70 text-xs">Student</p>
            </div>
          </div>
          <Settings size={18} className="text-purple-600 dark:text-purple-400 hover:text-purple-900 dark:hover:text-purple-200 cursor-pointer" />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
