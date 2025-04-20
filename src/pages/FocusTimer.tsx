
import React from 'react';
import { motion } from 'framer-motion';
import { FocusTimerProvider } from '@/components/focus-timer/FocusTimerContext';
import { TimerDisplay } from '@/components/focus-timer/TimerDisplay';
import { TaskList } from '@/components/focus-timer/TaskList';
import { TimerSettings } from '@/components/focus-timer/TimerSettings';
import { StatsDisplay } from '@/components/focus-timer/StatsDisplay';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Timer } from 'lucide-react';

const FocusTimer = () => {
  return (
    <FocusTimerProvider>
      <motion.div 
        className="container mx-auto space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Timer className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-3xl font-bold gradient-heading">Focus Timer</h1>
          </div>
        </div>
        
        <p className="text-muted-foreground max-w-2xl">
          Stay focused and productive with customizable work intervals and breaks. Track your progress and manage tasks effectively.
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-card rounded-lg shadow-sm p-6 border flex flex-col items-center">
              <TimerDisplay />
            </div>
            
            <div className="bg-card rounded-lg shadow-sm border overflow-hidden">
              <Tabs defaultValue="tasks" className="w-full">
                <TabsList className="w-full grid grid-cols-2">
                  <TabsTrigger value="tasks">Tasks</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                <TabsContent value="tasks" className="m-0">
                  <TaskList />
                </TabsContent>
                <TabsContent value="settings" className="m-0">
                  <TimerSettings />
                </TabsContent>
              </Tabs>
            </div>
          </div>
          
          <div className="lg:col-span-8">
            <div className="bg-card rounded-lg shadow-sm p-6 border">
              <StatsDisplay />
            </div>
          </div>
        </div>
      </motion.div>
    </FocusTimerProvider>
  );
};

export default FocusTimer;
