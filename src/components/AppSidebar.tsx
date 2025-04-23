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
  MessageSquare, 
  Briefcase, 
  LogOut,
  FileCheck
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { useAuth } from '@/lib/auth';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

export function AppSidebar({ isCollapsed }: { isCollapsed: boolean }) {
  const location = useLocation();
  const { logout } = useAuth();
  
  const isActive = (path: string) => {
    return location.pathname === path ? 'active' : '';
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <Sidebar className={cn(
      "sidebar-purple-white dark:bg-black transition-all duration-300 fixed lg:sticky top-0 h-screen",
      isCollapsed ? "w-0 lg:w-[70px] -translate-x-full lg:translate-x-0" : "w-[250px]"
    )}>
      <SidebarHeader className="p-4 bg-gradient-to-r from-purple-100/80 to-purple-200/50 dark:from-purple-900/20 dark:to-purple-800/10 dark:bg-black">
        <motion.div 
          className="flex items-center gap-2 whitespace-nowrap"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-800 flex items-center justify-center shadow-md flex-shrink-0">
            <span className="text-white font-bold text-xl">P</span>
          </div>
          {!isCollapsed && <h1 className="text-purple-900 dark:text-purple-200 font-bold text-xl">Prepmate</h1>}
        </motion.div>
      </SidebarHeader>
      
      <SidebarContent className="bg-gradient-to-b from-white to-purple-50 dark:from-black dark:to-black dark:bg-black overflow-y-auto flex-1">
        <div className="px-3 py-2">
          {!isCollapsed && <h2 className="text-purple-800/90 dark:text-purple-300/90 text-xs font-medium uppercase mb-2">Core Features</h2>}
          <nav className="space-y-1">
            <Link to="/dashboard" className={`nav-link ${isActive('/dashboard')} ${isCollapsed ? 'justify-center' : ''}`}>
              <LayoutDashboard size={18} className="text-purple-600 dark:text-purple-400 flex-shrink-0" />
              {!isCollapsed && <span className="text-purple-900 dark:text-purple-100 whitespace-nowrap">Dashboard</span>}
            </Link>
            <Link to="/planner" className={`nav-link ${isActive('/planner')} ${isCollapsed ? 'justify-center' : ''}`}>
              <CalendarCheck size={18} className="text-purple-600 dark:text-purple-400 flex-shrink-0" />
              {!isCollapsed && <span className="text-purple-900 dark:text-purple-100 whitespace-nowrap">Daily Planner</span>}
            </Link>
            <Link to="/resources" className={`nav-link ${isActive('/resources')} ${isCollapsed ? 'justify-center' : ''}`}>
              <BookMarked size={18} className="text-purple-600 dark:text-purple-400 flex-shrink-0" />
              {!isCollapsed && <span className="text-purple-900 dark:text-purple-100 whitespace-nowrap">Resources Hub</span>}
            </Link>
            <Link to="/notes" className={`nav-link ${isActive('/notes')} ${isCollapsed ? 'justify-center' : ''}`}>
              <FileText size={18} className="text-purple-600 dark:text-purple-400 flex-shrink-0" />
              {!isCollapsed && <span className="text-purple-900 dark:text-purple-100 whitespace-nowrap">Notes</span>}
            </Link>
            <Link to="/progress" className={`nav-link ${isActive('/progress')} ${isCollapsed ? 'justify-center' : ''}`}>
              <LineChart size={18} className="text-purple-600 dark:text-purple-400 flex-shrink-0" />
              {!isCollapsed && <span className="text-purple-900 dark:text-purple-100 whitespace-nowrap">Progress Tracker</span>}
            </Link>
          </nav>
        </div>
        
        <div className="px-3 py-2 mt-4">
          {!isCollapsed && <h2 className="text-purple-800/90 dark:text-purple-300/90 text-xs font-medium uppercase mb-2">Advanced Features</h2>}
          <nav className="space-y-1">
            <Link to="/interview" className={`nav-link ${isActive('/interview')} ${isCollapsed ? 'justify-center' : ''}`}>
              <MessageSquare size={18} className="text-purple-600 dark:text-purple-400 flex-shrink-0" />
              {!isCollapsed && <span className="text-purple-900 dark:text-purple-100 whitespace-nowrap">Interview Chatbot</span>}
            </Link>
            <Link to="/resume" className={`nav-link ${isActive('/resume')} ${isCollapsed ? 'justify-center' : ''}`}>
              <FileCheck size={18} className="text-purple-600 dark:text-purple-400 flex-shrink-0" />
              {!isCollapsed && <span className="text-purple-900 dark:text-purple-100 whitespace-nowrap">Resume Builder</span>}
            </Link>
            <Link to="/placements" className={`nav-link ${isActive('/placements')} ${isCollapsed ? 'justify-center' : ''}`}>
              <Briefcase size={18} className="text-purple-600 dark:text-purple-400 flex-shrink-0" />
              {!isCollapsed && <span className="text-purple-900 dark:text-purple-100 whitespace-nowrap">Placement Tracker</span>}
            </Link>
            <Link to="/quizzes" className={`nav-link ${isActive('/quizzes')} ${isCollapsed ? 'justify-center' : ''}`}>
              <TestTube size={18} className="text-purple-600 dark:text-purple-400 flex-shrink-0" />
              {!isCollapsed && <span className="text-purple-900 dark:text-purple-100 whitespace-nowrap">Mock Tests</span>}
            </Link>
          </nav>
        </div>
      </SidebarContent>
      
      <SidebarFooter className="bg-purple-50 dark:bg-black border-t border-purple-200 dark:border-zinc-800">
        <div className="p-4 flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <Avatar className="w-8 h-8 border border-purple-200 dark:border-zinc-700 flex-shrink-0">
                <AvatarImage src="" alt="User" />
                <AvatarFallback className="bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300">P</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="text-purple-900 dark:text-purple-100 text-sm font-medium truncate">Pardhu</p>
                <p className="text-purple-600/70 dark:text-purple-300/70 text-xs truncate">Student</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className={cn(
              "hover:bg-purple-100 dark:hover:bg-purple-900/20",
              isCollapsed && "w-full"
            )}
          >
            <LogOut size={18} className="text-purple-600 dark:text-purple-400 hover:text-purple-900 dark:hover:text-purple-200" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
                                                                                                