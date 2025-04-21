
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ResourceCard } from '@/components/ResourceCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { resourceData } from '@/data/resourceData';
import { cn } from '@/lib/utils';

export function ResourceRecommendations() {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // In a real implementation, this would call the AI service
    // For now, just grab some random resources from our data
    const sampleRecommendations = [...resourceData]
      .sort(() => 0.5 - Math.random())
      .slice(0, 8);
    
    setRecommendations(sampleRecommendations);
  }, []);
  
  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = direction === 'left' ? -300 : 300;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };
  
  if (recommendations.length === 0) {
    return null;
  }
  
  return (
    <div className="relative">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles size={20} className="text-primary" />
        <h2 className="text-lg font-semibold">Recommended for you</h2>
        <Badge variant="outline" className="ml-auto bg-primary/10">AI powered</Badge>
      </div>
      
      <div className="relative group">
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-4 pb-4 no-scrollbar snap-x"
        >
          {recommendations.map((resource) => (
            <motion.div
              key={resource.id}
              className="flex-shrink-0 w-[280px] snap-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ResourceCard
                title={resource.title}
                type={resource.type}
                url={resource.url}
                tags={resource.tags}
                description={resource.description || ""}
                difficulty={resource.difficulty || "Intermediate"}
                duration={resource.duration || ""}
                source={resource.source || ""}
                rating={resource.rating || 0}
              />
            </motion.div>
          ))}
        </div>
        
        <Button 
          variant="outline" 
          size="icon" 
          className={cn(
            "absolute left-0 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity",
            "border-primary/20 hover:bg-primary/10 hover:text-primary"
          )}
          onClick={() => scroll('left')}
        >
          <ArrowLeft size={16} />
        </Button>
        
        <Button 
          variant="outline" 
          size="icon" 
          className={cn(
            "absolute right-0 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity",
            "border-primary/20 hover:bg-primary/10 hover:text-primary"
          )}
          onClick={() => scroll('right')}
        >
          <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
}
