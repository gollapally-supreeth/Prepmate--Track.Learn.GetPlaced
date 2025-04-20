
import React from 'react';
import ProgressTracker from '@/components/ProgressTracker';
import { motion } from 'framer-motion';
import { LineChart } from 'lucide-react';

const Progress = () => {
  return (
    <motion.div 
      className="container mx-auto space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <LineChart className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-3xl font-bold gradient-heading">Progress Tracker</h1>
        </div>
      </div>
      
      <p className="text-muted-foreground max-w-2xl">
        Track your journey and visualize your improvement across different skills and subjects.
      </p>
      
      <ProgressTracker />
    </motion.div>
  );
};

export default Progress;
