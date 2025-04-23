
import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { SmartSuggestion } from './types';

interface SmartSuggestionsProps {
  suggestions: SmartSuggestion[];
  onSelectSuggestion: (prompt: string) => void;
}

const SmartSuggestions: React.FC<SmartSuggestionsProps> = ({ 
  suggestions, 
  onSelectSuggestion 
}) => {
  if (!suggestions || suggestions.length === 0) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="flex flex-wrap gap-2 mt-2"
    >
      {suggestions.map((suggestion, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 + index * 0.1 }}
        >
          <Button
            variant="outline"
            size="sm"
            className="bg-background hover:bg-muted text-sm h-auto py-1.5 px-3 rounded-full"
            onClick={() => onSelectSuggestion(suggestion.prompt)}
          >
            {suggestion.text}
          </Button>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default SmartSuggestions;
