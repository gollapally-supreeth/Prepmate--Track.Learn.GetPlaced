
import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Plus, Pin, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAIAssistant } from './AIAssistantContext';
import { motion } from 'framer-motion';

const ChatSidebar: React.FC = () => {
  const { 
    sessions, 
    activeSession, 
    activateSession, 
    deleteSession, 
    newSession 
  } = useAIAssistant();
  
  // Format date to show today, yesterday or date
  const formatDate = (date: Date) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const messageDate = new Date(date);
    const messageDay = new Date(messageDate.getFullYear(), messageDate.getMonth(), messageDate.getDate());
    
    if (messageDay.getTime() === today.getTime()) {
      return 'Today';
    } else if (messageDay.getTime() === yesterday.getTime()) {
      return 'Yesterday';
    } else {
      return messageDate.toLocaleDateString();
    }
  };

  const groupedSessions = React.useMemo(() => {
    const groups: Record<string, typeof sessions> = {};
    
    sessions.forEach(session => {
      const dateString = formatDate(session.createdAt);
      if (!groups[dateString]) {
        groups[dateString] = [];
      }
      groups[dateString].push(session);
    });
    
    return groups;
  }, [sessions]);

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b">
        <Button 
          variant="outline" 
          className="w-full justify-start gap-2" 
          onClick={newSession}
        >
          <Plus size={16} />
          <span>New Chat</span>
        </Button>
      </div>
      
      <ScrollArea className="flex-1">
        {Object.entries(groupedSessions).length > 0 ? (
          <div className="p-3 space-y-6">
            {Object.entries(groupedSessions).map(([date, dateSessions]) => (
              <div key={date}>
                <h3 className="text-xs font-medium text-muted-foreground mb-2">{date}</h3>
                <div className="space-y-1">
                  {dateSessions.map(session => (
                    <motion.div
                      key={session.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="relative group"
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "w-full justify-start text-left h-auto py-2 px-3",
                          session.id === activeSession?.id && "bg-accent"
                        )}
                        onClick={() => activateSession(session.id)}
                      >
                        <div className="flex items-center gap-2 w-full overflow-hidden">
                          <MessageSquare size={15} className="flex-shrink-0" />
                          <span className="truncate flex-1">{session.title}</span>
                        </div>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => deleteSession(session.id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            <p>No chat history yet</p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default ChatSidebar;
