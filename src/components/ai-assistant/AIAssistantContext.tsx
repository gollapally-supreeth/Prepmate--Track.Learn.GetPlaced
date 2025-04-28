import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { AIMessage, ChatSession, SmartSuggestion, AIMessageType } from './types';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

interface AIAssistantContextType {
  messages: AIMessage[];
  sessions: ChatSession[];
  activeSession: ChatSession | null;
  isLoading: boolean;
  suggestions: SmartSuggestion[];
  sendMessage: (content: string) => Promise<void>;
  newSession: () => void;
  activateSession: (sessionId: string) => void;
  deleteSession: (sessionId: string) => void;
  togglePinSession: (sessionId: string) => void;
  handleFeedback: (messageId: string, feedback: 'positive' | 'negative') => void;
  updateSessionTitle: (sessionId: string, newTitle: string) => Promise<void>;
  pinSession: (sessionId: string) => void;
  tagSession: (sessionId: string, tag: string) => void;
  addNoteToMessage: (messageId: string, note: string) => void;
  setMessageFeedback: (messageId: string, feedback: 'positive' | 'negative') => void;
  toggleImportantMessage: (messageId: string) => void;
  isQuotaExceeded: boolean;
  chatEndRef: React.RefObject<HTMLDivElement | null>;
}

const AIAssistantContext = createContext<AIAssistantContextType | undefined>(undefined);

export const useAIAssistant = () => {
  const context = useContext(AIAssistantContext);
  if (context === undefined) {
    throw new Error('useAIAssistant must be used within an AIAssistantProvider');
  }
  return context;
};

interface AIAssistantProviderProps {
  children: React.ReactNode;
}

export const AIAssistantProvider: React.FC<AIAssistantProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSession, setActiveSession] = useState<ChatSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<SmartSuggestion[]>([]);
  const { toast } = useToast();
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const [isQuotaExceeded, setIsQuotaExceeded] = useState(false);
  
  // Helper to get JWT token
  const getToken = () => localStorage.getItem('authToken');
  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/ai';

  // Fetch sessions on mount
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await fetch(`${apiBase}/sessions`, {
          headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        if (!res.ok) throw new Error('Failed to fetch sessions');
        const data = await res.json();
        setSessions(data);
        if (data.length > 0) {
          setActiveSession(data[0]);
          setMessages(data[0].messages || []);
        }
      } catch (error) {
        toast({ title: 'Error', description: 'Could not load chat sessions', variant: 'destructive' });
      }
    };
    fetchSessions();
    // eslint-disable-next-line
  }, []);
  
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  const newSession = () => {
    setActiveSession(null);
    setMessages([]);
    setSuggestions([]);
  };
  
  const activateSession = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      setActiveSession(session);
      setMessages(session.messages || []);
      setSuggestions([]);
    }
  };
  
  const deleteSession = async (sessionId: string) => {
    try {
      const res = await fetch(`${apiBase}/sessions/${sessionId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      if (!res.ok) throw new Error('Failed to delete session');
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    if (activeSession?.id === sessionId) {
        const remaining = sessions.filter(s => s.id !== sessionId);
        if (remaining.length > 0) {
          setActiveSession(remaining[0]);
          setMessages(remaining[0].messages || []);
      } else {
          setActiveSession(null);
        setMessages([]);
        }
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Could not delete session', variant: 'destructive' });
    }
  };
  
  const togglePinSession = (sessionId: string) => {
    setSessions(prev => prev.map(session => {
      if (session.id === sessionId) {
        return {
          ...session,
          isPinned: !session.isPinned,
          updatedAt: new Date()
        };
      }
      return session;
    }));
    if (activeSession?.id === sessionId) {
      setActiveSession(prev => {
        if (!prev) return null;
        return {
          ...prev,
          isPinned: !prev.isPinned,
          updatedAt: new Date()
        };
      });
    }
  };

  const handleFeedback = async (messageId: string, feedback: 'positive' | 'negative') => {
    try {
      const res = await fetch(`${apiBase}/messages/${messageId}/feedback`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ feedback })
      });
      if (!res.ok) throw new Error('Failed to update feedback');
      setMessages(prev => prev.map(msg =>
        msg.id === messageId ? { ...msg, feedback } : msg
      ));
      if (activeSession) {
        setActiveSession({
          ...activeSession,
          messages: activeSession.messages.map(msg =>
            msg.id === messageId ? { ...msg, feedback } : msg
          )
        });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Could not update feedback', variant: 'destructive' });
    }
  };

  // Smart suggestions logic (unchanged)
  const determineCategory = (content: string): 'general' | 'dsa' | 'resume' | 'interview' | 'project' => {
    content = content.toLowerCase();
    if (content.includes('algorithm') || content.includes('dsa') || content.includes('data structure') || content.includes('coding')) {
      return 'dsa';
    } else if (content.includes('resume') || content.includes('cv') || content.includes('ats')) {
      return 'resume';
    } else if (content.includes('interview') || content.includes('behavioral') || content.includes('technical question')) {
      return 'interview';
    } else if (content.includes('project') || content.includes('portfolio') || content.includes('build')) {
      return 'project';
    } else {
      return 'general';
    }
  };
  const generateSuggestions = (userQuery: string, aiResponse: string): SmartSuggestion[] => {
    const category = determineCategory(userQuery);
    const suggestions: SmartSuggestion[] = [];
    userQuery = userQuery.toLowerCase();
    aiResponse = aiResponse.toLowerCase();
    if (category === 'dsa') {
      suggestions.push({ text: 'Explain with example', prompt: 'Can you explain this concept with a concrete example?' });
      suggestions.push({ text: 'Give me practice problem', prompt: 'Can you give me a similar problem to practice this concept?' });
      suggestions.push({ text: 'Show optimal solution', prompt: 'What would be the most optimal solution for this problem?' });
    } else if (category === 'resume') {
      suggestions.push({ text: 'Show me an example', prompt: 'Can you show me an example of a well-written bullet point for this?' });
      suggestions.push({ text: 'ATS optimization tips', prompt: 'What specific keywords should I include for ATS optimization?' });
      suggestions.push({ text: 'Tailor for specific role', prompt: 'How would I tailor this for a specific software engineering role?' });
    } else if (category === 'interview') {
      suggestions.push({ text: 'Give me a harder question', prompt: 'Can you give me a more challenging interview question?' });
      suggestions.push({ text: 'STAR method example', prompt: 'Can you show me how to answer this using the STAR method?' });
      suggestions.push({ text: 'Common follow-up questions', prompt: 'What are common follow-up questions interviewers might ask?' });
    } else if (category === 'project') {
      suggestions.push({ text: 'More implementation details', prompt: 'Can you provide more technical implementation details for this project?' });
      suggestions.push({ text: 'Tech stack recommendation', prompt: 'What tech stack would you recommend for this project?' });
      suggestions.push({ text: 'Timeline estimation', prompt: 'How long would this project typically take to complete?' });
    } else {
      suggestions.push({ text: 'Tell me more', prompt: 'Can you elaborate more on this topic?' });
      suggestions.push({ text: 'Practical applications', prompt: 'What are some practical applications of this knowledge?' });
      suggestions.push({ text: 'Resources to learn more', prompt: 'Can you recommend resources where I can learn more about this?' });
    }
    return suggestions.slice(0, 3);
  };

  // Send message to backend
  const sendMessage = async (content: string) => {
    if (!content.trim() || isQuotaExceeded) return;
    setIsLoading(true);
    setSuggestions([]);
    const userMsg: AIMessage = {
      id: uuidv4(),
      type: 'user',
      content,
      timestamp: new Date(),
    };
    const aiPlaceholder: AIMessage = {
      id: uuidv4(),
      type: 'assistant',
      content: '',
      isLoading: true,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg, aiPlaceholder]);
    try {
      const res = await fetch(`${apiBase}/message`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content, sessionId: activeSession?.id })
      });
      if (res.status === 429) {
        setIsQuotaExceeded(true);
        toast({ title: 'Quota Exceeded', description: 'You have reached the daily Gemini API quota. Please try again after the quota resets.', variant: 'destructive' });
        // Show error message in chat
        setMessages(prevMsgs => [
          ...prevMsgs.filter(m => m.id !== aiPlaceholder.id),
          {
            id: uuidv4(),
            type: 'error',
            content: 'You have reached the daily Gemini API quota. Please try again after the quota resets.',
            timestamp: new Date(),
            isLoading: false,
            feedback: null,
          } as AIMessage
        ]);
        return;
      }
      if (!res.ok) throw new Error('Failed to send message');
      const data = await res.json();
      if (data.userMessage) data.userMessage.type = 'user';
      if (data.assistantMessage) data.assistantMessage.type = 'assistant';
      let updatedSessions = [...sessions];
      let sessionIdx = updatedSessions.findIndex(s => s.id === data.sessionId);
      if (sessionIdx === -1) {
        const newSession = {
          id: data.sessionId,
          title: content.slice(0, 50) + '...',
          createdAt: new Date(),
          updatedAt: new Date(),
          messages: [data.userMessage, data.assistantMessage]
        };
        updatedSessions = [newSession, ...updatedSessions];
        setActiveSession(newSession);
        setMessages([data.userMessage, data.assistantMessage]);
      } else {
        updatedSessions[sessionIdx] = {
          ...updatedSessions[sessionIdx],
          updatedAt: new Date(),
          messages: [...(updatedSessions[sessionIdx].messages || []), data.userMessage, data.assistantMessage]
        };
        setActiveSession(updatedSessions[sessionIdx]);
        setMessages(prevMsgs => {
          const idx = prevMsgs.findIndex(m => m.id === aiPlaceholder.id);
          if (idx !== -1) {
            const newMsgs = [...prevMsgs];
            newMsgs[idx] = data.assistantMessage;
            return newMsgs;
          }
          return [...prevMsgs, data.assistantMessage];
        });
      }
      setSessions(updatedSessions);
      setSuggestions(generateSuggestions(content, data.assistantMessage.content));
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to send message', variant: 'destructive' });
      setMessages(prevMsgs => [
        ...prevMsgs.filter(m => m.id !== aiPlaceholder.id),
        {
          id: uuidv4(),
          type: 'error',
          content: error instanceof Error && error.message.includes('quota')
            ? 'You have reached the daily Gemini API quota. Please try again after the quota resets.'
            : 'Failed to send message. Please try again.',
          timestamp: new Date(),
          isLoading: false,
          feedback: null,
        } as AIMessage
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSessionTitle = async (sessionId: string, newTitle: string) => {
    try {
      const res = await fetch(`${apiBase}/session/${sessionId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title: newTitle })
      });
      
      if (!res.ok) throw new Error('Failed to update session title');
      
      // Update local state
      const updatedSessions = sessions.map(session => 
        session.id === sessionId 
          ? { ...session, title: newTitle }
          : session
      );
      setSessions(updatedSessions);
      
      if (activeSession?.id === sessionId) {
        setActiveSession({ ...activeSession, title: newTitle });
      }
      
      toast({ title: 'Success', description: 'Session title updated' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update session title', variant: 'destructive' });
    }
  };

  const pinSession = async (sessionId: string) => {
    try {
      // Try to update on backend if endpoint exists
      await fetch(`${apiBase}/session/${sessionId}/pin`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (e) {
      // Ignore backend error, update local state anyway
    }
    setSessions(prev => prev.map(session =>
      session.id === sessionId
        ? { ...session, isPinned: !session.isPinned, updatedAt: new Date() }
        : session
    ));
    if (activeSession?.id === sessionId) {
      setActiveSession(prev => prev ? { ...prev, isPinned: !prev.isPinned, updatedAt: new Date() } : null);
    }
  };

  const tagSession = async (sessionId: string, tag: string) => {
    try {
      await fetch(`${apiBase}/session/${sessionId}/tag`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tag }),
      });
    } catch (e) {}
    setSessions(prev => prev.map(session =>
      session.id === sessionId
        ? { ...session, tags: [tag] }
        : session
    ));
    if (activeSession?.id === sessionId) {
      setActiveSession(prev => prev ? { ...prev, tags: [tag] } : null);
    }
  };

  const addNoteToMessage = (messageId: string, note: string) => {
    setMessages(prev => prev.map(msg =>
      msg.id === messageId ? { ...msg, note } : msg
    ));
    if (activeSession) {
      setActiveSession({
        ...activeSession,
        messages: activeSession.messages.map(msg =>
          msg.id === messageId ? { ...msg, note } : msg
        ),
      });
    }
  };

  const setMessageFeedback = (messageId: string, feedback: 'positive' | 'negative') => {
    setMessages(prev => prev.map(msg =>
      msg.id === messageId ? { ...msg, feedback } : msg
    ));
    if (activeSession) {
      setActiveSession({
        ...activeSession,
        messages: activeSession.messages.map(msg =>
          msg.id === messageId ? { ...msg, feedback } : msg
        ),
      });
    }
  };

  const toggleImportantMessage = (messageId: string) => {
    setMessages(prev => prev.map(msg =>
      msg.id === messageId ? { ...msg, isImportant: !msg.isImportant } : msg
    ));
    if (activeSession) {
      setActiveSession({
        ...activeSession,
        messages: activeSession.messages.map(msg =>
          msg.id === messageId ? { ...msg, isImportant: !msg.isImportant } : msg
        ),
      });
    }
  };

  const value = {
    messages,
    sessions,
    activeSession,
    isLoading,
    suggestions,
    sendMessage,
    newSession,
    activateSession,
    deleteSession,
    togglePinSession,
    handleFeedback,
    updateSessionTitle,
    pinSession,
    tagSession,
    addNoteToMessage,
    setMessageFeedback,
    toggleImportantMessage,
    isQuotaExceeded,
    chatEndRef,
  };

  return (
    <AIAssistantContext.Provider value={value}>
      {children}
    </AIAssistantContext.Provider>
  );
};
