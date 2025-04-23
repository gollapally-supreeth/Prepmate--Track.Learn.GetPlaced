
import React, { useState, useEffect, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Bot, 
  MessageSquare, 
  PencilRuler,
  X,
  Plus,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import ChatInput from '@/components/ai-assistant/ChatInput';
import ChatMessage from '@/components/ai-assistant/ChatMessage';
import ChatSidebar from '@/components/ai-assistant/ChatSidebar';
import SmartPrompts from '@/components/ai-assistant/SmartPrompts';
import SmartSuggestions from '@/components/ai-assistant/SmartSuggestions';
import { useAIAssistant } from '@/components/ai-assistant/AIAssistantContext';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AIAssistant = () => {
  const { 
    activeSession, 
    messages, 
    sendMessage, 
    isLoading,
    newSession,
    suggestions,
    handleFeedback
  } = useAIAssistant();
  
  const [showSidebar, setShowSidebar] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('explore');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    try {
      await sendMessage(content);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  return (
    <div className="flex h-[calc(100vh-80px)] animate-fade-in bg-background dark:bg-background">
      {/* Mobile chat history drawer */}
      <Drawer>
        <DrawerTrigger asChild>
          <Button 
            variant="outline" 
            size="icon" 
            className="absolute left-4 top-4 z-10 lg:hidden"
          >
            <MessageSquare size={18} />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="max-h-[80vh] overflow-y-auto p-4">
            <ChatSidebar />
          </div>
        </DrawerContent>
      </Drawer>

      {/* Desktop chat sidebar */}
      <div className={cn(
        "border-r hidden lg:block transition-all duration-300 overflow-hidden",
        showSidebar ? "w-72" : "w-0"
      )}>
        <ChatSidebar />
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="flex justify-between items-center border-b p-4">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 bg-gradient-to-br from-purple-600 to-indigo-600">
              <AvatarFallback className="text-white bg-gradient-to-br from-purple-600 to-indigo-600">AI</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-lg font-semibold">PrepMate Assistant</h2>
              <p className="text-sm text-muted-foreground">AI-powered learning companion</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setShowSidebar(!showSidebar)}
              className="hidden lg:flex"
            >
              <MessageSquare size={18} />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon"
              onClick={newSession}
            >
              <PencilRuler size={18} />
              <span className="sr-only">New Chat</span>
            </Button>
          </div>
        </div>
        
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden">
            <div className="w-full max-w-3xl mx-auto space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-3"
              >
                <div className="mx-auto bg-gradient-to-br from-purple-600 to-indigo-600 w-16 h-16 rounded-full flex items-center justify-center">
                  <Bot size={30} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold">PrepMate Assistant</h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Your AI-powered learning companion for DSA, coding interviews, resume help, and productivity.
                </p>
              </motion.div>
              
              <div className="space-y-6">
                <Tabs defaultValue="explore" onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
                    <TabsTrigger value="explore">Explore</TabsTrigger>
                    <TabsTrigger value="help">Help Me With</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="explore" className="mt-4 space-y-4">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <SmartPrompts onSelectPrompt={handleSendMessage} />
                    </motion.div>
                  </TabsContent>
                  
                  <TabsContent value="help" className="mt-4">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="grid gap-3 md:grid-cols-2"
                    >
                      <Button 
                        variant="outline" 
                        className="h-auto py-4 px-4 flex flex-col items-start text-left gap-2 hover:border-primary/50 hover:bg-primary/5"
                        onClick={() => handleSendMessage("I'm preparing for a coding interview. Can you help me practice data structure and algorithm problems?")}
                      >
                        <h3 className="font-medium">Coding Interview Prep</h3>
                        <p className="text-sm text-muted-foreground">Practice DSA problems and system design</p>
                        <div className="flex items-center text-primary text-xs mt-1">
                          Ask now <ArrowRight className="h-3 w-3 ml-1" />
                        </div>
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="h-auto py-4 px-4 flex flex-col items-start text-left gap-2 hover:border-primary/50 hover:bg-primary/5"
                        onClick={() => handleSendMessage("I need to optimize my resume for software engineering internships. Can you help me improve it for ATS systems?")}
                      >
                        <h3 className="font-medium">Resume Optimization</h3>
                        <p className="text-sm text-muted-foreground">Get resume feedback and ATS tips</p>
                        <div className="flex items-center text-primary text-xs mt-1">
                          Ask now <ArrowRight className="h-3 w-3 ml-1" />
                        </div>
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="h-auto py-4 px-4 flex flex-col items-start text-left gap-2 hover:border-primary/50 hover:bg-primary/5"
                        onClick={() => handleSendMessage("I'm struggling with time management during exam season. Can you suggest a study plan that will help me balance multiple courses?")}
                      >
                        <h3 className="font-medium">Study Planning</h3>
                        <p className="text-sm text-muted-foreground">Create effective study schedules</p>
                        <div className="flex items-center text-primary text-xs mt-1">
                          Ask now <ArrowRight className="h-3 w-3 ml-1" />
                        </div>
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="h-auto py-4 px-4 flex flex-col items-start text-left gap-2 hover:border-primary/50 hover:bg-primary/5"
                        onClick={() => handleSendMessage("I want to build a portfolio project that will impress recruiters. Can you suggest some ideas that showcase my programming skills?")}
                      >
                        <h3 className="font-medium">Project Ideas</h3>
                        <p className="text-sm text-muted-foreground">Find portfolio-worthy projects</p>
                        <div className="flex items-center text-primary text-xs mt-1">
                          Ask now <ArrowRight className="h-3 w-3 ml-1" />
                        </div>
                      </Button>
                    </motion.div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        ) : (
          <ScrollArea className="flex-1 px-4">
            <div className="max-w-3xl mx-auto py-4">
              {messages.map((message) => (
                <ChatMessage 
                  key={message.id} 
                  message={message}
                  onFeedback={handleFeedback}
                  onCopy={handleCopyMessage} 
                />
              ))}
              {suggestions.length > 0 && (
                <div className="px-12 mb-4">
                  <SmartSuggestions 
                    suggestions={suggestions} 
                    onSelectSuggestion={handleSendMessage} 
                  />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        )}
        
        <div className="p-4 mt-auto border-t bg-background/80 backdrop-blur-sm">
          <ChatInput 
            onSendMessage={handleSendMessage} 
            isLoading={isLoading} 
          />
          <div className="mt-2 text-xs text-center text-muted-foreground">
            PrepMate AI may produce inaccurate information about people, places, or facts.
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
