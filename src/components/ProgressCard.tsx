
import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface ProgressCardProps {
  subject: string;
  progress: number;
  color?: string;
}

export function ProgressCard({ subject, progress, color = 'bg-primary' }: ProgressCardProps) {
  return (
    <Card className="p-4 shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium text-sm">{subject}</h3>
        <span className="text-sm font-medium">{progress}%</span>
      </div>
      <Progress value={progress} className="h-2" indicatorClassName={color} />
    </Card>
  );
}
