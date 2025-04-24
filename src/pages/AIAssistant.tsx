
import React, { useState, useEffect, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, 
  MessageSquare, 
  PencilRuler,
  X,
  Plus,
  ArrowRight,
  Sparkles,
  Menu,
  Code,
  FileCheck,
  Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
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
    <div className="flex h-[calc(100vh-80px)] w-full overflow-hidden">
      {/* Mobile menu button */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute left-4 top-4 z-50 lg:hidden"
        onClick={() => setShowSidebar(!showSidebar)}
      >
        <Menu size={20} />
      </Button>

      {/* Chat sidebar - desktop */}
      <div className={cn(
        "border-r h-full hidden lg:block transition-all duration-300 overflow-hidden",
        showSidebar ? "w-80" : "w-0"
      )}>
        <ChatSidebar />
      </div>

      {/* Chat sidebar - mobile */}
      <Drawer>
        <DrawerTrigger asChild>
          <span className="lg:hidden" />
        </DrawerTrigger>
        <DrawerContent>
          <div className="max-h-[80vh] overflow-y-auto p-4">
            <ChatSidebar />
          </div>
        </DrawerContent>
      </Drawer>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="flex justify-between items-center border-b sticky top-0 z-10 p-4 bg-background">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600">
              <AvatarFallback className="text-white bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg">
                <Bot size={20} />
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold">PrepMate Assistant</h2>
                <Badge variant="outline" className="bg-primary/10 text-xs px-2 py-0">Beta</Badge>
              </div>
              <p className="text-sm text-muted-foreground">Powered by Google Gemini</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setShowSidebar(!showSidebar)}
              className="hidden lg:flex"
              title="Toggle sidebar"
            >
              <MessageSquare size={18} />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon"
              onClick={newSession}
              title="New conversation"
            >
              <PencilRuler size={18} />
            </Button>
          </div>
        </div>
        
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 overflow-y-auto">
            <div className="w-full max-w-3xl mx-auto space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-3"
              >
                <div className="mx-auto bg-gradient-to-br from-purple-600 to-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center">
                  <Bot size={30} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold">PrepMate AI Assistant</h2>
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
                  
                  <TabsContent value="explore" className="mt-6">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <SmartPrompts onSelectPrompt={handleSendMessage} />
                    </motion.div>
                  </TabsContent>
                  
                  <TabsContent value="help" className="mt-6">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      <Button 
                        variant="outline" 
                        className="h-auto py-4 px-4 flex flex-col items-start text-left gap-2 group hover:border-primary/50 hover:bg-primary/5 transition-colors"
                        onClick={() => handleSendMessage("I'm preparing for a coding interview. Can you help me practice data structure and algorithm problems?")}
                      >
                        <div className="bg-primary/10 p-2 rounded-md group-hover:bg-primary/20 transition-colors">
                          <Code className="h-5 w-5 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="font-medium">Coding Interview Prep</h3>
                          <p className="text-xs text-muted-foreground">Practice DSA problems and system design</p>
                        </div>
                        <div className="flex items-center text-primary text-xs mt-1">
                          Ask now <ArrowRight className="h-3 w-3 ml-1" />
                        </div>
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="h-auto py-4 px-4 flex flex-col items-start text-left gap-2 group hover:border-primary/50 hover:bg-primary/5 transition-colors"
                        onClick={() => handleSendMessage("I need to optimize my resume for software engineering internships. Can you help me improve it for ATS systems?")}
                      >
                        <div className="bg-primary/10 p-2 rounded-md group-hover:bg-primary/20 transition-colors">
                          <FileCheck className="h-5 w-5 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="font-medium">Resume Optimization</h3>
                          <p className="text-xs text-muted-foreground">Get resume feedback and ATS tips</p>
                        </div>
                        <div className="flex items-center text-primary text-xs mt-1">
                          Ask now <ArrowRight className="h-3 w-3 ml-1" />
                        </div>
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="h-auto py-4 px-4 flex flex-col items-start text-left gap-2 group hover:border-primary/50 hover:bg-primary/5 transition-colors"
                        onClick={() => handleSendMessage("I'm struggling with time management during exam season. Can you suggest a study plan that will help me balance multiple courses?")}
                      >
                        <div className="bg-primary/10 p-2 rounded-md group-hover:bg-primary/20 transition-colors">
                          <Calendar className="h-5 w-5 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="font-medium">Study Planning</h3>
                          <p className="text-xs text-muted-foreground">Create effective study schedules</p>
                        </div>
                        <div className="flex items-center text-primary text-xs mt-1">
                          Ask now <ArrowRight className="h-3 w-3 ml-1" />
                        </div>
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="h-auto py-4 px-4 flex flex-col items-start text-left gap-2 group hover:border-primary/50 hover:bg-primary/5 transition-colors"
                        onClick={() => handleSendMessage("I want to build a portfolio project that will impress recruiters. Can you suggest some ideas that showcase my programming skills?")}
                      >
                        <div className="bg-primary/10 p-2 rounded-md group-hover:bg-primary/20 transition-colors">
                          <Sparkles className="h-5 w-5 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="font-medium">Project Ideas</h3>
                          <p className="text-xs text-muted-foreground">Find portfolio-worthy projects</p>
                        </div>
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
          <ScrollArea className="flex-1 p-0">
            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <ChatMessage 
                    message={message}
                    onFeedback={handleFeedback}
                    onCopy={handleCopyMessage} 
                  />
                </motion.div>
              ))}
            </AnimatePresence>
            {suggestions.length > 0 && (
              <div className="px-4 md:px-12 mb-4">
                <SmartSuggestions 
                  suggestions={suggestions} 
                  onSelectSuggestion={handleSendMessage} 
                />
              </div>
            )}
            <div ref={messagesEndRef} className="h-[100px]" />
          </ScrollArea>
        )}
        
        <div className="p-4 mt-auto border-t bg-background">
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
