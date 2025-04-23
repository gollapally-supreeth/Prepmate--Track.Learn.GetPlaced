
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from '@/lib/uuid';
import { AIMessage, ChatSession, SmartSuggestion } from './types';
import { useToast } from '@/hooks/use-toast';

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
    setSuggestions([]);
  };
  
  const activateSession = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      setActiveSession(session);
      setMessages(session.messages);
      setSuggestions([]);
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

  const handleFeedback = (messageId: string, feedback: 'positive' | 'negative') => {
    // Update the message in the messages state
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        return { ...msg, feedback };
      }
      return msg;
    }));
    
    // Update the message in the sessions
    if (activeSession) {
      const updatedSession = {
        ...activeSession,
        messages: activeSession.messages.map(msg => {
          if (msg.id === messageId) {
            return { ...msg, feedback };
          }
          return msg;
        }),
        updatedAt: new Date()
      };
      
      setSessions(prev => prev.map(session => 
        session.id === updatedSession.id ? updatedSession : session
      ));
      
      setActiveSession(updatedSession);
    }
    
    // In a real app, you might want to send this feedback to your backend
    console.log(`Feedback for message ${messageId}: ${feedback}`);
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

  // Function to determine message category based on content
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
  
  // Generate smart suggestions based on conversation context
  const generateSuggestions = (userQuery: string, aiResponse: string): SmartSuggestion[] => {
    const category = determineCategory(userQuery);
    const suggestions: SmartSuggestion[] = [];
    
    userQuery = userQuery.toLowerCase();
    aiResponse = aiResponse.toLowerCase();
    
    // DSA related suggestions
    if (category === 'dsa') {
      suggestions.push({ text: 'Explain with example', prompt: 'Can you explain this concept with a concrete example?' });
      suggestions.push({ text: 'Give me practice problem', prompt: 'Can you give me a similar problem to practice this concept?' });
      suggestions.push({ text: 'Show optimal solution', prompt: 'What would be the most optimal solution for this problem?' });
    } 
    // Resume related suggestions
    else if (category === 'resume') {
      suggestions.push({ text: 'Show me an example', prompt: 'Can you show me an example of a well-written bullet point for this?' });
      suggestions.push({ text: 'ATS optimization tips', prompt: 'What specific keywords should I include for ATS optimization?' });
      suggestions.push({ text: 'Tailor for specific role', prompt: 'How would I tailor this for a specific software engineering role?' });
    }
    // Interview related suggestions
    else if (category === 'interview') {
      suggestions.push({ text: 'Give me a harder question', prompt: 'Can you give me a more challenging interview question?' });
      suggestions.push({ text: 'STAR method example', prompt: 'Can you show me how to answer this using the STAR method?' });
      suggestions.push({ text: 'Common follow-up questions', prompt: 'What are common follow-up questions interviewers might ask?' });
    }
    // Project related suggestions
    else if (category === 'project') {
      suggestions.push({ text: 'More implementation details', prompt: 'Can you provide more technical implementation details for this project?' });
      suggestions.push({ text: 'Tech stack recommendation', prompt: 'What tech stack would you recommend for this project?' });
      suggestions.push({ text: 'Timeline estimation', prompt: 'How long would this project typically take to complete?' });
    }
    // General suggestions
    else {
      suggestions.push({ text: 'Tell me more', prompt: 'Can you elaborate more on this topic?' });
      suggestions.push({ text: 'Practical applications', prompt: 'What are some practical applications of this knowledge?' });
      suggestions.push({ text: 'Resources to learn more', prompt: 'Can you recommend resources where I can learn more about this?' });
    }
    
    return suggestions.slice(0, 3);  // Return at most 3 suggestions
  };
  
  const mockGeminiResponse = async (query: string): Promise<string> => {
    const API_KEY = 'AIzaSyClDjyj1k3isPIFr0kAKA9zFqU8EdK1hWo';
    
    // This is a safety measure - we're not actually using the API key in frontend
    // In production, this should be handled by a backend server
    try {
      // In a real implementation, this would be a fetch to a backend API
      // that securely handles the API key
      await new Promise(resolve => setTimeout(resolve, 2000));
      
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
      currentSession.category = determineCategory(content);
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
    setSuggestions([]);
    
    // Add a placeholder loading message
    const loadingMessage: AIMessage = {
      id: uuidv4(),
      content: "...",
      type: 'assistant',
      timestamp: new Date(),
      isLoading: true
    };
    
    setMessages([...newMessages, loadingMessage]);
    
    // Generate AI response
    setIsLoading(true);
    try {
      const response = await mockGeminiResponse(content);
      
      // Remove loading message
      setMessages(prev => prev.filter(msg => !msg.isLoading));
      
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
      
      // Generate smart suggestions based on the conversation
      const newSuggestions = generateSuggestions(content, response);
      setSuggestions(newSuggestions);
      
      // Update session with AI message
      currentSession.messages = [...currentSession.messages, aiMessage];
      currentSession.updatedAt = new Date();
      
      const finalSessionIndex = updatedSessions.findIndex(s => s.id === currentSession.id);
      updatedSessions[finalSessionIndex] = currentSession;
      
      setSessions(updatedSessions);
      setActiveSession(currentSession);
    } catch (error) {
      // Remove loading message
      setMessages(prev => prev.filter(msg => !msg.isLoading));
      
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
      
      toast({
        title: "Error",
        description: "Failed to generate AI response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
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
    handleFeedback
  };

  return (
    <AIAssistantContext.Provider value={value}>
      {children}
    </AIAssistantContext.Provider>
  );
};
