
import React from 'react';
import MockTestsSection from '@/components/MockTestsSection';
import { motion } from 'framer-motion';
import { BookCheck } from 'lucide-react';

const Quizzes = () => {
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
            <BookCheck className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-3xl font-bold gradient-heading">Mock Tests</h1>
        </div>
      </div>
      
      <p className="text-muted-foreground max-w-2xl">
        Practice makes perfect. Take these mock tests to evaluate your knowledge and improve your skills for 
        technical interviews and assessments.
      </p>
      
      <MockTestsSection />
    </motion.div>
  );
};

export default Quizzes;
