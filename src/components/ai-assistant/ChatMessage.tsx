
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bot, User, AlertTriangle, Copy, ThumbsUp, ThumbsDown, Loader2, RotateCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { AIMessage } from './types';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';

interface ChatMessageProps {
  message: AIMessage;
  onFeedback?: (messageId: string, feedback: 'positive' | 'negative') => void;
  onCopy?: (content: string) => void;
  onRegenerate?: () => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ 
  message, 
  onFeedback,
  onCopy,
  onRegenerate
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(
        "py-6 px-4 sm:px-8 group first:pt-4 last:pb-24",
        isUser ? "bg-transparent" : "bg-muted/10"
      )}
    >
      <div className="max-w-3xl mx-auto flex gap-4 items-start">
        <Avatar className={cn(
          "h-8 w-8 mt-0.5 rounded-xl shrink-0",
          isUser ? "bg-muted-foreground" : "bg-gradient-to-br from-purple-600 to-indigo-600",
          isError && "bg-destructive"
        )}>
          <AvatarFallback className={cn(
            isUser ? "bg-muted-foreground text-background" : "bg-gradient-to-br from-purple-600 to-indigo-600 text-white",
            isError && "bg-destructive text-destructive-foreground"
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
        
        <div className="flex-1 space-y-1">
          <div className="text-sm font-medium">
            {isUser ? "You" : "PrepMate AI"}
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
            <div className="flex flex-wrap gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button 
                variant="secondary" 
                size="sm" 
                className="h-8 px-3 text-xs font-normal"
                onClick={handleCopy}
              >
                <Copy className="h-3.5 w-3.5 mr-2" />
                <span>Copy</span>
              </Button>
              
              {onRegenerate && (
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="h-8 px-3 text-xs font-normal"
                  onClick={onRegenerate}
                >
                  <RotateCw className="h-3.5 w-3.5 mr-2" />
                  <span>Regenerate</span>
                </Button>
              )}
              
              <Button 
                variant="secondary" 
                size="sm" 
                className={cn(
                  "h-8 px-3 text-xs font-normal",
                  message.feedback === 'positive' && "bg-primary/10 text-primary"
                )}
                onClick={() => handleFeedback('positive')}
              >
                <ThumbsUp className="h-3.5 w-3.5 mr-2" />
                <span>Helpful</span>
              </Button>
              
              <Button 
                variant="secondary" 
                size="sm" 
                className={cn(
                  "h-8 px-3 text-xs font-normal",
                  message.feedback === 'negative' && "bg-destructive/10 text-destructive"
                )}
                onClick={() => handleFeedback('negative')}
              >
                <ThumbsDown className="h-3.5 w-3.5 mr-2" />
                <span>Not helpful</span>
              </Button>
            </div>
          )}
          
          <div className="text-xs text-muted-foreground mt-1">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatMessage;
