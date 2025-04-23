
export type AIMessageType = 'user' | 'assistant' | 'system' | 'error';

export interface AIMessage {
  id: string;
  content: string;
  type: AIMessageType;
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  messages: AIMessage[];
  isPinned?: boolean;
  tags?: string[];
}
