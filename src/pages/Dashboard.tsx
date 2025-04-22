import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TaskList } from '@/components/TaskList';
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils";
import { format } from "date-fns"
import { Button } from '@/components/ui/button';
import { CalendarIcon } from "lucide-react";

const dummyTasks = [
  {
    title: "Complete React Tutorial",
    deadline: "2024-04-25",
    priority: "High" as const,
    progress: 75
  },
  {
    title: "Review DSA Concepts",
    deadline: "2024-04-23",
    priority: "Medium" as const,
    progress: 45
  },
  {
    title: "Practice LeetCode Problems",
    deadline: "2024-04-24",
    priority: "Low" as const,
    progress: 30
  }
];

const Dashboard = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Welcome Back!</CardTitle>
          <CardDescription>Here's what's happening today.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>You have 3 tasks due this week.</p>
        </CardContent>
      </Card>

      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Upcoming Tasks</CardTitle>
          <CardDescription>Your tasks for the week.</CardDescription>
        </CardHeader>
        <CardContent>
          <TaskList tasks={dummyTasks} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Calendar</CardTitle>
          <CardDescription>Check your schedule.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[280px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center" side="bottom">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(date) =>
                  date > new Date() || date < new Date("2023-01-01")
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
