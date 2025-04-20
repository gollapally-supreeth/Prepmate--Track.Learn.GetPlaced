
import React, { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: number;
  trendLabel?: string;
  className?: string;
  onClick?: () => void;
  variant?: 'default' | 'gradient';
}

export function StatsCard({ title, value, icon, trend, trendLabel, className, onClick, variant = 'default' }: StatsCardProps) {
  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-300 hover:shadow-lg",
      variant === 'gradient' && "bg-gradient-to-br from-primary/10 to-secondary/30 border-primary/20",
      className
    )}>
      <div onClick={onClick} className={cn(
        "p-6 cursor-pointer h-full", 
        onClick && "hover:scale-[1.02] transition-transform duration-200"
      )}>
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-muted-foreground font-medium">{title}</p>
            <h3 className="text-2xl font-bold mt-1 text-balance">{value}</h3>
            
            {trend !== undefined && (
              <div className="flex items-center mt-2 gap-1">
                {trend > 0 ? (
                  <ArrowUpIcon className="h-3 w-3 text-focus-green" />
                ) : (
                  <ArrowDownIcon className="h-3 w-3 text-focus-red" />
                )}
                <span className={cn(
                  "text-xs font-medium",
                  trend > 0 ? "text-focus-green" : "text-focus-red"
                )}>
                  {trend > 0 ? '+' : ''}{trend}% {trendLabel || ''}
                </span>
              </div>
            )}
          </div>
          
          <div className="p-2 bg-primary/15 rounded-lg text-primary animate-pulse-subtle">
            {icon}
          </div>
        </div>
      </div>
    </Card>
  );
}
