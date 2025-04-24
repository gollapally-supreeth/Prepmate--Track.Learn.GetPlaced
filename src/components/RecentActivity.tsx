
import React from 'react';
import { CheckCircle, Book, User, BookOpen, Calendar, Award, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface Activity {
  id: string;
  title: string;
  timestamp: Date;
  type: string;
  resultType?: string;
}

interface RecentActivityProps {
  activities: Activity[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'quiz':
        return <CheckCircle className="text-green-500" />;
      case 'resource':
        return <BookOpen className="text-blue-500" />;
      case 'interview':
        return <User className="text-purple-500" />;
      case 'resume':
        return <Award className="text-amber-500" />;
      default:
        return <Clock className="text-gray-500" />;
    }
  };

  const getResultBadge = (resultType?: string) => {
    if (!resultType) return null;
    
    switch (resultType) {
      case 'success':
        return <Badge variant="success">Success</Badge>;
      case 'partial':
        return <Badge variant="warning">Partial</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-md hover:bg-muted/50 transition-colors">
          <div className="mt-1 p-2 bg-muted rounded-full">
            {getActivityIcon(activity.type)}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">{activity.title}</h4>
              {getResultBadge(activity.resultType)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {format(activity.timestamp, 'PPp')}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
