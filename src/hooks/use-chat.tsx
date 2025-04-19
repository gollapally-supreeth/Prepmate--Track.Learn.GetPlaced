
import { useState, useCallback } from 'react';

export interface ChatMessage {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface QuestionCategory {
  name: string;
  questions: string[];
}

interface UseChatOptions {
  initialMessages?: ChatMessage[];
}

export const interviewCategories = {
  'hr': [
    "Tell me about yourself.",
    "Why do you want to work for our company?",
    "What are your greatest strengths?", 
    "What are your weaknesses?",
    "Where do you see yourself in 5 years?",
    "How do you handle stress or pressure?",
    "Describe a challenging situation you faced at work or school and how you handled it.",
    "Why should we hire you?",
    "What is your salary expectation?",
    "Do you have any questions for us?"
  ],
  'technical': [
    "Can you explain the difference between process and thread?",
    "How does a hash table work?",
    "What is the time complexity of quicksort?",
    "Explain the concept of RESTful APIs.",
    "What are the four pillars of OOP?",
    "Explain the difference between stack and heap memory.",
    "Write a function to detect if a string has balanced parentheses.",
    "How would you optimize a slow database query?",
    "Explain how HTTPS works.",
    "What is the difference between a LinkedList and an ArrayList?"
  ],
  'behavioral': [
    "Tell me about a time when you had to work with a difficult team member.",
    "Describe a situation where you had to meet a tight deadline.",
    "Give an example of a time when you showed leadership.",
    "Tell me about a time when you failed and what you learned from it.",
    "How do you prioritize when you have multiple deadlines?",
    "Describe a situation where you had to make an unpopular decision.",
    "How do you handle feedback or criticism?",
    "Tell me about a time when you exceeded expectations.",
    "How do you stay motivated during repetitive tasks?",
    "Describe a time when you had to adapt to a significant change."
  ],
  'os': [
    "Explain the concept of virtual memory.",
    "What is deadlock in operating systems?",
    "How does the CPU scheduling algorithm work?",
    "Explain paging and segmentation.",
    "What is thrashing in operating systems?",
    "Describe the differences between process and thread.",
    "Explain how an operating system handles memory management.",
    "What is a semaphore and how is it used?",
    "Explain the concept of a context switch.",
    "What are the differences between a monolithic kernel and a microkernel?"
  ]
};

export function useChat({ initialMessages = [] }: UseChatOptions = {}) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [category, setCategory] = useState<string>('hr');
  const [currentQuestion, setCurrentQuestion] = useState(-1);
  const [isTyping, setIsTyping] = useState(false);
  
  const sendMessage = useCallback((text?: string) => {
    const messageText = text || inputValue;
    if (!messageText.trim()) return;
    
    const newUserMessage: ChatMessage = {
      id: Date.now(),
      text: messageText,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setInputValue('');
    setIsTyping(true);
    
    // Simulate bot response after a short delay
    setTimeout(() => {
      const botResponse: ChatMessage = {
        id: Date.now() + 1,
        text: "That's a good answer! Here's another question:",
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      
      // Ask next question
      setTimeout(() => {
        const questions = interviewCategories[category as keyof typeof interviewCategories];
        const nextQuestionIndex = (currentQuestion + 1) % questions.length;
        const questionText = questions[nextQuestionIndex];
        
        const questionMessage: ChatMessage = {
          id: Date.now() + 2,
          text: questionText,
          sender: 'bot',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, questionMessage]);
        setCurrentQuestion(nextQuestionIndex);
        setIsTyping(false);
      }, 500);
    }, 1000);
  }, [inputValue, category, currentQuestion]);
  
  const startInterview = useCallback((newCategory: string) => {
    setCategory(newCategory);
    
    const welcomeMessage: ChatMessage = {
      id: Date.now(),
      text: `Great! Let's start with some ${newCategory.toUpperCase()} interview questions.`,
      sender: 'bot',
      timestamp: new Date()
    };
    
    setMessages([welcomeMessage]);
    setIsTyping(true);
    
    // Ask first question after a short delay
    setTimeout(() => {
      const firstQuestion = interviewCategories[newCategory as keyof typeof interviewCategories][0];
      const questionMessage: ChatMessage = {
        id: Date.now() + 1,
        text: firstQuestion,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, questionMessage]);
      setCurrentQuestion(0);
      setIsTyping(false);
    }, 500);
  }, []);
  
  return {
    messages,
    inputValue,
    setInputValue,
    sendMessage,
    startInterview,
    isTyping,
    category,
  };
}
