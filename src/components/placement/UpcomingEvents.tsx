
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Video, Briefcase, Users, Book } from 'lucide-react';

// Mock upcoming events data
const upcomingEvents = [
  {
    id: '1',
    title: 'Google Technical Interview',
    date: '2023-07-19',
    time: '14:00',
    type: 'Interview',
    duration: '45 minutes',
    icon: Video,
  },
  {
    id: '2',
    title: 'Microsoft HR Round',
    date: '2023-07-20',
    time: '11:00',
    type: 'Interview',
    duration: '60 minutes',
    icon: Video,
  },
  {
    id: '3',
    title: 'Tech Career Fair',
    date: '2023-07-25',
    time: '10:00',
    type: 'Career Fair',
    duration: '4 hours',
    icon: Users,
  },
  {
    id: '4',
    title: 'System Design Workshop',
    date: '2023-07-27',
    time: '16:00',
    type: 'Workshop',
    duration: '2 hours',
    icon: Book,
  },
];

const UpcomingEvents: React.FC = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle>Upcoming Events</CardTitle>
        </div>
        <Button variant="outline" size="sm">
          <Calendar className="mr-2 h-4 w-4" />
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {upcomingEvents.map((event) => (
            <div key={event.id} className="flex items-start">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border bg-background">
                <event.icon className="h-5 w-5" />
              </div>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">{event.title}</p>
                <div className="flex items-center pt-1 text-xs text-muted-foreground">
                  <Calendar className="mr-1 h-3 w-3" />
                  <span>
                    {new Date(event.date).toLocaleDateString(undefined, {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                  <Clock className="ml-3 mr-1 h-3 w-3" />
                  <span>{event.time}</span>
                  <Badge className="ml-3" variant="outline">{event.type}</Badge>
                </div>
              </div>
              <div className="ml-auto flex-shrink-0">
                <Button variant="ghost" size="sm">Details</Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingEvents;
