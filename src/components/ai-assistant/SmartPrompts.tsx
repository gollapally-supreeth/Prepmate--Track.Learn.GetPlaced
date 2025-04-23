
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Code, 
  FileCheck, 
  MessageSquare, 
  Lightbulb, 
  Calendar
} from 'lucide-react';

interface SmartPromptsProps {
  onSelectPrompt: (prompt: string) => void;
}

const SmartPrompts: React.FC<SmartPromptsProps> = ({ onSelectPrompt }) => {
  const prompts = [
    {
      title: "Mock Interview",
      description: "Practice a technical interview",
      prompt: "Can you simulate a technical interview with me for a software engineering role? Start with a DSA question.",
      icon: MessageSquare
    },
    {
      title: "Resume Review",
      description: "Get feedback on your resume",
      prompt: "I'd like you to help me optimize my resume for ATS systems. What are the key things I should include and what should I avoid?",
      icon: FileCheck
    },
    {
      title: "DSA Practice",
      description: "Get a coding challenge",
      prompt: "Give me a medium difficulty data structure and algorithm problem to solve, and then help me work through it step by step.",
      icon: Code
    },
    {
      title: "Project Idea",
      description: "Get project suggestions",
      prompt: "Can you suggest 3 project ideas that would showcase my skills as a computer science student? I'm interested in web development and AI.",
      icon: Lightbulb
    },
    {
      title: "Study Plan",
      description: "Create a learning roadmap",
      prompt: "I want to create a study plan for the next 4 weeks to prepare for my data structures and algorithms exam. Can you help me organize topics by week?",
      icon: Calendar
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
      {prompts.map((prompt, index) => (
        <Button
          key={index}
          variant="outline"
          className="h-auto py-3 px-4 flex flex-col items-center text-center gap-2"
          onClick={() => onSelectPrompt(prompt.prompt)}
        >
          <prompt.icon className="h-5 w-5 text-primary" />
          <div>
            <p className="font-medium">{prompt.title}</p>
            <p className="text-xs text-muted-foreground">{prompt.description}</p>
          </div>
        </Button>
      ))}
    </div>
  );
};

export default SmartPrompts;
