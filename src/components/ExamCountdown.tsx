
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarDays } from 'lucide-react';

interface ExamCountdownProps {
  examName: string;
  date: string;
  daysLeft: number;
}

export function ExamCountdown({ examName, date, daysLeft }: ExamCountdownProps) {
  const displayDate = date ? date : "Date not set";
  return (
    <Card className="overflow-hidden">
      <div className="absolute top-2 right-2 px-3 py-1 bg-primary rounded-l-md rounded-br-md text-xs text-primary-foreground">
        {daysLeft} days left
      </div>

      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <CalendarDays size={16} className="text-primary" />              
              <p className="text-sm text-muted-foreground">{displayDate}</p>
            </div>
            <h3 className="font-medium">{examName}</h3>
          </div>
          <div className="flex flex-col gap-2 items-end">
            <div className="bg-primary-foreground px-3 py-2 rounded-lg">
              <p className="text-xl font-bold text-primary">{daysLeft}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
