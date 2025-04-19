
import React, { useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  Send, User, Bot, Cpu, Briefcase, Timer, 
  MessageSquare, Clock, Brain, BookText, ChevronDown,
  CheckCircle, HelpCircle, AlertCircle, Info
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useChat, interviewCategories } from '@/hooks/use-chat';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface InterviewTopicProps {
  icon: React.ElementType;
  title: string;
  description: string;
  onClick: () => void;
}

const InterviewTopic: React.FC<InterviewTopicProps> = ({ 
  icon: Icon, title, description, onClick 
}) => {
  return (
    <Button 
      variant="outline" 
      className="w-full justify-start gap-2 text-left"
      onClick={onClick}
    >
      <Icon size={18} />
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </Button>
  );
};

const InterviewChatbot = () => {
  const [activeTab, setActiveTab] = React.useState("chat");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const { 
    messages, 
    inputValue,
    setInputValue,
    sendMessage,
    startInterview,
    isTyping,
    category
  } = useChat({
    initialMessages: [{
      id: 1,
      text: "Hello! I'm your interview prep assistant. Choose a topic and I'll ask you relevant questions to help you practice for your interviews.",
      sender: 'bot',
      timestamp: new Date()
    }]
  });
  
  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    sendMessage();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const performanceData = [
    { category: "Technical", score: 75, total: 100 },
    { category: "HR", score: 85, total: 100 },
    { category: "Behavioral", score: 60, total: 100 },
    { category: "System Design", score: 45, total: 100 },
  ];

  const renderTopicEmoji = (topic: string) => {
    switch(topic.toLowerCase()) {
      case 'hr': return '👤';
      case 'technical': return '💻';
      case 'behavioral': return '🤝';
      case 'os': return '⚙️';
      default: return '📝';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Interview Chatbot</h1>
        <p className="text-muted-foreground mt-1">Practice your interview skills with AI assistance</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="lg:col-span-1">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="chat">Chat Topics</TabsTrigger>
            <TabsTrigger value="progress">My Progress</TabsTrigger>
          </TabsList>
          
          <TabsContent value="chat">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Interview Topics</h2>
                
                <div className="space-y-3">
                  <InterviewTopic 
                    icon={User}
                    title="HR Questions"
                    description="Behavioral & general questions"
                    onClick={() => {
                      startInterview('hr');
                      setActiveTab("chat");
                      toast({
                        title: "HR Interview Started",
                        description: "Practice your HR interview skills"
                      });
                    }}
                  />
                  
                  <InterviewTopic 
                    icon={Cpu}
                    title="Technical Interview"
                    description="DSA and coding concepts"
                    onClick={() => {
                      startInterview('technical');
                      setActiveTab("chat");
                      toast({
                        title: "Technical Interview Started",
                        description: "Practice your technical interview skills"
                      });
                    }}
                  />
                  
                  <InterviewTopic 
                    icon={MessageSquare}
                    title="Behavioral Interview"
                    description="Soft skills and communication"
                    onClick={() => {
                      startInterview('behavioral');
                      setActiveTab("chat");
                      toast({
                        title: "Behavioral Interview Started",
                        description: "Practice your behavioral interview skills"
                      });
                    }}
                  />
                  
                  <InterviewTopic 
                    icon={Briefcase}
                    title="Operating Systems"
                    description="OS concepts and internals"
                    onClick={() => {
                      startInterview('os');
                      setActiveTab("chat");
                      toast({
                        title: "OS Interview Started",
                        description: "Practice your OS interview skills"
                      });
                    }}
                  />
                </div>
                
                <div className="mt-6 space-y-4">
                  <h3 className="font-medium">Interview Tips</h3>
                  <ul className="space-y-2 text-sm">
                    <TooltipProvider>
                      <li className="flex gap-2">
                        <Tooltip>
                          <TooltipTrigger>
                            <span className="text-focus-green">✓</span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Practice makes perfect!</p>
                          </TooltipContent>
                        </Tooltip>
                        <span>Speak clearly and confidently</span>
                      </li>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <li className="flex gap-2">
                        <Tooltip>
                          <TooltipTrigger>
                            <span className="text-focus-green">✓</span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Situation, Task, Action, Result</p>
                          </TooltipContent>
                        </Tooltip>
                        <span>Use the STAR method for behavioral questions</span>
                      </li>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <li className="flex gap-2">
                        <Tooltip>
                          <TooltipTrigger>
                            <span className="text-focus-green">✓</span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Think aloud to show your problem-solving approach</p>
                          </TooltipContent>
                        </Tooltip>
                        <span>Explain your thought process for technical questions</span>
                      </li>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <li className="flex gap-2">
                        <Tooltip>
                          <TooltipTrigger>
                            <span className="text-focus-green">✓</span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Don't be afraid to ask for clarification</p>
                          </TooltipContent>
                        </Tooltip>
                        <span>Ask clarifying questions when needed</span>
                      </li>
                    </TooltipProvider>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="progress">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Your Progress</h2>
                
                <div className="space-y-6">
                  {performanceData.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{item.category}</span>
                        <span className="text-sm font-medium">{item.score}/{item.total}</span>
                      </div>
                      <Progress value={(item.score / item.total) * 100} className="h-2" />
                    </div>
                  ))}
                  
                  <div className="pt-4">
                    <h3 className="text-sm font-medium mb-2">Recent Activity</h3>
                    
                    <div className="space-y-2">
                      <div className="bg-muted p-3 rounded-md">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="bg-primary/20 text-primary p-1 rounded">
                              {renderTopicEmoji('technical')}
                            </span>
                            <span className="text-sm font-medium">Technical Interview</span>
                          </div>
                          <Badge variant="outline">2 days ago</Badge>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Completed 15 questions
                        </div>
                      </div>
                      
                      <div className="bg-muted p-3 rounded-md">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="bg-primary/20 text-primary p-1 rounded">
                              {renderTopicEmoji('hr')}
                            </span>
                            <span className="text-sm font-medium">HR Interview</span>
                          </div>
                          <Badge variant="outline">3 days ago</Badge>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Completed 8 questions
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <h3 className="text-sm font-medium mb-2">Recommendations</h3>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle size={16} className="text-focus-green" />
                        <span>Practice more System Design questions</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <Info size={16} className="text-focus-blue" />
                        <span>Review your Technical interview answers</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Chat Interface */}
        <Card className="lg:col-span-2">
          <CardContent className="p-0 h-[calc(100vh-240px)] flex flex-col">
            {/* Interview Category Indicator */}
            <div className="bg-muted p-2 flex items-center justify-between border-b">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-primary/10">
                  {category === 'hr' && (
                    <>
                      <User size={12} className="mr-1" />
                      HR Interview
                    </>
                  )}
                  {category === 'technical' && (
                    <>
                      <Cpu size={12} className="mr-1" />
                      Technical
                    </>
                  )}
                  {category === 'behavioral' && (
                    <>
                      <MessageSquare size={12} className="mr-1" />
                      Behavioral
                    </>
                  )}
                  {category === 'os' && (
                    <>
                      <Briefcase size={12} className="mr-1" />
                      OS
                    </>
                  )}
                </Badge>
                
                <span className="text-xs text-muted-foreground">
                  {interviewCategories[category as keyof typeof interviewCategories]?.length || 0} questions
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock size={12} />
                  <span className="text-xs">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </Badge>
              </div>
            </div>
            
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map(message => (
                <div 
                  key={message.id} 
                  className={cn(
                    "flex gap-3",
                    message.sender === 'user' ? "justify-end" : "justify-start"
                  )}
                >
                  {message.sender === 'bot' && (
                    <Avatar>
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <Bot size={18} />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div className={message.sender === 'user' ? "chat-message-user" : "chat-message-bot"}>
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
              
              {isTyping && (
                <div className="flex gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Bot size={18} />
                    </AvatarFallback>
                  </Avatar>
                  <div className="chat-message-bot">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
                      <div className="w-2 h-2 rounded-full bg-current animate-pulse delay-100" />
                      <div className="w-2 h-2 rounded-full bg-current animate-pulse delay-200" />
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input Area */}
            <div className="chat-input">
              <Input 
                placeholder="Type your answer..." 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isTyping}
              />
              <Button onClick={handleSend} disabled={isTyping || !inputValue.trim()}>
                <Send size={18} />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InterviewChatbot;
