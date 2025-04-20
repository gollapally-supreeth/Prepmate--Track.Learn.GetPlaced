
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { Bell, Sun, Moon, Search, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AppLayout() {
  const [darkMode, setDarkMode] = useState(() => {
    // Check if dark mode preference is stored
    const savedMode = localStorage.getItem('darkMode');
    // If preference exists, return it, otherwise check system preference
    return savedMode !== null 
      ? savedMode === 'true'
      : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  
  const { toast } = useToast();
  
  // Function to toggle dark mode
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', String(newMode));
    
    // Update document class for dark mode
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    toast({
      title: `${newMode ? 'Dark' : 'Light'} mode activated`,
      description: `Switched to ${newMode ? 'dark' : 'light'} mode.`,
      duration: 2000,
    });
  };
  
  // Set initial dark mode class on document
  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-background to-background/90 transition-colors duration-300">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b bg-card/80 backdrop-blur-md flex items-center justify-between px-4 sm:px-6 sticky top-0 z-10 shadow-sm">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="lg:hidden">
                <Menu className="h-5 w-5" />
              </SidebarTrigger>
              <div className="relative hidden md:flex items-center max-w-md">
                <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search..." className="w-[200px] lg:w-[300px] pl-9 bg-background/50" />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Button
                variant="ghost" 
                size="icon"
                onClick={toggleDarkMode}
                className="rounded-full transition-transform hover:scale-110"
              >
                {darkMode ? <Sun className="h-[1.2rem] w-[1.2rem] text-yellow-400" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
              </Button>
              
              <div className="relative">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative rounded-full h-9 w-9 p-0">
                      <Bell size={18} className="text-muted-foreground hover:text-foreground" />
                      <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center" variant="destructive">3</Badge>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80 mt-1 animate-scale-in">
                    <div className="p-4 font-medium border-b">Notifications</div>
                    <DropdownMenuItem className="p-3 cursor-pointer">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">New interview slot available</p>
                        <p className="text-xs text-muted-foreground">Google has opened new interview slots</p>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="p-3 cursor-pointer">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Resume feedback received</p>
                        <p className="text-xs text-muted-foreground">Your resume has been reviewed</p>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="p-3 cursor-pointer">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Mock test scheduled</p>
                        <p className="text-xs text-muted-foreground">Your DSA test is in 2 days</p>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer h-9 w-9 transition-transform hover:scale-110">
                    <AvatarImage src="" alt="Pardhu" />
                    <AvatarFallback className="bg-primary text-primary-foreground">P</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="mt-1 animate-scale-in">
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem>Support</DropdownMenuItem>
                  <DropdownMenuItem>Log out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-4 sm:p-6 md:p-8 animate-fade-in">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
