
import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bot, User, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { AIMessage } from './types';
import ReactMarkdown from 'react-markdown';

interface ChatMessageProps {
  message: AIMessage;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.type === 'user';
  const isError = message.type === 'error';
  const isSystemMessage = message.type === 'system';
  
  if (isSystemMessage) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center my-2 px-4 py-1 bg-muted/20 rounded-full text-xs text-muted-foreground inline-block mx-auto"
      >
        {message.content}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex gap-3 items-start",
        isUser && "flex-row-reverse"
      )}
    >
      <Avatar className={cn(
        "h-8 w-8 mt-0.5",
        isUser ? "bg-primary" : "bg-primary/10",
        isError && "bg-destructive/10"
      )}>
        <AvatarFallback className={cn(
          isUser ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary",
          isError && "bg-destructive/10 text-destructive"
        )}>
          {isUser ? (
            <User size={16} />
          ) : isError ? (
            <AlertTriangle size={16} />
          ) : (
            <Bot size={16} />
          )}
        </AvatarFallback>
      </Avatar>
      
      <div className={cn(
        "rounded-lg px-4 py-3 max-w-[85%]",
        isUser ? "bg-primary text-primary-foreground" : "bg-muted",
        isError && "bg-destructive/10 text-destructive border border-destructive/20"
      )}>
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown>
              {message.content}
            </ReactMarkdown>
          </div>
        )}
        <div className={cn(
          "text-xs mt-1 opacity-70",
          isUser ? "text-primary-foreground" : "text-muted-foreground"
        )}>
          {new Date(message.timestamp).toLocaleTimeString()}
        </div>
      </div>
    </motion.div>
  );
};

export default ChatMessage;
