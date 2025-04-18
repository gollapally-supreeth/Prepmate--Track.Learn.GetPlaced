
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
  Settings 
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function AppSidebar() {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
            <span className="text-primary font-bold text-xl">P</span>
          </div>
          <h1 className="text-sidebar-foreground font-bold text-xl">Prepmate</h1>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <div className="px-3 py-2">
          <h2 className="text-sidebar-foreground/70 text-xs font-medium uppercase mb-2">Core Features</h2>
          <nav className="space-y-1">
            <Link to="/" className={`nav-link ${isActive('/')}`}>
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </Link>
            <Link to="/planner" className={`nav-link ${isActive('/planner')}`}>
              <CalendarCheck size={18} />
              <span>Daily Planner</span>
            </Link>
            <Link to="/resources" className={`nav-link ${isActive('/resources')}`}>
              <BookMarked size={18} />
              <span>Resources Hub</span>
            </Link>
            <Link to="/notes" className={`nav-link ${isActive('/notes')}`}>
              <FileText size={18} />
              <span>Notes</span>
            </Link>
            <Link to="/progress" className={`nav-link ${isActive('/progress')}`}>
              <LineChart size={18} />
              <span>Progress Tracker</span>
            </Link>
            <Link to="/quizzes" className={`nav-link ${isActive('/quizzes')}`}>
              <TestTube size={18} />
              <span>Mock Tests</span>
            </Link>
          </nav>
        </div>
        
        <div className="px-3 py-2 mt-4">
          <h2 className="text-sidebar-foreground/70 text-xs font-medium uppercase mb-2">Advanced Features</h2>
          <nav className="space-y-1">
            <Link to="/focus-timer" className={`nav-link ${isActive('/focus-timer')}`}>
              <Timer size={18} />
              <span>Focus Timer</span>
            </Link>
            <Link to="/interview" className={`nav-link ${isActive('/interview')}`}>
              <MessageSquare size={18} />
              <span>Interview Chatbot</span>
            </Link>
            <Link to="/placements" className={`nav-link ${isActive('/placements')}`}>
              <Briefcase size={18} />
              <span>Placement Tracker</span>
            </Link>
          </nav>
        </div>
      </SidebarContent>
      
      <SidebarFooter>
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="w-8 h-8 border border-sidebar-border">
              <AvatarImage src="" alt="User" />
              <AvatarFallback className="bg-primary/10 text-primary">P</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sidebar-foreground text-sm font-medium">Pardhu</p>
              <p className="text-sidebar-foreground/70 text-xs">Student</p>
            </div>
          </div>
          <Settings size={18} className="text-sidebar-foreground/70 hover:text-sidebar-foreground cursor-pointer" />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
