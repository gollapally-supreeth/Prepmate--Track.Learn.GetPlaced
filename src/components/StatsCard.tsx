
import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface StatsCardProps {
  title: string;
  value: string;
  description?: string;
  trend?: number;
  icon: React.ReactNode;
  color?: string;
  percentageIncrease?: string;
  className?: string;
  onClick?: () => void;
}

export function StatsCard({ 
  title, 
  value, 
  description, 
  trend, 
  icon, 
  color, 
  percentageIncrease,
  className,
  onClick
}: StatsCardProps) {
  return (
    <Card 
      className={cn("shadow-sm border border-primary/20", className)}
      onClick={onClick}
    >
      <Card className="flex flex-col gap-2 p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm text-muted-foreground">{title}</h3>
          <span className={cn("text-xl p-2 rounded-md", color)}>{icon}</span>
        </div>
        <div className="space-y-1">
          <p className="text-2xl font-bold">{value}</p>
          {description && (
            <p className="text-xs text-muted-foreground">
              <span className={trend && trend > 0 ? "text-green-500" : "text-red-500"}>
                {trend && trend > 0 ? "+" : ""}
                {trend}%
              </span>{" "}
              {description}
            </p>
          )}
          {percentageIncrease && (
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">{percentageIncrease}</span> vs. last month
            </p>
          )}
        </div>
      </Card>
    </Card>
  );
}
