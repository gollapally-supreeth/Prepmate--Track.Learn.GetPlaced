import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Send, User, Bot, Cpu, Briefcase, Loader2, RefreshCcw, Star, ThumbsUp, ThumbsDown, List, X, Edit2, Trash2, Database, Globe, Layers, Code2, BookOpen, BarChart2, ChevronLeft, ChevronRight, Check, Plus, MoreVertical, ClipboardList, PenLine, Download, Clipboard, ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

// Define message interface
interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot' | 'assistant';
  timestamp: Date;
  feedback?: 'positive' | 'negative' | null;
}

// Define interview topics
type TopicType = 'hr' | 'technical' | 'fundamentals' | 'systemdesign' | 'aptitude' | 'dbms' | 'networking' | 'webdev' | 'oops';

interface Topic {
  id: TopicType;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface InterviewSession {
  id: string;
  topic: TopicType;
  startedAt: Date;
  messages: Message[];
  ended: boolean;
  title: string;
}

const topics: Topic[] = [
  { id: 'hr', title: 'HR/Behavioral', description: 'Behavioral & general questions', icon: <User size={18} /> },
  { id: 'technical', title: 'Technical (DSA/Coding)', description: 'DSA and coding concepts', icon: <Cpu size={18} /> },
  { id: 'fundamentals', title: 'Computer Fundamentals', description: 'CS basics, OS, CN, etc.', icon: <BookOpen size={18} /> },
  { id: 'systemdesign', title: 'System Design', description: 'Design scalable systems', icon: <Layers size={18} /> },
  { id: 'aptitude', title: 'Aptitude/Logical', description: 'Aptitude & logical reasoning', icon: <BarChart2 size={18} /> },
  { id: 'dbms', title: 'DBMS', description: 'Database concepts', icon: <Database size={18} /> },
  { id: 'networking', title: 'Networking', description: 'Computer networks', icon: <Globe size={18} /> },
  { id: 'webdev', title: 'Web Development', description: 'Frontend & backend web', icon: <Code2 size={18} /> },
  { id: 'oops', title: 'OOPs/Software Engg.', description: 'OOPs, SDLC, etc.', icon: <Briefcase size={18} /> },
];

// Add detailed prompts for each interview type
const interviewPrompts: Record<TopicType, string> = {
  technical: `You are a senior software engineer conducting a technical interview for a software developer role.\n- Start the interview with a friendly greeting, a one-line explanation of the process, and the first question.\n- After each user answer, provide detailed, constructive feedback, then ask the next question.\n- Do not answer your own questions unless the user asks.\n- Be concise, professional, and expect code or pseudocode in answers.\n- Use real-world scenarios and industry best practices.`,
  hr: `You are an experienced HR manager conducting a behavioral interview for a corporate role.\n- Start the interview with a friendly greeting, a one-line explanation of the process, and the first question.\n- After each user answer, provide feedback on communication, clarity, and attitude, then ask the next question.\n- Be supportive, professional, and use realistic workplace scenarios.`,
  systemdesign: `You are a principal architect conducting a system design interview for a backend engineer.\n- Start the interview with a friendly greeting, a one-line explanation of the process, and the first question.\n- After each user answer, provide in-depth feedback on design choices, scalability, and best practices, then ask the next question.\n- Be technical, precise, and expect diagrams or architecture explanations.`,
  aptitude: `You are a quantitative analyst conducting an aptitude and logical reasoning interview.\n- Start the interview with a friendly greeting, a one-line explanation of the process, and the first question.\n- After each user answer, provide step-by-step feedback and the correct solution, then ask the next question.\n- Be clear, analytical, and professional.`,
  dbms: `You are a senior database administrator conducting a DBMS interview.\n- Start the interview with a friendly greeting, a one-line explanation of the process, and the first question.\n- After each user answer, provide detailed feedback and best practices, then ask the next question.\n- Be technical and precise.`,
  networking: `You are a network architect conducting a networking interview.\n- Start the interview with a friendly greeting, a one-line explanation of the process, and the first question.\n- After each user answer, provide technical feedback and practical advice, then ask the next question.\n- Be clear and professional.`,
  webdev: `You are a lead web developer conducting a web development interview.\n- Start the interview with a friendly greeting, a one-line explanation of the process, and the first question.\n- After each user answer, provide feedback on code quality, security, and best practices, then ask the next question.\n- Be modern, technical, and concise.`,
  oops: `You are a senior software engineer conducting an OOPs and software engineering interview.\n- Start the interview with a friendly greeting, a one-line explanation of the process, and the first question.\n- After each user answer, provide feedback on design, maintainability, and best practices, then ask the next question.\n- Be technical and professional.`,
  fundamentals: `You are a computer science professor conducting a fundamentals interview.\n- Start the interview with a friendly greeting, a one-line explanation of the process, and the first question.\n- After each user answer, provide feedback and further reading suggestions, then ask the next question.\n- Be clear, educational, and supportive.`
};

// --- Collapsible Sidebar ---
const InterviewSidebar: React.FC<{
  sessions: InterviewSession[];
  onSelectSession: (id: string) => void;
  onStartNew: (topic: TopicType) => void;
  activeSessionId: string | null;
  onClose: () => void;
  onEditTitle: (id: string, newTitle: string) => void;
  onDeleteSession: (id: string) => void;
  onExportSession: (id: string) => void;
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}> = ({ sessions, onSelectSession, onStartNew, activeSessionId, onClose, onEditTitle, onDeleteSession, onExportSession, collapsed, setCollapsed }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [showAllTopics, setShowAllTopics] = useState(false);
  // For closing menu on outside click
  const menuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      Object.entries(menuRefs.current).forEach(([id, ref]) => {
        if (ref && !ref.contains(event.target as Node)) {
          setMenuOpenId(prev => (prev === id ? null : prev));
        }
      });
    }
    if (menuOpenId !== null) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [menuOpenId]);
  return (
    <aside className={cn("transition-all duration-300 bg-background border-r flex flex-col h-full min-h-screen z-30", collapsed ? "w-16" : "w-72")}> 
      <div className="flex items-center justify-between p-4 border-b">
        <span className="font-bold text-lg flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)} className="mr-2">
            {collapsed ? <ChevronRight size={20}/> : <ChevronLeft size={20}/>} 
          </Button>
          {!collapsed && <><List size={20}/> Interview Sessions</>}
        </span>
        {!collapsed && <Button variant="ghost" size="icon" onClick={onClose} className="md:hidden"><X size={18}/></Button>}
      </div>
      {!collapsed && <div className="p-4" id="start-new-interview-section">
        <div className="mb-2 text-xs text-muted-foreground font-semibold">Start New Interview</div>
        <div className="flex flex-col gap-2">
          {(showAllTopics ? topics : topics.slice(0, 4)).map(topic => (
            <Button key={topic.id} variant="outline" className="justify-start gap-2" onClick={() => onStartNew(topic.id as TopicType)}>
              {topic.icon} <span>{topic.title}</span>
            </Button>
          ))}
          {topics.length > 4 && (
            <Button
              variant="ghost"
              size="sm"
              className="justify-start gap-2 text-xs text-muted-foreground mt-1"
              onClick={() => setShowAllTopics(v => !v)}
              aria-label={showAllTopics ? 'Show less topics' : 'Show more topics'}
            >
              {showAllTopics ? <ChevronUp size={16}/> : <ChevronDown size={16}/>} {showAllTopics ? 'Show less' : 'Show more'}
            </Button>
          )}
        </div>
      </div>}
      {!collapsed && <div className="px-4 py-2 text-xs text-muted-foreground font-semibold">History</div>}
      <div className={cn("flex-1 overflow-auto", collapsed && "pt-4")}> 
        {sessions.length === 0 ? (
          !collapsed && <div className="p-4 text-muted-foreground text-xs">No previous interviews.</div>
        ) : (
          <ul className={cn("divide-y", collapsed && "flex flex-col items-center gap-2 py-4 divide-y-0")}> 
            {sessions.map(session => {
              const stats = {
                questions: session.messages.filter(m => m.sender === 'bot' || m.sender === 'assistant').length,
                answers: session.messages.filter(m => m.sender === 'user').length,
                last: session.messages.length > 0 ? session.messages[session.messages.length-1].timestamp : session.startedAt
              };
              if (collapsed) {
                return (
                  <li key={session.id} className={cn('flex items-center justify-center w-full')}> 
                    <Button
                      variant={session.id === activeSessionId ? 'secondary' : 'ghost'}
                      size="icon"
                      className={cn('rounded-full h-10 w-10 flex items-center justify-center', session.id === activeSessionId && 'ring-2 ring-primary')}
                      onClick={() => onSelectSession(session.id)}
                      aria-current={session.id === activeSessionId}
                      tabIndex={0}
                      title={topics.find(t => t.id === session.topic)?.title}
                    >
                      {topics.find(t => t.id === session.topic)?.icon}
                    </Button>
                  </li>
                );
              }
              return (
                <li key={session.id} className={cn('group flex flex-col items-start relative py-2 px-2', session.id === activeSessionId && 'bg-muted/40 rounded-lg')}> 
                  <div className="flex items-center gap-2">
                    {topics.find(t => t.id === session.topic)?.icon}
                    <span className="font-semibold text-sm truncate">{session.title}</span>
                  </div>
                  <span className="text-xs text-muted-foreground ml-7 mb-1">{topics.find(t => t.id === session.topic)?.title}</span>
                  <div className="flex items-center gap-2 ml-7">
                    <span className="text-xs text-muted-foreground">{new Date(stats.last).toLocaleDateString()} {new Date(stats.last).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <span className="ml-2 text-xs px-2 py-0.5 rounded bg-primary/10 text-primary font-semibold">{stats.questions}Q/{stats.answers}A</span>
                  </div>
                  {/* Three dots menu click-to-open */}
                  <div
                    className={cn("absolute right-2 top-1/2 -translate-y-1/2 flex gap-1 z-10")}
                    ref={el => (menuRefs.current[session.id] = el)}
                  >
                    <Button size="icon" variant="ghost" className="h-7 w-7 p-0" onClick={() => setMenuOpenId(menuOpenId === session.id ? null : session.id)} title="More"><MoreVertical size={16}/></Button>
                    {menuOpenId === session.id && (
                      <div className="absolute right-8 top-0 bg-background border rounded shadow-lg flex flex-col min-w-[120px] animate-fade-in">
                        <Button variant="ghost" size="sm" className="justify-start gap-2" onClick={() => { setEditingId(session.id); setEditValue(session.title); setMenuOpenId(null); }}><Edit2 size={14}/> Rename</Button>
                        <Button variant="ghost" size="sm" className="justify-start gap-2" onClick={() => { onExportSession(session.id); setMenuOpenId(null); }}><Download size={14}/> Export</Button>
                        <Button variant="ghost" size="sm" className="justify-start gap-2 text-destructive" onClick={() => { onDeleteSession(session.id); setMenuOpenId(null); }}><Trash2 size={14}/> Delete</Button>
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </aside>
  );
};

// --- Modern Chat Background ---
const ChatBackground: React.FC = () => (
  <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#f8fafc] via-[#e0e7ef] to-[#f3f4f6] dark:from-[#181c20] dark:via-[#232946] dark:to-[#181c20]">
    <svg className="absolute top-0 left-0 w-full h-full opacity-10" viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="400" cy="300" rx="340" ry="180" fill="url(#paint0_radial)" />
      <defs>
        <radialGradient id="paint0_radial" cx="0" cy="0" r="1" gradientTransform="translate(400 300) scale(340 180)" gradientUnits="userSpaceOnUse">
          <stop stopColor="#a7bffa" />
          <stop offset="1" stopColor="#f472b6" stopOpacity="0.1" />
        </radialGradient>
      </defs>
    </svg>
  </div>
);

// --- Modern Message Bubble ---
const ReactionBar = ({ onReact }: { onReact: (emoji: string) => void }) => (
  <div className="flex gap-1 bg-white/80 dark:bg-muted/80 rounded-full px-2 py-1 shadow border border-muted-foreground/10">
    {['👍', '👏', '💡'].map(emoji => (
      <button key={emoji} className="hover:scale-125 transition-transform" onClick={() => onReact(emoji)}>{emoji}</button>
    ))}
  </div>
);

const InterviewMessage: React.FC<{
  message: Message;
  grouped?: boolean;
  isFirstInGroup?: boolean;
  onCopy?: (text: string) => void;
  onEdit?: (id: number, newText: string) => void;
  onDelete?: (id: number) => void;
}> = ({ message, grouped, isFirstInGroup, onCopy, onEdit, onDelete }) => {
  const [showReactions, setShowReactions] = useState(false);
  const [reaction, setReaction] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(message.text);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={cn(
        'relative flex gap-2 my-2 group',
        message.sender === 'user' ? 'justify-end' : 'justify-start'
      )}
      onMouseEnter={() => setShowReactions(true)}
      onMouseLeave={() => setShowReactions(false)}
    >
      {/* Sender label */}
      {isFirstInGroup && (
        <div className={cn(
          'absolute -top-6 text-xs font-semibold tracking-wide',
          message.sender === 'user' ? 'right-0 text-primary' : 'left-0 text-blue-700 dark:text-blue-300'
        )}>
          {message.sender === 'user' ? 'You' : 'PrepMate AI'}
        </div>
      )}
      {/* Avatar */}
      {message.sender !== 'user' && isFirstInGroup && (
        <Avatar className="h-8 w-8 mt-0.5 shadow-md bg-white dark:bg-[#232946]">
          <AvatarFallback><Bot size={16}/></AvatarFallback>
        </Avatar>
      )}
      {/* Normal message bubble */}
      <div className={cn(
        'relative max-w-[75%] px-4 py-2 transition-all',
        message.sender === 'user'
          ? 'ml-auto bg-blue-100 dark:bg-blue-900 text-foreground'
          : 'bg-gray-100 dark:bg-gray-800 mr-auto text-foreground',
        'rounded-lg',
        grouped && !isFirstInGroup && 'rounded-t-lg rounded-b-md mt-0.5',
        'border border-gray-200 dark:border-gray-700'
      )}
        style={{ borderRadius: 12 }}
      >
        {/* Message text or edit input */}
        {editing ? (
          <form onSubmit={e => { e.preventDefault(); onEdit && onEdit(message.id, editValue); setEditing(false); }} className="flex gap-2 items-center">
            <input
              className="flex-1 border rounded px-2 py-1 text-xs"
              value={editValue}
              onChange={e => setEditValue(e.target.value)}
              autoFocus
            />
            <Button type="submit" size="icon" variant="ghost" className="h-6 w-6 p-0"><Check size={14}/></Button>
            <Button type="button" size="icon" variant="ghost" className="h-6 w-6 p-0" onClick={() => { setEditing(false); setEditValue(message.text); }}><X size={14}/></Button>
          </form>
        ) : (
          <div className="text-sm whitespace-pre-line animate-fade-in leading-relaxed">{message.text}</div>
        )}
        {/* Timestamp and action bar */}
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[11px] text-muted-foreground cursor-pointer" title={message.timestamp.toLocaleString()}>{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          {/* Emoji reactions */}
          {showReactions && (
            <div className="ml-2"><ReactionBar onReact={setReaction} /></div>
          )}
          {reaction && <span className="ml-1 animate-bounce text-lg">{reaction}</span>}
          {/* Action bar on hover */}
          <div className={cn("flex gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity")}> 
            <Button size="icon" variant="ghost" className="h-5 w-5 p-0" onClick={() => onCopy && onCopy(message.text)} title="Copy"><Clipboard size={13}/></Button>
            {message.sender === 'user' && !editing && (
              <>
                <Button size="icon" variant="ghost" className="h-5 w-5 p-0" onClick={() => setEditing(true)} title="Edit"><Edit2 size={13}/></Button>
                <Button size="icon" variant="ghost" className="h-5 w-5 p-0 text-destructive" onClick={() => onDelete && onDelete(message.id)} title="Delete"><Trash2 size={13}/></Button>
              </>
            )}
          </div>
        </div>
      </div>
      {message.sender === 'user' && isFirstInGroup && (
        <Avatar className="h-8 w-8 mt-0.5 shadow-md bg-white dark:bg-[#232946]">
          <AvatarFallback><User size={16}/></AvatarFallback>
        </Avatar>
      )}
    </motion.div>
  );
};

// --- Interview Typing Indicator ---
const TypingIndicator: React.FC = () => (
  <div className="flex gap-2 my-8 items-center animate-fade-in">
    <span className="inline-block w-8 h-8 rounded-full bg-gradient-to-br from-blue-200 to-blue-100 flex items-center justify-center shadow-md">
      <ClipboardList className="text-primary animate-pulse" size={22}/>
    </span>
    <span className="text-base text-muted-foreground font-medium animate-pulse tracking-wide">The interviewer is reviewing your answer…</span>
    <span className="flex gap-1 ml-2">
      <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
      <span className="w-2 h-2 bg-blue-300 rounded-full animate-bounce" style={{ animationDelay: '100ms' }}></span>
      <span className="w-2 h-2 bg-blue-200 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></span>
    </span>
  </div>
);

const SessionSummaryModal: React.FC<{ open: boolean; onClose: () => void; session: InterviewSession | null }> = ({ open, onClose, session }) => {
  if (!open || !session) return null;
  const totalQuestions = session.messages.filter(m => m.sender === 'bot' || m.sender === 'assistant').length;
  const totalAnswers = session.messages.filter(m => m.sender === 'user').length;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-background rounded-xl shadow-xl p-8 w-full max-w-md animate-fade-in">
        <div className="flex items-center gap-2 mb-4">
          <Star className="text-yellow-400" size={24}/>
          <span className="text-xl font-bold">Session Summary</span>
        </div>
        <div className="mb-2 text-sm">Topic: <span className="font-medium">{topics.find(t => t.id === session.topic)?.title}</span></div>
        <div className="mb-2 text-sm">Questions: <span className="font-medium">{totalQuestions}</span></div>
        <div className="mb-2 text-sm">Your Answers: <span className="font-medium">{totalAnswers}</span></div>
        <div className="mb-4 text-xs text-muted-foreground">Started: {session.startedAt.toLocaleString()}</div>
        <Button className="w-full mb-2" onClick={onClose}>Close</Button>
      </div>
    </div>
  );
};

const InterviewChatbot: React.FC = () => {
  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [lastStartedTopic, setLastStartedTopic] = useState<TopicType | null>(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/ai';

  // Fetch sessions from backend (only type=interview)
  const fetchSessions = async () => {
    try {
      const res = await fetch(`${API_URL}/sessions?type=interview`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
      });
      if (!res.ok) throw new Error('Failed to fetch sessions');
      const data = await res.json();
      // Convert date strings to Date objects
      const sessionsWithDates = data.map((session: any) => ({
        ...session,
        startedAt: session.startedAt ? new Date(session.startedAt) : new Date(),
        messages: session.messages.map((m: any) => ({
          ...m,
          timestamp: m.timestamp ? new Date(m.timestamp) : new Date()
        }))
      }));
      setSessions(sessionsWithDates);
      if (sessionsWithDates.length > 0 && !activeSessionId) {
        setActiveSessionId(sessionsWithDates[0].id.toString());
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Could not load chat sessions', variant: 'destructive' });
    }
  };

  useEffect(() => { fetchSessions(); }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [sessions, activeSessionId]);

  const getActiveSession = () => sessions.find(s => s.id.toString() === activeSessionId) || null;
  const activeSession = getActiveSession();
  const currentQuestionNumber = activeSession ? activeSession.messages.filter(m => m.sender === 'bot' || m.sender === 'assistant').length : 0;

  // Start new interview with detailed prompt (type=interview)
  const handleStartNew = async (topic: TopicType) => {
    setLastStartedTopic(topic);
    setIsThinking(true);
    try {
      const prompt = interviewPrompts[topic];
      const topicDisplayName = topics.find(t => t.id === topic)?.title || topic;
      const res = await fetch(`${API_URL}/message`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: prompt, type: 'interview' })
      });
      if (!res.ok) throw new Error('Failed to start interview');
      const data = await res.json();
      // Immediately update the session title to the topic's display name
      if (data.sessionId) {
        await fetch(`${API_URL}/sessions/${data.sessionId}/title?type=interview`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ title: topicDisplayName })
        });
      }
      await fetchSessions();
      setActiveSessionId(data.sessionId.toString());
      setShowSidebar(false);
    } catch (e) {
      toast({ title: 'Error', description: 'Could not start interview', variant: 'destructive' });
    } finally {
      setIsThinking(false);
    }
  };

  // Send user answer and get feedback/next question (type=interview)
  const handleSend = async () => {
    if (!inputValue.trim() || !activeSession || isThinking || activeSession.ended) return;
    setIsThinking(true);
    try {
      const res = await fetch(`${API_URL}/message`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: inputValue, sessionId: activeSession.id, type: 'interview' })
      });
      if (!res.ok) throw new Error('Failed to send answer');
      setInputValue('');
      await fetchSessions();
    } catch (e) {
      toast({ title: 'Error', description: 'Could not send answer', variant: 'destructive' });
    } finally {
      setIsThinking(false);
    }
  };

  const handleSelectSession = (id: string) => {
    setActiveSessionId(id);
    setShowSidebar(false);
  };

  const handleEditTitle = (id: string, newTitle: string) => {
    setSessions(prev => prev.map(s =>
      s.id.toString() === id ? { ...s, title: newTitle || s.title } : s
    ));
  };

  const handleDeleteSession = async (id: string) => {
    try {
      const res = await fetch(
        `${API_URL}/sessions/${id}?type=interview`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          },
        }
      );
      if (!res.ok) throw new Error('Failed to delete session');
      await fetchSessions(); // Refresh from backend
      if (activeSessionId === id) setActiveSessionId(null);
      toast({ description: 'Session deleted successfully', duration: 1500 });
    } catch (e) {
      toast({ title: 'Error', description: 'Could not delete session', variant: 'destructive' });
    }
  };

  // Export session as JSON (for demo)
  const handleExportSession = (id: string) => {
    const session = sessions.find(s => s.id.toString() === id);
    if (!session) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(session, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `${session.title.replace(/\s+/g, '_')}_interview.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
  };

  // Typing indicator
  const [showTyping, setShowTyping] = useState(false);
  useEffect(() => {
    if (isThinking) {
      setShowTyping(true);
    } else {
      const timeout = setTimeout(() => setShowTyping(false), 600);
      return () => clearTimeout(timeout);
    }
  }, [isThinking]);

  // Add message edit/delete/copy logic
  const handleCopyMessage = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ description: 'Copied to clipboard', duration: 1500 });
  };
  const handleEditMessage = (id: number, newText: string) => {
    setSessions(prev => prev.map(s =>
      s.id.toString() === activeSessionId ? {
        ...s,
        messages: s.messages.map(m => m.id === id ? { ...m, text: newText } : m)
      } : s
    ));
  };
  const handleDeleteMessage = (id: number) => {
    setSessions(prev => prev.map(s =>
      s.id.toString() === activeSessionId ? {
        ...s,
        messages: s.messages.filter(m => m.id !== id)
      } : s
    ));
  };

  // For dynamic input alignment
  const inputLeft = sidebarCollapsed ? 64 : 288; // w-16 = 64px, w-72 = 288px
  // Scroll to Start New Interview section
  const handlePlusClick = () => {
    setShowSidebar(true);
    setTimeout(() => {
      const el = document.getElementById('start-new-interview-section');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  return (
    <div className="flex h-screen w-full bg-background relative">
      <ChatBackground />
      <div className={cn(
        'fixed inset-0 z-40 bg-black/40 transition-opacity md:static md:bg-transparent',
        sidebarCollapsed ? 'w-16' : 'md:w-72',
        showSidebar ? 'block' : 'hidden md:block'
      )}>
        <InterviewSidebar
          sessions={sessions}
          onSelectSession={handleSelectSession}
          onStartNew={handleStartNew}
          activeSessionId={activeSessionId}
          onClose={() => setShowSidebar(false)}
          onEditTitle={handleEditTitle}
          onDeleteSession={handleDeleteSession}
          onExportSession={handleExportSession}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
        />
      </div>
      <main className="flex-1 flex flex-col h-screen max-h-screen relative">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b px-4 py-3 bg-background/90 backdrop-blur">
          <div className="flex flex-col flex-1 min-w-0">
            {activeSession && (
              <>
                <div className="flex items-center gap-2 min-w-0">
                  {topics.find(t => t.id === activeSession.topic)?.icon}
                  <span className="font-bold text-xl truncate">
                    {topics.find(t => t.id === activeSession.topic)?.title}
                  </span>
                  </div>
                <div className="flex items-center gap-2 mt-1 min-w-0">
                  <span className="text-sm text-muted-foreground truncate">{activeSession.title}</span>
                  <span className="ml-2 text-xs text-muted-foreground truncate">
                    Started: {activeSession.startedAt.toLocaleDateString()} {activeSession.startedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
            </div>
              </>
            )}
          </div>
          {activeSession && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => lastStartedTopic && handleStartNew(lastStartedTopic)} disabled={!lastStartedTopic}><RefreshCcw size={15}/> Restart</Button>
              <Button variant="destructive" size="sm" onClick={() => setShowSummary(true)}><X size={15}/> End</Button>
            </div>
                    )}
                  </div>
        {activeSession && (
          <div className="w-full bg-muted h-2 sticky top-[56px] z-10">
            <div
              className="bg-primary h-2 transition-all"
              style={{ width: `${Math.min(currentQuestionNumber, 10) * 10}%` }}
            />
                </div>
        )}
        <div className="flex-1 min-h-0 overflow-auto px-2 pb-[76px] custom-scrollbar" ref={chatContainerRef} aria-live="polite">
          {activeSession ? (
            <>
              {activeSession.messages.length === 0 && (
                <div className="text-center text-muted-foreground mt-10">No messages yet.</div>
              )}
              <AnimatePresence initial={false}>
                {activeSession.messages.map((msg, idx) => (
                  <InterviewMessage
                    key={msg.id}
                    message={msg}
                    grouped={false}
                    isFirstInGroup={idx === 0 || activeSession.messages[idx - 1]?.sender !== msg.sender}
                    onCopy={handleCopyMessage}
                    onEdit={handleEditMessage}
                    onDelete={handleDeleteMessage}
                  />
                ))}
              </AnimatePresence>
              {showTyping && !activeSession.ended && <TypingIndicator />}
              {activeSession.ended && (
                <div className="mt-8 text-center">
                  <div className="text-lg font-semibold mb-2">Interview Ended</div>
                  <div className="mb-4 text-muted-foreground">Thank you for practicing! Review your answers and feedback above.</div>
                  <Button variant="outline" onClick={() => lastStartedTopic && handleStartNew(lastStartedTopic)} disabled={!lastStartedTopic}><RefreshCcw size={15}/> Start New Interview</Button>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="text-2xl font-bold mb-2">Interview Chatbot</div>
              <div className="text-muted-foreground mb-4">Select a topic from the sidebar to begin your interview practice.</div>
            </div>
          )}
        </div>
        {activeSession && !activeSession.ended && (
          <form
            className="fixed bottom-0 z-50 flex items-center gap-2 border-t px-4 py-3 bg-background shadow-lg rounded-t-xl"
            style={{ left: inputLeft, right: 0, width: `calc(100vw - ${inputLeft}px)` }}
            onSubmit={e => { e.preventDefault(); handleSend(); }}
            aria-label="Send message"
          >
            <div className="flex-1 flex justify-center">
              <div className="w-full max-w-2xl flex items-center gap-2">
                <Input 
                  className="flex-1 rounded-full px-4 py-2 shadow-sm"
                  placeholder="Type your answer..."
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  disabled={isThinking}
                  autoFocus
                  aria-label="Your answer"
                />
                <Button type="submit" disabled={isThinking || !inputValue.trim()} aria-label="Send" className="rounded-full h-10 w-10 flex items-center justify-center">
                  {isThinking ? <Loader2 className="animate-spin" size={18}/> : <Send size={18}/>} 
                </Button>
              </div>
            </div>
          </form>
        )}
        <SessionSummaryModal open={showSummary} onClose={() => setShowSummary(false)} session={activeSession} />
        {/* Floating New Interview Button */}
        <Button
          className="fixed bottom-6 right-6 z-50 rounded-full shadow-lg bg-gradient-to-br from-primary to-purple-500 text-white hover:scale-105 transition-transform"
          size="icon"
          onClick={handlePlusClick}
          title="Start New Interview"
        >
          <Plus size={28}/>
        </Button>
      </main>
      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: linear-gradient(135deg, #a78bfa 0%, #f472b6 100%); border-radius: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
      `}</style>
    </div>
  );
};

export default InterviewChatbot;
