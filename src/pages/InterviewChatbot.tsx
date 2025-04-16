
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Send, User, Bot, Cpu, Briefcase } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

// Sample interview questions by category
const interviewQuestions = {
  'hr': [
    "Tell me about yourself.",
    "Why do you want to work for our company?",
    "What are your greatest strengths?", 
    "What are your weaknesses?",
    "Where do you see yourself in 5 years?"
  ],
  'technical': [
    "Can you explain the difference between process and thread?",
    "How does a hash table work?",
    "What is the time complexity of quicksort?",
    "Explain the concept of RESTful APIs.",
    "What are the four pillars of OOP?"
  ],
  'os': [
    "Explain the concept of virtual memory.",
    "What is deadlock in operating systems?",
    "How does the CPU scheduling algorithm work?",
    "Explain paging and segmentation.",
    "What is thrashing in operating systems?"
  ]
};

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const InterviewChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your interview prep assistant. Choose a topic and I'll ask you relevant questions to help you practice for your interviews.",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [category, setCategory] = useState('hr');
  const [currentQuestion, setCurrentQuestion] = useState(-1);
  
  const sendMessage = () => {
    if (!inputValue.trim()) return;
    
    const newMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    
    // Simulate bot response after a short delay
    setTimeout(() => {
      const botResponse: Message = {
        id: messages.length + 2,
        text: "That's a good answer! Here's another question:",
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      
      // Ask next question
      setTimeout(() => {
        const nextQuestionIndex = (currentQuestion + 1) % interviewQuestions[category as keyof typeof interviewQuestions].length;
        const questionText = interviewQuestions[category as keyof typeof interviewQuestions][nextQuestionIndex];
        
        const questionMessage: Message = {
          id: messages.length + 3,
          text: questionText,
          sender: 'bot',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, questionMessage]);
        setCurrentQuestion(nextQuestionIndex);
      }, 500);
    }, 1000);
  };
  
  const startInterview = (category: string) => {
    setCategory(category);
    
    const welcomeMessage: Message = {
      id: messages.length + 1,
      text: `Great! Let's start with some ${category.toUpperCase()} interview questions.`,
      sender: 'bot',
      timestamp: new Date()
    };
    
    setMessages([welcomeMessage]);
    
    // Ask first question after a short delay
    setTimeout(() => {
      const firstQuestion = interviewQuestions[category as keyof typeof interviewQuestions][0];
      const questionMessage: Message = {
        id: messages.length + 2,
        text: firstQuestion,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, questionMessage]);
      setCurrentQuestion(0);
    }, 500);
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Interview Chatbot</h1>
        <p className="text-muted-foreground mt-1">Practice your interview skills with AI assistance</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interview Categories */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Interview Topics</h2>
            
            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2 text-left"
                onClick={() => startInterview('hr')}
              >
                <User size={18} />
                <div>
                  <p className="font-medium">HR Questions</p>
                  <p className="text-xs text-muted-foreground">Behavioral & general questions</p>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2 text-left"
                onClick={() => startInterview('technical')}
              >
                <Cpu size={18} />
                <div>
                  <p className="font-medium">Technical Interview</p>
                  <p className="text-xs text-muted-foreground">DSA and coding concepts</p>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2 text-left"
                onClick={() => startInterview('os')}
              >
                <Briefcase size={18} />
                <div>
                  <p className="font-medium">Operating Systems</p>
                  <p className="text-xs text-muted-foreground">OS concepts and internals</p>
                </div>
              </Button>
            </div>
            
            <div className="mt-6 space-y-4">
              <h3 className="font-medium">Interview Tips</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex gap-2">
                  <span className="text-focus-green">✓</span>
                  <span>Speak clearly and confidently</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-focus-green">✓</span>
                  <span>Use the STAR method for behavioral questions</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-focus-green">✓</span>
                  <span>Explain your thought process for technical questions</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-focus-green">✓</span>
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
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map(message => (
                <div 
                  key={message.id} 
                  className={cn(
                    "flex gap-3 max-w-[80%]",
                    message.sender === 'user' ? "ml-auto" : ""
                  )}
                >
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
                    <p>{message.text}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  
                  {message.sender === 'user' && (
                    <Avatar>
                      <AvatarFallback className="bg-focus-blue text-white">P</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
            </div>
            
            {/* Input Area */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input 
                  placeholder="Type your answer..." 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                />
                <Button onClick={sendMessage}>
                  <Send size={18} />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InterviewChatbot;
