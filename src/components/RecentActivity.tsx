
import React from 'react';
import { Clock, FileText, TestTube, Timer } from 'lucide-react';

const activities = [
  {
    id: 1,
    type: 'note',
    title: 'Added notes on Data Structures',
    time: '2 hours ago',
    icon: FileText
  },
  {
    id: 2,
    type: 'quiz',
    title: 'Completed Algorithm Quiz',
    time: '4 hours ago',
    icon: TestTube
  },
  {
    id: 3,
    type: 'focus',
    title: 'Completed Focus Session',
    time: '6 hours ago',
    icon: Timer
  }
];

export function RecentActivity() {
  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/5 transition-colors">
          <div className="p-2 rounded-md bg-primary/10">
            <activity.icon size={16} className="text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">{activity.title}</p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock size={12} />
              <span>{activity.time}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
