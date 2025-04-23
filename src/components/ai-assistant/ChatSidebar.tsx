import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MessageSquare, 
  Plus, 
  Pin, 
  Trash2, 
  Search,
  Filter,
  X,
  Calendar,
  Code,
  FileCheck,
  GraduationCap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAIAssistant } from './AIAssistantContext';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from '@/components/ui/separator';

const ChatSidebar: React.FC = () => {
  const { 
    sessions, 
    activeSession, 
    activateSession, 
    deleteSession, 
    newSession 
  } = useAIAssistant();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<string | null>(null);
  
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
      return messageDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    }
  };

  const getCategoryIcon = (session: any) => {
    const firstMessage = session.messages[0]?.content?.toLowerCase() || '';
    
    if (firstMessage.includes('interview') || firstMessage.includes('behavioral')) {
      return <GraduationCap size={14} className="text-amber-500" />;
    } else if (firstMessage.includes('dsa') || firstMessage.includes('algorithm') || firstMessage.includes('coding')) {
      return <Code size={14} className="text-blue-500" />;
    } else if (firstMessage.includes('resume') || firstMessage.includes('cv')) {
      return <FileCheck size={14} className="text-green-500" />;
    } else if (firstMessage.includes('study') || firstMessage.includes('plan')) {
      return <Calendar size={14} className="text-purple-500" />;
    } else {
      return <MessageSquare size={14} className="text-gray-500" />;
    }
  };

  const filteredSessions = sessions.filter(session => {
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesTitle = session.title.toLowerCase().includes(query);
      const matchesContent = session.messages.some(msg => 
        msg.content.toLowerCase().includes(query)
      );
      if (!matchesTitle && !matchesContent) return false;
    }
    
    // Apply category filter
    if (filter) {
      // This is a simplified version - in a real app you'd have proper categories
      const firstMessage = session.messages[0]?.content?.toLowerCase() || '';
      if (filter === 'interview' && !firstMessage.includes('interview')) return false;
      if (filter === 'dsa' && !firstMessage.includes('dsa') && !firstMessage.includes('algorithm')) return false;
      if (filter === 'resume' && !firstMessage.includes('resume')) return false;
    }
    
    return true;
  });

  const groupedSessions = React.useMemo(() => {
    const groups: Record<string, typeof filteredSessions> = {};
    
    filteredSessions.forEach(session => {
      const dateString = formatDate(session.createdAt);
      if (!groups[dateString]) {
        groups[dateString] = [];
      }
      groups[dateString].push(session);
    });
    
    return groups;
  }, [filteredSessions]);

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b">
        <Button 
          variant="outline" 
          className="w-full justify-start gap-2 mb-3" 
          onClick={newSession}
        >
          <Plus size={16} />
          <span>New Chat</span>
        </Button>
        
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search chats..." 
            className="pl-9 pr-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1 h-7 w-7"
              onClick={() => setSearchQuery('')}
            >
              <X size={14} />
            </Button>
          )}
        </div>
        
        <div className="flex mt-3 justify-between items-center">
          <span className="text-xs text-muted-foreground font-medium">FILTER BY</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-7 px-2">
                <Filter size={14} className="mr-1" />
                <span className="text-xs">Filter</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFilter(null)}>
                All Chats
              </DropdownMenuItem>
              <Separator className="my-1" />
              <DropdownMenuItem onClick={() => setFilter('interview')}>
                Interview Prep
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('dsa')}>
                DSA Practice
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('resume')}>
                Resume Review
              </DropdownMenuItem>
              <Separator className="my-1" />
              <DropdownMenuItem onClick={() => setFilter('pinned')}>
                Pinned Only
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {filter && (
          <div className="mt-2 flex items-center">
            <Badge variant="outline" className="flex items-center gap-1 text-xs">
              {filter === 'interview' && "Interview Prep"}
              {filter === 'dsa' && "DSA Practice"}
              {filter === 'resume' && "Resume Review"}
              {filter === 'pinned' && "Pinned Only"}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 ml-1 p-0" 
                onClick={() => setFilter(null)}
              >
                <X size={10} />
              </Button>
            </Badge>
          </div>
        )}
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
                          session.id === activeSession?.id && "bg-muted"
                        )}
                        onClick={() => activateSession(session.id)}
                      >
                        <div className="flex items-center gap-2 w-full overflow-hidden">
                          {getCategoryIcon(session)}
                          <span className="truncate flex-1">{session.title}</span>
                          {session.isPinned && (
                            <Pin size={13} className="text-primary flex-shrink-0" />
                          )}
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
            <p>{searchQuery ? 'No matching chats found' : 'No chat history yet'}</p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default ChatSidebar;
