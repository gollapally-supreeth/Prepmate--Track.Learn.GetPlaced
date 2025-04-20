
import React from 'react';
import NotesSection from '@/components/NotesSection';
import { motion } from 'framer-motion';

const Notes = () => {
  return (
    <motion.div 
      className="container mx-auto space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center gap-2">
        <div className="h-8 w-1 bg-primary rounded-full animate-pulse-subtle"></div>
        <h1 className="text-3xl font-bold gradient-heading">Notes</h1>
      </div>
      
      <p className="text-muted-foreground">
        Capture and organize your thoughts, ideas, and important concepts.
      </p>
      
      <NotesSection />
    </motion.div>
  );
};

export default Notes;
