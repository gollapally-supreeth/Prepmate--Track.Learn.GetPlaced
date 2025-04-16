
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarDays } from 'lucide-react';

interface ExamCountdownProps {
  examName: string;
  date: string;
  daysLeft: number;
}

export function ExamCountdown({ examName, date, daysLeft }: ExamCountdownProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <CalendarDays size={16} className="text-primary" />
              <p className="text-sm text-muted-foreground">{date}</p>
            </div>
            <h3 className="font-medium">{examName}</h3>
          </div>
          
          <div className="px-3 py-2 bg-primary/10 rounded-lg">
            <p className="text-xs text-muted-foreground">Days Left</p>
            <p className="text-xl font-bold text-primary text-center">{daysLeft}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
