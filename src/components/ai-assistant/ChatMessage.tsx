
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bot, User, AlertTriangle, Copy, ThumbsUp, ThumbsDown, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { AIMessage } from './types';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface ChatMessageProps {
  message: AIMessage;
  onFeedback?: (messageId: string, feedback: 'positive' | 'negative') => void;
  onCopy?: (content: string) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ 
  message, 
  onFeedback,
  onCopy
}) => {
  const isUser = message.type === 'user';
  const isError = message.type === 'error';
  const isSystemMessage = message.type === 'system';
  const isLoading = message.isLoading;
  const { toast } = useToast();
  
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

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    if (onCopy) {
      onCopy(message.content);
    }
    toast({
      description: "Message copied to clipboard",
      duration: 2000,
    });
  };

  const handleFeedback = (feedback: 'positive' | 'negative') => {
    if (onFeedback) {
      onFeedback(message.id, feedback);
    }
    toast({
      description: feedback === 'positive' ? "Thanks for your feedback!" : "We'll work to improve this response",
      duration: 2000,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "py-6 px-4 group first:pt-4 last:pb-4 hover:bg-muted/40 transition-colors",
        isUser && "bg-muted/30"
      )}
    >
      <div className="max-w-3xl mx-auto flex gap-4 items-start">
        <Avatar className={cn(
          "h-8 w-8 mt-0.5 shrink-0",
          isUser ? "bg-primary" : "bg-gradient-to-br from-purple-600 to-indigo-600",
          isError && "bg-destructive/10"
        )}>
          <AvatarFallback className={cn(
            isUser ? "bg-primary text-primary-foreground" : "bg-gradient-to-br from-purple-600 to-indigo-600 text-white",
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
        
        <div className="flex-1 space-y-2">
          <div className="text-sm font-medium">
            {isUser ? "You" : "PrepMate Assistant"}
          </div>
          
          <div className="relative">
            {isLoading ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Generating response...</span>
              </div>
            ) : isUser ? (
              <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                {message.content}
              </div>
            ) : (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown>
                  {message.content}
                </ReactMarkdown>
              </div>
            )}
          </div>
          
          {!isUser && !isLoading && !isError && (
            <div className="flex gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-2 text-muted-foreground hover:text-foreground"
                onClick={handleCopy}
              >
                <Copy className="h-3.5 w-3.5 mr-1" />
                <span className="text-xs">Copy</span>
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className={cn(
                  "h-8 px-2 text-muted-foreground hover:text-foreground",
                  message.feedback === 'positive' && "text-green-600 hover:text-green-600"
                )}
                onClick={() => handleFeedback('positive')}
              >
                <ThumbsUp className="h-3.5 w-3.5 mr-1" />
                <span className="text-xs">Helpful</span>
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className={cn(
                  "h-8 px-2 text-muted-foreground hover:text-foreground",
                  message.feedback === 'negative' && "text-red-600 hover:text-red-600"
                )}
                onClick={() => handleFeedback('negative')}
              >
                <ThumbsDown className="h-3.5 w-3.5 mr-1" />
                <span className="text-xs">Not helpful</span>
              </Button>
            </div>
          )}
          
          <div className="text-xs text-muted-foreground mt-1">
            {new Date(message.timestamp).toLocaleTimeString()}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatMessage;
