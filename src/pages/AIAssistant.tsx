
import React, { useState, useEffect, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Bot, 
  User, 
  Send, 
  Trash2, 
  MessageSquare, 
  FileCheck, 
  Briefcase, 
  Clock, 
  Bookmark, 
  Code,
  PencilRuler
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { v4 as uuidv4 } from '@/lib/uuid';
import { AIMessage, AIMessageType, ChatSession } from '@/components/ai-assistant/types';
import ChatInput from '@/components/ai-assistant/ChatInput';
import ChatMessage from '@/components/ai-assistant/ChatMessage';
import ChatSidebar from '@/components/ai-assistant/ChatSidebar';
import SmartPrompts from '@/components/ai-assistant/SmartPrompts';
import { useAIAssistant } from '@/components/ai-assistant/AIAssistantContext';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';

const AIAssistant = () => {
  const { 
    activeSession, 
    messages, 
    sendMessage, 
    isLoading,
    newSession,
    activateSession,
    sessions
  } = useAIAssistant();
  
  const [showSidebar, setShowSidebar] = useState(false);
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

  return (
    <div className="flex h-[calc(100vh-80px)] animate-fade-in">
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
        "w-80 border-r hidden lg:block transition-all duration-300 overflow-y-auto",
        showSidebar ? "translate-x-0" : "-translate-x-full"
      )}>
        <ChatSidebar />
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col h-full">
        <div className="flex justify-between items-center border-b p-4">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 bg-primary/10">
              <AvatarFallback className="text-primary bg-primary/10">AI</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-lg font-semibold">PrepMate Assistant</h2>
              <p className="text-sm text-muted-foreground">AI-powered learning companion</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setShowSidebar(!showSidebar)}
              className="hidden lg:flex"
            >
              <MessageSquare size={18} />
            </Button>
            
            <Button 
              variant="outline" 
              size="icon"
              onClick={newSession}
            >
              <PencilRuler size={18} />
              <span className="sr-only">New Chat</span>
            </Button>
          </div>
        </div>
        
        <ScrollArea className="flex-1 p-4 pb-0">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center">
              <div className="max-w-md text-center space-y-6">
                <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center">
                  <Bot size={28} className="text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Welcome to PrepMate AI Assistant</h3>
                <p className="text-muted-foreground">
                  Your learning companion for DSA, coding, interviews, and productivity. How can I help you today?
                </p>
                <div className="pt-4">
                  <SmartPrompts onSelectPrompt={handleSendMessage} />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </ScrollArea>
        
        <div className="p-4 pt-2 border-t">
          <ChatInput 
            onSendMessage={handleSendMessage} 
            isLoading={isLoading} 
          />
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
