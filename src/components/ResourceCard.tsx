
import React from 'react';
import { Card } from '@/components/ui/card';
import { FileType, Youtube, Github, File, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

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
  
  return (
    <Card className="p-4 shadow-sm hover:shadow transition-shadow cursor-pointer">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-muted rounded-lg">
          {getIcon()}
        </div>
        
        <div className="flex-1">
          <h3 className="font-medium text-sm mb-2">{title}</h3>
          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
            <ExternalLink size={12} />
            <span className="truncate max-w-[180px]">{url}</span>
          </div>
          
          <div className="flex flex-wrap gap-1">
            {tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs bg-muted/50">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
