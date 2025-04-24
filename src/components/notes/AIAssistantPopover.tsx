
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Sparkles, FileText, List, Code } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AIAssistantPopoverProps {
  selectedText: string;
  onUpdateContent: (newContent: string) => void;
}

export default function AIAssistantPopover({ 
  selectedText, 
  onUpdateContent 
}: AIAssistantPopoverProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const processWithAI = async (action: string) => {
    if (!selectedText) {
      toast({
        title: "No text selected",
        description: "Please select some text first.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Let's simulate an AI response instead of actually calling an API
      let result = "";
      
      switch (action) {
        case 'summarize':
          // Simulate summarization
          await new Promise(resolve => setTimeout(resolve, 1500));
          result = `## Summary\n\nThis is a summarized version of your text that captures the main points while being concise and easy to understand.`;
          break;
        case 'expand':
          // Simulate expansion
          await new Promise(resolve => setTimeout(resolve, 1500));
          result = `## Expanded Content\n\n${selectedText}\n\nThis concept is important because it relates to many fundamental principles in computer science. Let's explore this further:\n\n1. First key point explained in more detail\n2. Second aspect that's worth understanding\n3. Connection to related topics`;
          break;
        case 'format':
          // Simulate formatting
          await new Promise(resolve => setTimeout(resolve, 1500));
          result = `## Formatted Content\n\n### Key Points\n\n- ${selectedText.split(' ').join('\n- ')}\n\n### Conclusion\n\nThese points represent the core concepts of the topic.`;
          break;
        case 'code':
          // Simulate code formatting
          await new Promise(resolve => setTimeout(resolve, 1500));
          result = `\`\`\`javascript\n// Example code related to ${selectedText}\nfunction example() {\n  console.log("This is a code example");\n  return "Success";\n}\n\`\`\``;
          break;
        default:
          result = selectedText;
      }
      
      onUpdateContent(result);
      toast({
        title: "AI processing complete",
        description: `Successfully ${action}d the selected text.`,
      });
    } catch (error) {
      toast({
        title: "Processing failed",
        description: "Could not process your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" disabled={!selectedText}>
          <Sparkles className="h-4 w-4 mr-2" />
          <span>AI Assist</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="space-y-2">
          <h4 className="font-medium">AI Assistance</h4>
          <p className="text-sm text-muted-foreground">
            Select an action to apply to your selected text
          </p>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              className="justify-start"
              onClick={() => processWithAI('summarize')}
              disabled={isLoading}
            >
              <FileText className="h-4 w-4 mr-2" />
              Summarize
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="justify-start"
              onClick={() => processWithAI('expand')}
              disabled={isLoading}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Expand
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="justify-start"
              onClick={() => processWithAI('format')}
              disabled={isLoading}
            >
              <List className="h-4 w-4 mr-2" />
              Format
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="justify-start"
              onClick={() => processWithAI('code')}
              disabled={isLoading}
            >
              <Code className="h-4 w-4 mr-2" />
              Code
            </Button>
          </div>
          {isLoading && <p className="text-xs text-center animate-pulse">Processing...</p>}
        </div>
      </PopoverContent>
    </Popover>
  );
}
