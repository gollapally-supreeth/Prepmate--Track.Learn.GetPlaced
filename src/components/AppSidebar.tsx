
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
              <SidebarMenuButton isActive={isActive('/')} as={Link} to="/">
                <LayoutDashboard size={18} className="text-primary/90 dark:text-primary/80" />
                <span className="text-sidebar-foreground dark:text-primary-foreground/90">Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton isActive={isActive('/planner')} as={Link} to="/planner">
                <CalendarCheck size={18} className="text-primary/90 dark:text-primary/80" />
                <span className="text-sidebar-foreground dark:text-primary-foreground/90">Daily Planner</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={isResourcesActive()} 
                onClick={() => setShowResourcesMenu(!showResourcesMenu)}
                className={cn(
                  showResourcesMenu && "bg-primary/10 text-primary"
                )}
              >
                <BookMarked size={18} className={cn(
                  "text-primary/90 dark:text-primary/80",
                  isResourcesActive() && "text-primary"
                )} />
                <span className={cn(
                  "text-sidebar-foreground dark:text-primary-foreground/90",
                  isResourcesActive() && "text-primary font-medium"
                )}>
                  Resources Hub
                </span>
              </SidebarMenuButton>
              
              {/* Resources Hub Submenu */}
              {showResourcesMenu && (
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton as={Link} to="/resources" isActive={isActive('/resources')}>
                      <Search size={14} className="text-primary/70" />
                      <span>All Resources</span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton as={Link} to="/resources?view=bookmarks">
                      <BookmarkPlus size={14} className="text-primary/70" />
                      <span>My Bookmarks</span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton as={Link} to="/resources?view=paths">
                      <Clock size={14} className="text-primary/70" />
                      <span>Learning Paths</span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              )}
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton isActive={isActive('/notes')} as={Link} to="/notes">
                <FileText size={18} className="text-primary/90 dark:text-primary/80" />
                <span className="text-sidebar-foreground dark:text-primary-foreground/90">Notes</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton isActive={isActive('/progress')} as={Link} to="/progress">
                <LineChart size={18} className="text-primary/90 dark:text-primary/80" />
                <span className="text-sidebar-foreground dark:text-primary-foreground/90">Progress Tracker</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton isActive={isActive('/quizzes')} as={Link} to="/quizzes">
                <TestTube size={18} className="text-primary/90 dark:text-primary/80" />
                <span className="text-sidebar-foreground dark:text-primary-foreground/90">Mock Tests</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton isActive={isActive('/resume')} as={Link} to="/resume">
                <FileCheck size={18} className="text-primary/90 dark:text-primary/80" />
                <span className="text-sidebar-foreground dark:text-primary-foreground/90">Resume Builder</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
        
        <div className="px-3 py-2 mt-4">
          <h2 className="text-primary/80 dark:text-primary/90 text-xs font-medium uppercase mb-2">Advanced Features</h2>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton isActive={isActive('/focus-timer')} as={Link} to="/focus-timer">
                <Timer size={18} className="text-primary/90 dark:text-primary/80" />
                <span className="text-sidebar-foreground dark:text-primary-foreground/90">Focus Timer</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton isActive={isActive('/interview')} as={Link} to="/interview">
                <MessageSquare size={18} className="text-primary/90 dark:text-primary/80" />
                <span className="text-sidebar-foreground dark:text-primary-foreground/90">Interview Chatbot</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton isActive={isActive('/placements')} as={Link} to="/placements">
                <Briefcase size={18} className="text-primary/90 dark:text-primary/80" />
                <span className="text-sidebar-foreground dark:text-primary-foreground/90">Placement Tracker</span>
              </SidebarMenuButton>
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
