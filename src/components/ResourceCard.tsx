
import React from 'react';
import { Card } from '@/components/ui/card';
import { FileType, Youtube, Github, File, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

type ResourceType = 'video' | 'pdf' | 'github' | 'link';

interface ResourceCardProps {
  title: string;
  type: ResourceType;
  url: string;
  tags: string[];
}

export function ResourceCard({ title, type, url, tags }: ResourceCardProps) {
  const getIcon = () => {
    switch (type) {
      case 'video':
        return <Youtube size={24} className="text-focus-red" />;
      case 'pdf':
        return <FileType size={24} className="text-focus-blue" />;
      case 'github':
        return <Github size={24} className="text-focus-purple" />;
      case 'link':
      default:
        return <File size={24} className="text-focus-green" />;
    }
  };
  
  const getTypeColor = () => {
    switch (type) {
      case 'video': return 'bg-red-500/10 border-red-500/20';
      case 'pdf': return 'bg-blue-500/10 border-blue-500/20';
      case 'github': return 'bg-purple-500/10 border-purple-500/20';
      case 'link': default: return 'bg-green-500/10 border-green-500/20';
    }
  };
  
  return (
    <Card className={cn(
      "p-4 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group overflow-hidden",
      getTypeColor()
    )}>
      <div className="flex items-start gap-3 relative">
        {/* Animated dot in top-right corner */}
        <div className={cn(
          "absolute top-0 right-0 h-2 w-2 rounded-full",
          type === 'video' ? "bg-focus-red" : 
          type === 'pdf' ? "bg-focus-blue" : 
          type === 'github' ? "bg-focus-purple" : 
          "bg-focus-green"
        )}></div>
        
        <div className={cn(
          "p-3 rounded-lg transition-transform duration-300 group-hover:scale-110",
          type === 'video' ? "bg-red-500/10" : 
          type === 'pdf' ? "bg-blue-500/10" : 
          type === 'github' ? "bg-purple-500/10" : 
          "bg-green-500/10"
        )}>
          {getIcon()}
        </div>
        
        <div className="flex-1">
          <h3 className="font-medium text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors">{title}</h3>
          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
            <ExternalLink size={12} />
            <span className="truncate max-w-[180px]">{url}</span>
          </div>
          
          <div className="flex flex-wrap gap-1">
            {tags.map((tag, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="text-xs bg-background/50 transition-all hover:bg-background"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
