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
  GraduationCap,
  Edit2,
  Check,
  X as XIcon,
  MoreHorizontal
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
import { useToast } from '@/components/ui/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const ChatSidebar: React.FC = () => {
  const { 
    sessions, 
    activeSession, 
    activateSession, 
    deleteSession, 
    newSession,
    updateSessionTitle,
    pinSession,
    tagSession
  } = useAIAssistant();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<string | null>(null);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const { toast } = useToast();
  
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

  const handleEdit = (session: any) => {
    setEditingSessionId(session.id);
    setEditTitle(session.title);
  };

  const handleEditCancel = () => {
    setEditingSessionId(null);
    setEditTitle('');
  };

  const handleEditSave = async (session: any) => {
    if (!editTitle.trim()) return;
    try {
      await updateSessionTitle(session.id, editTitle);
      setEditingSessionId(null);
      setEditTitle('');
    } catch (err) {
      toast({ title: 'Error', description: 'Could not rename session', variant: 'destructive' });
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b">
        <div className="flex justify-center mb-4">
        <Button 
          variant="outline" 
            className="w-full max-w-[180px] justify-center gap-2 rounded-lg border bg-background hover:bg-muted shadow-sm transition-colors"
          onClick={newSession}
            aria-label="Start New Chat"
        >
          <Plus size={16} />
            <span>Start New Chat</span>
        </Button>
        </div>
        
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
                      className="relative group rounded-lg overflow-hidden"
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "w-full justify-start text-left h-auto py-3 px-3",
                          "relative flex items-center rounded-lg transition-colors",
                          "hover:bg-accent group-hover:bg-accent",
                          session.id === activeSession?.id && "bg-accent border-l-4 border-primary shadow-md"
                        )}
                        onClick={() => activateSession(session.id)}
                        aria-label={`Open chat session: ${session.title}`}
                      >
                        <div className="flex items-center gap-2 w-full overflow-hidden pr-8">
                          {/* Pin icon */}
                          <Button
                            variant="ghost"
                            size="icon"
                            className={cn(
                              "h-6 w-6 p-0 mr-1 text-yellow-400 hover:bg-transparent focus:bg-transparent transition-opacity",
                              session.isPinned ? "opacity-100" : "opacity-20 group-hover:opacity-80"
                            )}
                            title={session.isPinned ? "Unpin" : "Pin"}
                            tabIndex={-1}
                            onClick={e => { e.stopPropagation(); pinSession(session.id); }}
                            aria-label={session.isPinned ? "Unpin session" : "Pin session"}
                          >
                            <Pin size={14} fill={session.isPinned ? "#facc15" : "none"} />
                          </Button>
                          {/* Tag display */}
                          {session.tags && session.tags.length > 0 && (
                            <span className="inline-block w-2 h-2 rounded-full mr-1" style={{ background: session.tags[0] }} title={session.tags[0]}></span>
                          )}
                          {getCategoryIcon(session)}
                          {editingSessionId === session.id ? (
                            <form onSubmit={e => { e.preventDefault(); handleEditSave(session); }} className="flex items-center gap-1 w-full">
                              <Input
                                value={editTitle}
                                onChange={e => setEditTitle(e.target.value)}
                                autoFocus
                                className="h-7 px-2 text-xs flex-1"
                                maxLength={60}
                              />
                              <Button type="submit" size="icon" variant="ghost" className="h-7 w-7 p-0"><Check size={14} /></Button>
                              <Button type="button" size="icon" variant="ghost" className="h-7 w-7 p-0" onClick={handleEditCancel}><XIcon size={14} /></Button>
                            </form>
                          ) : (
                            <>
                              <span
                                className="truncate flex-1 text-xs font-medium max-w-[140px] sm:max-w-[180px] md:max-w-[200px]"
                                style={{ lineHeight: '1.1', whiteSpace: 'nowrap' }}
                                title={session.title}
                              >
                                {session.title}
                              </span>
                              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className={cn(
                                        "h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity",
                                        "hover:bg-accent-foreground/10"
                                      )}
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <MoreHorizontal size={16} className="text-muted-foreground" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="w-40">
                                    <DropdownMenuItem 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleEdit(session);
                                      }}
                                      className="gap-2"
                                    >
                                      <Edit2 size={14} />
                                      <span>Rename</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        deleteSession(session.id);
                                      }}
                                      className="gap-2 text-destructive focus:text-destructive"
                                    >
                                      <Trash2 size={14} />
                                      <span>Delete</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={e => { e.stopPropagation(); pinSession(session.id); }} className="gap-2" aria-label={session.isPinned ? "Unpin session" : "Pin session"}>
                                      <Pin size={14} />
                                      <span>{session.isPinned ? "Unpin" : "Pin"}</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={e => { e.stopPropagation(); tagSession(session.id, prompt('Enter tag/color:') || ''); }} className="gap-2" aria-label="Tag session">
                                      <span className="inline-block w-2 h-2 rounded-full mr-1 bg-gray-400"></span>
                                      <span>Tag</span>
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </>
                          )}
                        </div>
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
