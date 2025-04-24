
import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ProgressCardProps {
  title?: string; // For backward compatibility
  value?: number; // For backward compatibility
  percent?: number; // New property name
  label?: string; // New property name
  icon: React.ReactNode;
  className?: string;
}

export function ProgressCard({ 
  title,
  value,
  percent,
  label,
  icon,
  className
}: ProgressCardProps) {
  // For backward compatibility, use title or label, value or percent
  const displayTitle = title || label || '';
  const displayValue = percent || value || 0;
  
  return (
    <Card className={cn("p-4 flex items-center gap-3", className)}>
      <div className="p-2 bg-muted rounded-full">
        {icon}
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-medium">{displayTitle}</h4>
        <div className="mt-2 h-2 w-full bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary rounded-full" 
            style={{ width: `${displayValue}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {displayValue}% complete
        </p>
      </div>
    </Card>
  );
}

export default ProgressCard;
