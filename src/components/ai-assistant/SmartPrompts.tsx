import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Code, 
  FileCheck, 
  MessageSquare, 
  Lightbulb, 
  Calendar,
  GraduationCap,
  BookOpen
} from 'lucide-react';
import { motion } from 'framer-motion';
import { SmartPrompt } from './types';

interface SmartPromptsProps {
  onSelectPrompt: (prompt: string) => void;
}

const SmartPrompts: React.FC<SmartPromptsProps> = ({ onSelectPrompt }) => {
  const prompts: SmartPrompt[] = [
    {
      title: "Mock Interview",
      description: "Practice a technical interview",
      prompt: "Can you simulate a technical interview with me for a software engineering role? Start with a DSA question.",
      icon: MessageSquare,
      category: "interview"
    },
    {
      title: "Resume Review",
      description: "Get feedback on your resume",
      prompt: "I'd like you to help me optimize my resume for ATS systems. What are the key things I should include and what should I avoid?",
      icon: FileCheck,
      category: "resume"
    },
    {
      title: "DSA Practice",
      description: "Get a coding challenge",
      prompt: "Give me a medium difficulty data structure and algorithm problem to solve, and then help me work through it step by step.",
      icon: Code,
      category: "dsa"
    },
    {
      title: "Project Ideas",
      description: "Get project suggestions",
      prompt: "Can you suggest 3 project ideas that would showcase my skills as a computer science student? I'm interested in web development and AI.",
      icon: Lightbulb,
      category: "project"
    },
    {
      title: "Study Plan",
      description: "Create a learning roadmap",
      prompt: "I want to create a study plan for the next 4 weeks to prepare for my data structures and algorithms exam. Can you help me organize topics by week?",
      icon: Calendar,
      category: "general"
    },
    {
      title: "Interview Tips",
      description: "Advice for tech interviews",
      prompt: "What are the most common behavioral questions in tech interviews, and how should I structure my answers using the STAR method?",
      icon: GraduationCap,
      category: "interview"
    },
    {
      title: "Learning Path",
      description: "Structured learning guide",
      prompt: "I'm a second-year CS student. Can you create a learning path for me to become proficient in machine learning over the next 6 months?",
      icon: BookOpen,
      category: "general"
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3"
    >
      {prompts.map((prompt, index) => (
        <motion.div key={index} variants={item}>
          <Button
            variant="outline"
            className="h-auto w-full py-4 px-4 flex flex-col items-start text-left gap-2 group hover:border-primary/50 hover:bg-primary/5 transition-colors"
            onClick={() => onSelectPrompt(prompt.prompt)}
          >
            <div className="bg-primary/10 p-2 rounded-md group-hover:bg-primary/20 transition-colors">
              <prompt.icon className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-1">
              <p className="font-medium">{prompt.title}</p>
              <p className="text-xs text-muted-foreground">{prompt.description}</p>
            </div>
          </Button>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default SmartPrompts;
