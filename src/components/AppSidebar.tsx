import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sidebar, SidebarContent, SidebarHeader, SidebarFooter, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroupContent, SidebarGroup, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from '@/components/ui/sidebar';
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
  FileCheck,
  Search,
  BookmarkPlus,
  Clock
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FocusTimerProvider } from './focus-timer/FocusTimerContext';
import { FocusTimerSidebar } from './focus-timer/FocusTimerSidebar';
import { motion } from "framer-motion";
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export function AppSidebar() {
  const location = useLocation();
  const [showResourcesMenu, setShowResourcesMenu] = useState(false);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const isResourcesActive = () => {
    return location.pathname.startsWith('/resources');
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
          <SidebarMenu>
            <SidebarMenuItem>
              <Link 
                to="/"
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-md transition-colors",
                  isActive('/') ? "bg-primary/10 text-primary" : "text-sidebar-foreground hover:bg-primary/5"
                )}
              >
                <LayoutDashboard size={18} className="text-primary/90" />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <Link 
                to="/planner"
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-md transition-colors",
                  isActive('/planner') ? "bg-primary/10 text-primary" : "text-sidebar-foreground hover:bg-primary/5"
                )}
              >
                <CalendarCheck size={18} className="text-primary/90" />
                <span>Daily Planner</span>
              </Link>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <button
                onClick={() => setShowResourcesMenu(!showResourcesMenu)}
                className={cn(
                  "flex items-center gap-2 w-full px-3 py-2 rounded-md transition-colors text-left",
                  isResourcesActive() ? "bg-primary/10 text-primary" : "text-sidebar-foreground hover:bg-primary/5"
                )}
              >
                <BookMarked size={18} className="text-primary/90" />
                <span>Resources Hub</span>
              </button>
              
              {showResourcesMenu && (
                <div className="pl-6 mt-1 space-y-1">
                  <Link
                    to="/resources"
                    className={cn(
                      "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors",
                      isActive('/resources') ? "bg-primary/10 text-primary" : "text-sidebar-foreground/90 hover:bg-primary/5"
                    )}
                  >
                    <Search size={14} />
                    <span>All Resources</span>
                  </Link>
                  <Link
                    to="/resources?view=bookmarks"
                    className={cn(
                      "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors",
                      isActive('/resources?view=bookmarks') ? "bg-primary/10 text-primary" : "text-sidebar-foreground/90 hover:bg-primary/5"
                    )}
                  >
                    <BookmarkPlus size={14} />
                    <span>My Bookmarks</span>
                  </Link>
                  <Link
                    to="/resources?view=paths"
                    className={cn(
                      "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors",
                      isActive('/resources?view=paths') ? "bg-primary/10 text-primary" : "text-sidebar-foreground/90 hover:bg-primary/5"
                    )}
                  >
                    <Clock size={14} />
                    <span>Learning Paths</span>
                  </Link>
                </div>
              )}
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <Link 
                to="/notes"
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-md transition-colors",
                  isActive('/notes') ? "bg-primary/10 text-primary" : "text-sidebar-foreground hover:bg-primary/5"
                )}
              >
                <FileText size={18} className="text-primary/90" />
                <span>Notes</span>
              </Link>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <Link 
                to="/progress"
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-md transition-colors",
                  isActive('/progress') ? "bg-primary/10 text-primary" : "text-sidebar-foreground hover:bg-primary/5"
                )}
              >
                <LineChart size={18} className="text-primary/90" />
                <span>Progress Tracker</span>
              </Link>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <Link 
                to="/quizzes"
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-md transition-colors",
                  isActive('/quizzes') ? "bg-primary/10 text-primary" : "text-sidebar-foreground hover:bg-primary/5"
                )}
              >
                <TestTube size={18} className="text-primary/90" />
                <span>Mock Tests</span>
              </Link>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <Link 
                to="/resume"
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-md transition-colors",
                  isActive('/resume') ? "bg-primary/10 text-primary" : "text-sidebar-foreground hover:bg-primary/5"
                )}
              >
                <FileCheck size={18} className="text-primary/90" />
                <span>Resume Builder</span>
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
        
        <div className="px-3 py-2 mt-4">
          <h2 className="text-primary/80 dark:text-primary/90 text-xs font-medium uppercase mb-2">Advanced Features</h2>
          <SidebarMenu>
            <SidebarMenuItem>
              <Link 
                to="/focus-timer"
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-md transition-colors",
                  isActive('/focus-timer') ? "bg-primary/10 text-primary" : "text-sidebar-foreground hover:bg-primary/5"
                )}
              >
                <Timer size={18} className="text-primary/90" />
                <span>Focus Timer</span>
              </Link>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <Link 
                to="/interview"
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-md transition-colors",
                  isActive('/interview') ? "bg-primary/10 text-primary" : "text-sidebar-foreground hover:bg-primary/5"
                )}
              >
                <MessageSquare size={18} className="text-primary/90" />
                <span>Interview Chatbot</span>
              </Link>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <Link 
                to="/placements"
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-md transition-colors",
                  isActive('/placements') ? "bg-primary/10 text-primary" : "text-sidebar-foreground hover:bg-primary/5"
                )}
              >
                <Briefcase size={18} className="text-primary/90" />
                <span>Placement Tracker</span>
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
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
            <Dialog>
              <DialogTrigger asChild>
                <Avatar className="w-8 h-8 border border-sidebar-border dark:border-zinc-700/50 cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all">
                  <AvatarImage src="" alt="User" />
                  <AvatarFallback className="bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary/90">P</AvatarFallback>
                </Avatar>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>User Profile</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col items-center gap-4 py-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src="" alt="User" />
                    <AvatarFallback className="bg-primary/10 text-primary text-2xl">P</AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <h3 className="font-medium text-lg">Pardhu</h3>
                    <p className="text-muted-foreground">Computer Science Student</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 w-full mt-4">
                    <Button variant="outline">View Profile</Button>
                    <Button>Edit Profile</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
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
