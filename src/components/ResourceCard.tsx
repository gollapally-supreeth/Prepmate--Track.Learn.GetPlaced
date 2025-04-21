
import React from 'react';
import { Card } from '@/components/ui/card';
import { FileType, Youtube, Github, File, ExternalLink, Clock, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { ResourceType, ResourceDifficulty } from '@/pages/ResourcesHub';

interface ResourceCardProps {
  title: string;
  type: ResourceType;
  url: string;
  tags: string[];
  description?: string;
  difficulty?: ResourceDifficulty;
  duration?: string;
  source?: string;
  rating?: number;
  onClick?: () => void;
}

export function ResourceCard({ 
  title, 
  type, 
  url, 
  tags, 
  description = "", 
  difficulty = "Intermediate",
  duration = "",
  source = "",
  rating = 0,
  onClick 
}: ResourceCardProps) {
  
  const getIcon = () => {
    switch (type) {
      case 'video':
        return <Youtube size={24} className="text-focus-red" />;
      case 'pdf':
        return <FileType size={24} className="text-focus-blue" />;
      case 'github':
        return <Github size={24} className="text-focus-purple" />;
      case 'article':
        return <File size={24} className="text-focus-green" />;
      case 'course':
        return <File size={24} className="text-amber-500" />;
      case 'link':
      default:
        return <ExternalLink size={24} className="text-focus-green" />;
    }
  };
  
  const getTypeColor = () => {
    switch (type) {
      case 'video': return 'bg-red-500/10 border-red-500/20';
      case 'pdf': return 'bg-blue-500/10 border-blue-500/20';
      case 'github': return 'bg-purple-500/10 border-purple-500/20';
      case 'article': return 'bg-green-500/10 border-green-500/20';
      case 'course': return 'bg-amber-500/10 border-amber-500/20';
      case 'link': default: return 'bg-green-500/10 border-green-500/20';
    }
  };

  const getDifficultyColor = () => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-500/10 text-green-500';
      case 'Intermediate': return 'bg-amber-500/10 text-amber-500';
      case 'Advanced': return 'bg-red-500/10 text-red-500';
      default: return 'bg-muted text-muted-foreground';
    }
  };
  
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} size={12} className="text-yellow-500 fill-yellow-500" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<Star key={i} size={12} className="text-yellow-500 fill-yellow-500" />);
      } else {
        stars.push(<Star key={i} size={12} className="text-muted-foreground/30" />);
      }
    }
    
    return stars;
  };
  
  return (
    <Card 
      className={cn(
        "p-4 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer",
        "border border-primary/20 bg-card hover:bg-gradient-to-br hover:from-card hover:to-background",
        "overflow-hidden"
      )}
      onClick={onClick}
    >
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
          type === 'article' ? "bg-green-500/10" :
          type === 'course' ? "bg-amber-500/10" :
          "bg-green-500/10"
        )}>
          {getIcon()}
        </div>
        
        <div className="flex-1 overflow-hidden">
          <h3 className="font-medium text-sm mb-1 line-clamp-2 transition-colors hover:text-primary">{title}</h3>
          
          {description && (
            <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{description}</p>
          )}
          
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mb-3">
            {source && <span className="font-medium">{source}</span>}
            {duration && (
              <div className="flex items-center gap-1">
                <Clock size={12} />
                <span>{duration}</span>
              </div>
            )}
            {rating > 0 && (
              <div className="flex items-center">
                {renderStars()}
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className={cn(
              "text-xs bg-background/50 transition-all hover:bg-background",
              getDifficultyColor()
            )}>
              {difficulty}
            </Badge>
            {tags.slice(0, 3).map((tag, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="text-xs bg-background/50 transition-all hover:bg-background"
              >
                {tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge 
                variant="outline" 
                className="text-xs bg-background/50"
              >
                +{tags.length - 3}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
