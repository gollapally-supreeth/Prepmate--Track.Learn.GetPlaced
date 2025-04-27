import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Send, User, Bot, Cpu, Briefcase, Loader2, RefreshCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

// Define message interface
interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

// Define interview topics
type TopicType = 'hr' | 'technical' | 'os';

interface Topic {
  id: TopicType;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const InterviewChatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "👋 Hello! I'm your interview prep assistant powered by Google Gemini. Choose a topic from the left panel, and I'll help you practice for your interviews by asking relevant questions.",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTopic, setActiveTopic] = useState<TopicType | null>(null);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Define topics
  const topics: Topic[] = [
    {
      id: 'hr',
      title: 'HR Questions',
      description: 'Behavioral & general questions',
      icon: <User size={18} />
    },
    {
      id: 'technical',
      title: 'Technical Interview',
      description: 'DSA and coding concepts',
      icon: <Cpu size={18} />
    },
    {
      id: 'os',
      title: 'Operating Systems',
      description: 'OS concepts and internals',
      icon: <Briefcase size={18} />
    }
  ];

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Function to send message to Gemini API
  const sendToGemini = async (userMessage: string) => {
    if (!activeTopic) return;
    
    setIsThinking(true);
    
    try {
      // System prompt that sets the AI behavior
      const systemPrompt = `You are an AI interview assistant that simulates real-world interviews for job preparation. Your role is to help users practice by asking one relevant question at a time based on the topic selected.

Behavior:
- Provide constructive feedback on the user's previous answer before asking the next question.
- Ask questions that are commonly asked in real interviews.
- Use an encouraging, professional tone.
- Avoid answering your own questions unless the user asks.
- If the user's answer is incorrect or incomplete, provide constructive feedback and guidance.

Selected Topic: ${topics.find(t => t.id === activeTopic)?.title}

For HR Questions: Focus on behavioral questions, situational judgment, and professional development.
For Technical Interview: Focus on data structures, algorithms, coding concepts, and problem-solving approaches.
For Operating Systems: Focus on OS concepts, memory management, process scheduling, and system design.`;

      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': 'AIzaSyClDjyj1k3isPIFr0kAKA9zFqU8EdK1hWo'
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: systemPrompt }]
            },
            {
              role: 'model',
              parts: [{ text: 'I understand. I will act as a professional interview assistant for the selected topic.' }]
            },
            ...messages.map(msg => ({
              role: msg.sender === 'user' ? 'user' : 'model',
              parts: [{ text: msg.text }]
            })),
            {
              role: 'user',
              parts: [{ text: userMessage }]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.candidates[0].content.parts[0].text;
      
      // Add the AI's response to messages
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: aiResponse,
        sender: 'bot',
        timestamp: new Date()
      }]);
      
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      toast({
        title: 'Error',
        description: 'Failed to get response from the interview assistant. Please try again.',
        variant: 'destructive'
      });
      
      // Add error message
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: "I'm having trouble connecting right now. Please try again.",
        sender: 'bot',
        timestamp: new Date()
      }]);
    } finally {
      setIsThinking(false);
    }
  };

  // Start interview with selected topic
  const startInterview = async (topic: TopicType) => {
    setActiveTopic(topic);
    setInterviewStarted(true);
    setIsLoading(true);

    const welcomeMessage: Message = {
      id: Date.now(),
      text: `Great! Let's start your ${topics.find(t => t.id === topic)?.title} interview practice.`,
      sender: 'bot',
      timestamp: new Date()
    };

    // Reset messages and add welcome message
    setMessages([welcomeMessage]);

    try {
      // System prompt that sets the AI behavior for initial question
      const systemPrompt = `You are an AI interview assistant that simulates real-world interviews for job preparation. Your role is to help users practice by asking one relevant question at a time based on the topic selected.

Behavior:
- Ask ONE challenging but common interview question related to the selected topic.
- Be concise and professional.
- Phrase your question clearly as an interviewer would in a real interview.
- Just ask the first question without additional explanation.

Selected Topic: ${topics.find(t => t.id === topic)?.title}`;

      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': 'AIzaSyClDjyj1k3isPIFr0kAKA9zFqU8EdK1hWo'
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: systemPrompt }]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 512,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      const firstQuestion = data.candidates[0].content.parts[0].text;

      // Add the first question to messages
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: firstQuestion,
        sender: 'bot',
        timestamp: new Date()
      }]);

    } catch (error) {
      console.error('Error starting interview:', error);
      toast({
        title: 'Error',
        description: 'Failed to start the interview. Please try again.',
        variant: 'destructive'
      });
      
      // Add error message
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: "I'm having trouble starting the interview. Please try selecting a topic again.",
        sender: 'bot',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle user message submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading || isThinking) return;
    
    // Add user message to chat
    const newMessage: Message = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    
    // Process with Gemini
    await sendToGemini(inputValue);
  };

  // Request next question
  const handleNextQuestion = async () => {
    if (isLoading || isThinking || !activeTopic) return;
    
    setIsThinking(true);
    
    try {
      // System prompt for next question
      const nextQuestionPrompt = `Based on our conversation so far, please ask a different relevant interview question for the ${topics.find(t => t.id === activeTopic)?.title} topic. Ask just ONE new question that's commonly asked in real interviews.`;
      
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': 'AIzaSyClDjyj1k3isPIFr0kAKA9zFqU8EdK1hWo'
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: nextQuestionPrompt }]
            }
          ],
          generationConfig: {
            temperature: 0.8,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 512,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      const nextQuestion = data.candidates[0].content.parts[0].text;
      
      // Add system message
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: "Let's move on to the next question.",
        sender: 'bot',
        timestamp: new Date()
      }]);
      
      // Add the next question after a short delay
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now(),
          text: nextQuestion,
          sender: 'bot',
          timestamp: new Date()
        }]);
        setIsThinking(false);
      }, 1000);
      
    } catch (error) {
      console.error('Error getting next question:', error);
      setIsThinking(false);
      toast({
        title: 'Error',
        description: 'Failed to get the next question. Please try again.',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Interview Chatbot</h1>
        <p className="text-muted-foreground mt-1">Practice your interview skills with AI assistance powered by Google Gemini</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interview Categories */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Interview Topics</h2>
            
            <div className="space-y-3">
              {topics.map(topic => (
                <Button 
                  key={topic.id}
                  variant={activeTopic === topic.id ? "default" : "outline"}
                  className="w-full justify-start gap-2 text-left"
                  onClick={() => startInterview(topic.id)}
                  disabled={isLoading}
                >
                  {topic.icon}
                  <div>
                    <p className="font-medium">{topic.title}</p>
                    <p className="text-xs text-muted-foreground">{topic.description}</p>
                  </div>
                </Button>
              ))}
            </div>
            
            {activeTopic && (
              <div className="mt-4">
                <Button 
                  variant="outline" 
                  className="w-full gap-2"
                  onClick={handleNextQuestion}
                  disabled={isThinking || isLoading || messages.length < 2}
                >
                  {isThinking ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCcw className="h-4 w-4" />
                  )}
                  Next Question
                </Button>
              </div>
            )}
            
            <div className="mt-6 space-y-4">
              <h3 className="font-medium">Interview Tips</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Speak clearly and confidently</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Use the STAR method for behavioral questions</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Explain your thought process for technical questions</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Ask clarifying questions when needed</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
        
        {/* Chat Interface */}
        <Card className="lg:col-span-2">
          <CardContent className="p-0 h-[calc(100vh-240px)] flex flex-col">
            {/* Chat Messages */}
            <div 
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-2"
            >
              {messages.map(message => (
                <div 
                  key={message.id} 
                  className={cn(
                    "flex flex-col max-w-[80%]",
                    message.sender === 'user' ? "ml-auto items-end" : "items-start"
                  )}
                >
                  {/* Sender label */}
                  <span className="text-xs font-semibold mb-1 text-muted-foreground">
                    {message.sender === 'user' ? "You" : "PrepMate AI"}
                  </span>
                  <div className="flex gap-3">
                    {message.sender === 'bot' && (
                      <Avatar>
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          <Bot size={18} />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div 
                      className={cn(
                        "rounded-lg p-3",
                        message.sender === 'user' 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-muted"
                      )}
                    >
                      <p className="whitespace-pre-wrap">{message.text}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    {message.sender === 'user' && (
                      <Avatar>
                        <AvatarFallback className="bg-blue-500 text-white">P</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                </div>
              ))}
              
              {isThinking && (
                <div className="flex gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Bot size={18} />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-muted rounded-lg p-3 flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="h-2 w-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="h-2 w-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="h-2 w-2 bg-muted-foreground/40 rounded-full animate-bounce"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Input Area */}
            <div className="p-4 border-t">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input 
                  placeholder={interviewStarted ? "Type your answer..." : "Select a topic to start the interview..."}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  disabled={!interviewStarted || isLoading || isThinking}
                  className="flex-1"
                />
                <Button 
                  type="submit" 
                  disabled={!inputValue.trim() || !interviewStarted || isLoading || isThinking}
                >
                  {isThinking ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InterviewChatbot;
