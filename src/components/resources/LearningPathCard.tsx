
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, BookMarked, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface LearningPathCardProps {
  title: string;
  description: string;
  duration: string;
  difficulty: string;
  resourceCount: number;
  image: string;
}

export function LearningPathCard({
  title,
  description,
  duration,
  difficulty,
  resourceCount,
  image
}: LearningPathCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden border border-primary/20 bg-gradient-to-b from-card to-background/80">
        <div className="relative h-36 w-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          <Badge 
            className={cn(
              "absolute top-2 right-2 z-20",
              difficulty.includes("Beginner") ? "bg-green-500/90" : 
              difficulty.includes("Intermediate") ? "bg-amber-500/90" : 
              "bg-red-500/90"
            )}
          >
            {difficulty}
          </Badge>
        </div>
        
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
          
          <div className="flex flex-wrap gap-3 mt-4">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock size={14} />
              <span>{duration}</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <BookMarked size={14} />
              <span>{resourceCount} resources</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Calendar size={14} />
              <span>Daily tasks</span>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="px-4 pb-4 pt-0 flex justify-between">
          <Button variant="outline" size="sm" className="border-primary/30 hover:border-primary">
            Preview
          </Button>
          <Button size="sm" className="bg-gradient-to-r from-primary to-purple-500">
            Start Learning
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
