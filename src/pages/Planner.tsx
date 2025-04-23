import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast";

const Planner = () => {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState<string[]>([]);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();

  const handleAddTask = () => {
    if (task.trim() !== '') {
      setTasks([...tasks, task]);
      setTask('');
      toast({
        title: "Task added",
        description: "Your task has been added successfully"
      });
    }
  };

  const handleDeleteTask = (index: number) => {
    const newTasks = [...tasks];
    newTasks.splice(index, 1);
    setTasks(newTasks);
    toast({
      title: "Task deleted",
      description: "Task has been removed"
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Daily Planner</h1>
        <p className="text-muted-foreground mt-1">Organize your tasks for the day</p>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Today's Tasks</h3>
          <Button size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            View Calendar
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <Input
            type="text"
            placeholder="Add a task..."
            className="flex-1"
            value={task}
            onChange={(e) => setTask(e.target.value)}
          />
          <Button onClick={handleAddTask}>Add Task</Button>
        </div>

        <ul>
          {tasks.map((task, index) => (
            <li key={index} className="flex items-center justify-between py-2 border-b">
              <span>{task}</span>
              <Button variant="ghost" size="sm" onClick={() => handleDeleteTask(index)}>
                Delete
              </Button>
            </li>
          ))}
        </ul>

        <div className="mt-6">
          <h4 className="text-md font-medium mb-2">Select Date</h4>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </Card>
    </div>
  );
};

export default Planner;
