export type AIMessageType = 'user' | 'assistant' | 'system' | 'error';

export interface AIMessage {
  id: string;
  content: string;
  type: AIMessageType;
  timestamp: Date;
  isLoading?: boolean;
  feedback?: 'positive' | 'negative' | null;
  isImportant?: boolean;
  note?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  messages: AIMessage[];
  isPinned?: boolean;
  tags?: string[];
  category?: 'general' | 'dsa' | 'resume' | 'interview' | 'project';
}

export interface SmartPrompt {
  title: string;
  description: string;
  prompt: string;
  icon: React.ComponentType<{ className?: string }>;
  category?: 'general' | 'dsa' | 'resume' | 'interview' | 'project';
}

export interface SmartSuggestion {
  text: string;
  prompt: string;
}

// Add Badge component import to AIAssistant page
import { Badge } from "@/components/ui/badge";
