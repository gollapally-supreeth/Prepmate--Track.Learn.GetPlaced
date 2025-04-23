
import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from '@/lib/uuid';
import { AIMessage, ChatSession } from './types';

interface AIAssistantContextType {
  messages: AIMessage[];
  sessions: ChatSession[];
  activeSession: ChatSession | null;
  isLoading: boolean;
  sendMessage: (content: string) => Promise<void>;
  newSession: () => void;
  activateSession: (sessionId: string) => void;
  deleteSession: (sessionId: string) => void;
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
  
  // Load sessions from localStorage on mount
  useEffect(() => {
    const savedSessions = localStorage.getItem('prepmate-chat-sessions');
    if (savedSessions) {
      try {
        const parsed = JSON.parse(savedSessions);
        // Convert string dates back to Date objects
        const formattedSessions = parsed.map((session: any) => ({
          ...session,
          createdAt: new Date(session.createdAt),
          updatedAt: new Date(session.updatedAt),
          messages: session.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        }));
        setSessions(formattedSessions);
        
        // Set active session if it exists
        const activeSessionId = localStorage.getItem('prepmate-active-session');
        if (activeSessionId) {
          const activeSession = formattedSessions.find((s: ChatSession) => s.id === activeSessionId);
          if (activeSession) {
            setActiveSession(activeSession);
            setMessages(activeSession.messages);
          }
        }
      } catch (error) {
        console.error('Error loading chat sessions:', error);
      }
    }
  }, []);
  
  // Save sessions to localStorage whenever they change
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem('prepmate-chat-sessions', JSON.stringify(sessions));
    }
    
    if (activeSession) {
      localStorage.setItem('prepmate-active-session', activeSession.id);
    }
  }, [sessions, activeSession]);
  
  const createNewSession = (): ChatSession => {
    return {
      id: uuidv4(),
      title: "New Conversation",
      createdAt: new Date(),
      updatedAt: new Date(),
      messages: []
    };
  };
  
  const newSession = () => {
    const session = createNewSession();
    setSessions(prev => [session, ...prev]);
    setActiveSession(session);
    setMessages([]);
  };
  
  const activateSession = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      setActiveSession(session);
      setMessages(session.messages);
    }
  };
  
  const deleteSession = (sessionId: string) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    
    if (activeSession?.id === sessionId) {
      const remainingSessions = sessions.filter(s => s.id !== sessionId);
      if (remainingSessions.length > 0) {
        setActiveSession(remainingSessions[0]);
        setMessages(remainingSessions[0].messages);
      } else {
        const newSession = createNewSession();
        setSessions([newSession]);
        setActiveSession(newSession);
        setMessages([]);
      }
    }
  };
  
  const generateTitle = (content: string): string => {
    // Extract first few words to create a title
    const words = content.split(' ');
    const titleWords = words.slice(0, 4);
    let title = titleWords.join(' ');
    
    if (title.length > 30) {
      title = title.substring(0, 30) + '...';
    } else if (words.length > 4) {
      title += '...';
    }
    
    return title;
  };
  
  const mockResponse = async (query: string): Promise<string> => {
    const API_KEY = 'AIzaSyClDjyj1k3isPIFr0kAKA9zFqU8EdK1hWo';
    
    // This is a safety measure - we're not actually using the API key in frontend
    // In production, this should be handled by a backend server
    try {
      // In a real implementation, this would be a fetch to a backend API
      // that securely handles the API key
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock responses based on query content
      if (query.toLowerCase().includes('dsa') || query.toLowerCase().includes('algorithm')) {
        return "I'd be happy to help with DSA problems! Here are some tips for approaching algorithm questions:\n\n1. Understand the problem completely\n2. Work through examples\n3. Break down the problem\n4. Start with a naive solution\n5. Optimize your approach\n\nWould you like me to provide a specific DSA problem to practice with?";
      }
      
      if (query.toLowerCase().includes('resume') || query.toLowerCase().includes('cv')) {
        return "When optimizing your resume for ATS systems, consider these tips:\n\n- Use relevant keywords from the job description\n- Keep formatting simple and avoid tables/columns\n- Include a skills section with technical skills\n- Quantify achievements where possible\n- Use standard section headings\n\nWould you like more specific advice about a particular section of your resume?";
      }
      
      if (query.toLowerCase().includes('interview')) {
        return "Preparing for technical interviews involves both technical and soft skills preparation:\n\n**Technical prep:**\n- Review core CS concepts (data structures, algorithms)\n- Practice coding problems on platforms like LeetCode\n- Study system design patterns\n\n**Behavioral prep:**\n- Prepare STAR method responses\n- Research the company thoroughly\n- Prepare thoughtful questions to ask\n\nShall we do a mock interview exercise?";
      }
      
      if (query.toLowerCase().includes('project')) {
        return "Here are 3 project ideas that would showcase your skills:\n\n1. **Personal Learning Dashboard**: Create a web application that tracks your progress through various CS courses, manages study materials, and generates study plans using spaced repetition algorithms.\n\n2. **Code Review Assistant**: Build an AI-powered tool that analyzes code, suggests improvements, and explains complex sections in simpler terms.\n\n3. **Interview Prep Platform**: Develop a platform that offers mock technical interviews with AI, provides feedback, and tracks improvement over time.\n\nEach of these can be scaled based on your skill level and time availability.";
      }
      
      // Default response
      return "I'm your PrepMate AI Assistant, here to help with coding problems, interview preparation, resume optimization, and study planning. What specific area would you like assistance with today?";
    } catch (error) {
      console.error('Error in AI response:', error);
      throw new Error('Failed to generate AI response');
    }
  };

  
  const sendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    // Create or update session if needed
    if (!activeSession) {
      newSession();
    }
    
    // Create user message
    const userMessage: AIMessage = {
      id: uuidv4(),
      content,
      type: 'user',
      timestamp: new Date()
    };
    
    // Add to messages state
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    
    // Update session with user message
    let updatedSessions = [...sessions];
    let currentSession = { ...activeSession! };
    
    // Update title for new sessions
    if (currentSession.messages.length === 0) {
      currentSession.title = generateTitle(content);
    }
    
    currentSession.messages = [...currentSession.messages, userMessage];
    currentSession.updatedAt = new Date();
    
    const sessionIndex = sessions.findIndex(s => s.id === currentSession.id);
    if (sessionIndex !== -1) {
      updatedSessions[sessionIndex] = currentSession;
    } else {
      updatedSessions = [currentSession, ...updatedSessions];
    }
    
    setSessions(updatedSessions);
    setActiveSession(currentSession);
    
    // Generate AI response
    setIsLoading(true);
    try {
      const response = await mockResponse(content);
      
      // Create AI message
      const aiMessage: AIMessage = {
        id: uuidv4(),
        content: response,
        type: 'assistant',
        timestamp: new Date()
      };
      
      // Add to messages state
      const updatedMessages = [...newMessages, aiMessage];
      setMessages(updatedMessages);
      
      // Update session with AI message
      currentSession.messages = [...currentSession.messages, aiMessage];
      currentSession.updatedAt = new Date();
      
      const finalSessionIndex = updatedSessions.findIndex(s => s.id === currentSession.id);
      updatedSessions[finalSessionIndex] = currentSession;
      
      setSessions(updatedSessions);
      setActiveSession(currentSession);
    } catch (error) {
      // Handle error
      const errorMessage: AIMessage = {
        id: uuidv4(),
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        type: 'error',
        timestamp: new Date()
      };
      
      setMessages([...newMessages, errorMessage]);
      
      // Update session with error message
      currentSession.messages = [...currentSession.messages, errorMessage];
      currentSession.updatedAt = new Date();
      
      const errorSessionIndex = updatedSessions.findIndex(s => s.id === currentSession.id);
      updatedSessions[errorSessionIndex] = currentSession;
      
      setSessions(updatedSessions);
      setActiveSession(currentSession);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    messages,
    sessions,
    activeSession,
    isLoading,
    sendMessage,
    newSession,
    activateSession,
    deleteSession
  };

  return (
    <AIAssistantContext.Provider value={value}>
      {children}
    </AIAssistantContext.Provider>
  );
};
