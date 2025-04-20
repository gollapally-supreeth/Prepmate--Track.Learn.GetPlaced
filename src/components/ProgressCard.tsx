
import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface ProgressCardProps {
  subject: string;
  progress: number;
  color?: string;
  icon?: React.ReactNode;
}

export function ProgressCard({ subject, progress, color = 'bg-primary', icon }: ProgressCardProps) {
  return (
    <Card className="p-4 shadow-sm hover:shadow-md transition-all duration-200 hover:border-primary/20 overflow-hidden relative">
      {/* Decorative gradient background */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-transparent to-secondary/20 opacity-50"></div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            {icon && (
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                {icon}
              </div>
            )}
            <h3 className="font-medium text-sm">{subject}</h3>
          </div>
          <span className={cn(
            "text-sm font-bold",
            progress >= 70 ? "text-focus-green" : 
            progress >= 40 ? "text-focus-yellow" : 
            "text-focus-red"
          )}>{progress}%</span>
        </div>
        
        <div className="relative h-2 w-full bg-secondary rounded-full overflow-hidden">
          <div 
            className={`absolute top-0 left-0 h-full ${color} rounded-full transition-all duration-700 ease-out`} 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </Card>
  );
}
