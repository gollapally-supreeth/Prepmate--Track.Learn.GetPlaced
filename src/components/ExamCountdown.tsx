import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface ExamCountdownProps {
  examName: string;
  date: Date;
  daysLeft: number;
}

export const ExamCountdown: React.FC<ExamCountdownProps> = ({
  examName,
  date,
  daysLeft,
}) => {
  const formattedDate = format(date, 'MMM dd, yyyy');

  return (
    <Card className="bg-white rounded-lg shadow-md">
      <CardContent className="p-4 flex flex-col">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-2">
            <Calendar className="text-purple-500" size={18} />
            <p className="text-sm text-gray-600">{formattedDate}</p>
          </div>
          <div className="bg-purple-200 text-purple-800 font-bold rounded-full min-w-[40px] min-h-[30px] flex items-center justify-center px-2 text-xs">
            <span>
              {daysLeft === 0 ? 'Today!' : `${daysLeft} ${daysLeft === 1 ? 'day' : 'days'} left`}
            </span>
          </div>
        </div>
        <p className="text-gray-800 mt-2 text-xs">{examName}</p>
      </CardContent>
    </Card>
  );
};
