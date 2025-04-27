import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bot, User, AlertTriangle, Copy, ThumbsUp, ThumbsDown, Loader2, RotateCw, Star, StickyNote, Edit2, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { AIMessage } from './types';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { useAIAssistant } from './AIAssistantContext';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from '@/hooks/use-theme';

// NOTE: Run `npm install react-syntax-highlighter` if you haven't already.

// Extend AIMessage type for UI purposes
interface AIMessageWithExtras extends AIMessage {
  isImportant?: boolean;
  note?: string;
}

interface ChatMessageProps {
  message: AIMessage;
  onFeedback?: (messageId: string, feedback: 'positive' | 'negative') => void;
  onCopy?: (content: string) => void;
  onRegenerate?: () => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ 
  message: rawMessage, 
  onFeedback,
  onCopy,
  onRegenerate
}) => {
  const { theme } = useTheme();
  const message = rawMessage as AIMessageWithExtras;
  // Robustly determine sender for alignment and label
  const isUser = message.type === 'user';
  const isAI = message.type === 'assistant';
  const isError = message.type === 'error';
  const isSystemMessage = message.type === 'system';
  const isLoading = message.isLoading;
  const { toast } = useToast();
  const { toggleImportantMessage, addNoteToMessage } = useAIAssistant();
  const [showFull, setShowFull] = useState(false);
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(message.content);

  // Helper for long messages
  const isLong = message.content.length > 600;
  const displayContent = isLong && !showFull ? message.content.slice(0, 600) + '...' : message.content;

  // Markdown render with code highlighting
  const renderers = {
    code({node, inline, className, children, ...props}: any) {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <SyntaxHighlighter style={oneDark} language={match[1]} PreTag="div" {...props}>
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props}>{children}</code>
      );
    }
  };
  
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

  const handleDelete = () => {
    toast({ description: 'Delete functionality not implemented', duration: 2000 });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleEditSave = () => {
    setIsEditing(false);
    toast({ description: 'Edit functionality not implemented', duration: 2000 });
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditText(message.content);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(
        "py-1 px-3 sm:px-6 group relative first:pt-1 last:pb-6",
        isUser
          ? "justify-end flex-row-reverse"
          : "justify-start flex-row",
        "flex"
      )}
      aria-label={isUser ? 'Your message' : 'PrepMate AI response'}
      style={{ marginBottom: '4px' }}
    >
      <div className={cn(
        "transition-all duration-200",
        "max-w-2xl flex gap-2 items-start w-full",
        isUser ? "flex-row-reverse text-right ml-auto" : "flex-row text-left mr-auto",
        "group-hover:shadow-lg group-hover:bg-primary/5 group-hover:dark:bg-primary/20"
      )}>
        <Avatar className={cn(
          "h-7 w-7 mt-0.5 rounded-lg shrink-0",
          isUser ? "bg-primary text-white ml-1" : "bg-gradient-to-br from-purple-600 to-indigo-600 mr-1",
          isError && "bg-destructive"
        )}>
          <AvatarFallback className={cn(
            isUser ? "bg-primary text-white" : "bg-gradient-to-br from-purple-600 to-indigo-600 text-white",
            isError && "bg-destructive text-destructive-foreground"
          )}>
            {isUser ? (
              <User size={14} />
            ) : isError ? (
              <AlertTriangle size={14} />
            ) : (
              <Bot size={14} />
            )}
          </AvatarFallback>
        </Avatar>
        <div className={cn(
          "flex-1 space-y-0.5",
          isUser ? "items-end" : "items-start"
        )}>
          <div className={cn(
            "text-[11px] font-medium mb-0.5 opacity-60",
            isUser ? "text-primary text-right" : "text-purple-700 text-left dark:text-purple-300"
          )}>
            {isUser ? "You" : "PrepMate AI"}
          </div>
          <div className={cn(
            "relative",
            isUser ? "ml-auto" : "mr-auto"
          )}>
            {isEditing ? (
              <form className="flex gap-2 items-center" onSubmit={e => { e.preventDefault(); handleEditSave(); }}>
                <input
                  className="flex-1 border rounded px-2 py-1 text-xs"
                  value={editText}
                  onChange={e => setEditText(e.target.value)}
                  autoFocus
                />
                <Button type="submit" size="sm" className="text-xs">Save</Button>
                <Button type="button" size="sm" className="text-xs" onClick={handleEditCancel}>Cancel</Button>
              </form>
            ) : isLoading ? (
              <div className="flex items-center gap-2 text-muted-foreground text-xs">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Generating response…</span>
              </div>
            ) : isUser ? (
              <div className={cn(
                "whitespace-pre-wrap px-4 py-2 rounded-xl text-right ml-auto",
                theme === 'dark' ? 'bg-purple-900 text-purple-100' : 'bg-purple-100 text-purple-900'
              )}>
                {message.content}
              </div>
            ) : (
              <div className="bg-background/80 border border-muted rounded-xl px-4 py-3 text-foreground text-left shadow-sm max-w-full">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown components={renderers}>
                    {displayContent}
                  </ReactMarkdown>
                </div>
                {isLong && (
                  <Button variant="link" size="sm" className="px-0 mt-1 text-xs" onClick={() => setShowFull(v => !v)}>
                    {showFull ? "Show less" : "Show more"}
                  </Button>
                )}
              </div>
            )}
          </div>
          {/* Action bar below the message bubble, only on hover */}
          <div className={cn(
            "flex gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-all duration-200",
            isUser ? "justify-end" : "justify-start"
          )}>
            {isUser ? (
              <>
                <Button variant="ghost" size="icon" className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground" onClick={handleEdit} title="Edit">
                  <Edit2 size={15} />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground" onClick={handleCopy} title="Copy">
                  <Copy size={15} />
                </Button>
              </>
            ) : isAI ? (
              <>
                <Button variant="ghost" size="icon" className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground" onClick={handleCopy} title="Copy">
                  <Copy size={15} />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 p-0 text-green-500 hover:text-green-700" onClick={() => onFeedback && onFeedback(message.id, 'positive')} title="Good">
                  <ThumbsUp size={15} />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 p-0 text-red-500 hover:text-red-700" onClick={() => onFeedback && onFeedback(message.id, 'negative')} title="Bad">
                  <ThumbsDown size={15} />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground" title="More Gemini features">
                  <RotateCw size={15} />
                </Button>
              </>
            ) : null}
          </div>
          {/* End action bar */}
          {showNoteInput && (
            <form className="mt-2 flex gap-2" onSubmit={e => { e.preventDefault(); addNoteToMessage(message.id, noteText); setNoteText(''); setShowNoteInput(false); }}>
              <input
                className="flex-1 border rounded px-2 py-1 text-xs"
                placeholder="Add a note..."
                value={noteText}
                onChange={e => setNoteText(e.target.value)}
                autoFocus
              />
              <Button type="submit" size="sm" className="text-xs">Save</Button>
            </form>
          )}
          {message.note && (
            <div className="mt-2 p-2 bg-muted/40 rounded text-xs flex items-start gap-2">
              <StickyNote className="h-4 w-4 text-muted-foreground mt-0.5" />
              <span>{message.note}</span>
            </div>
          )}
          <div className="text-[10px] text-muted-foreground mt-0.5">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatMessage;
