import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ExamCountdownProps {
  examName: string;
  examDate: string;
  courseName: string;
}

export function ExamCountdown({ examName, examDate, courseName }: ExamCountdownProps) {
  const targetDate = new Date(examDate);

  return (
    <Card className="bg-gradient-to-br from-primary/10 to-background/50 border border-primary/20">
      <CardContent className="flex flex-col gap-3 p-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock size={14} className="text-primary" />
          <span>{courseName} Exam</span>
        </div>
        <h3 className="font-semibold text-lg">{examName}</h3>
        <p className="text-muted-foreground text-sm">
          {formatDistanceToNow(targetDate, { addSuffix: true })}
        </p>
      </CardContent>
    </Card>
  );
}
