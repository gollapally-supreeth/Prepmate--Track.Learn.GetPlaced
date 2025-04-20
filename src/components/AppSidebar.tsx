
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

export function AppSidebar() {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <Sidebar className="sidebar-purple-white">
      <SidebarHeader className="p-4 bg-gradient-to-r from-purple-100/80 to-purple-200/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold text-xl">P</span>
          </div>
          <h1 className="text-purple-900 font-bold text-xl">Prepmate</h1>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="bg-gradient-to-b from-white to-purple-50">
        <div className="px-3 py-2">
          <h2 className="text-purple-800/90 text-xs font-medium uppercase mb-2">Core Features</h2>
          <nav className="space-y-1">
            <Link to="/" className={`nav-link ${isActive('/')}`}>
              <LayoutDashboard size={18} className="text-purple-600" />
              <span className="text-purple-900">Dashboard</span>
            </Link>
            <Link to="/planner" className={`nav-link ${isActive('/planner')}`}>
              <CalendarCheck size={18} className="text-purple-600" />
              <span className="text-purple-900">Daily Planner</span>
            </Link>
            <Link to="/resources" className={`nav-link ${isActive('/resources')}`}>
              <BookMarked size={18} className="text-purple-600" />
              <span className="text-purple-900">Resources Hub</span>
            </Link>
            <Link to="/notes" className={`nav-link ${isActive('/notes')}`}>
              <FileText size={18} className="text-purple-600" />
              <span className="text-purple-900">Notes</span>
            </Link>
            <Link to="/progress" className={`nav-link ${isActive('/progress')}`}>
              <LineChart size={18} className="text-purple-600" />
              <span className="text-purple-900">Progress Tracker</span>
            </Link>
            <Link to="/quizzes" className={`nav-link ${isActive('/quizzes')}`}>
              <TestTube size={18} className="text-purple-600" />
              <span className="text-purple-900">Mock Tests</span>
            </Link>
            <Link to="/resume" className={`nav-link ${isActive('/resume')}`}>
              <FileCheck size={18} className="text-purple-600" />
              <span className="text-purple-900">Resume Builder</span>
            </Link>
          </nav>
        </div>
        
        <div className="px-3 py-2 mt-4">
          <h2 className="text-purple-800/90 text-xs font-medium uppercase mb-2">Advanced Features</h2>
          <nav className="space-y-1">
            <Link to="/focus-timer" className={`nav-link ${isActive('/focus-timer')}`}>
              <Timer size={18} className="text-purple-600" />
              <span className="text-purple-900">Focus Timer</span>
            </Link>
            <Link to="/interview" className={`nav-link ${isActive('/interview')}`}>
              <MessageSquare size={18} className="text-purple-600" />
              <span className="text-purple-900">Interview Chatbot</span>
            </Link>
            <Link to="/placements" className={`nav-link ${isActive('/placements')}`}>
              <Briefcase size={18} className="text-purple-600" />
              <span className="text-purple-900">Placement Tracker</span>
            </Link>
          </nav>
        </div>
        
        {/* Add Focus Timer to sidebar */}
        <div className="mt-6 border-t border-purple-200 pt-4">
          <FocusTimerProvider>
            <FocusTimerSidebar />
          </FocusTimerProvider>
        </div>
      </SidebarContent>
      
      <SidebarFooter className="bg-purple-50 border-t border-purple-200">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="w-8 h-8 border border-purple-200">
              <AvatarImage src="" alt="User" />
              <AvatarFallback className="bg-purple-100 text-purple-600">P</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-purple-900 text-sm font-medium">Pardhu</p>
              <p className="text-purple-600/70 text-xs">Student</p>
            </div>
          </div>
          <Settings size={18} className="text-purple-600 hover:text-purple-900 cursor-pointer" />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
