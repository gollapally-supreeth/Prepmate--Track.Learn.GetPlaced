import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from 'lucide-react';
import { format, isSameDay } from 'date-fns';
import { Calendar as CalendarUI } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  title: string;
  completed: boolean;
  dueDate: Date | null;
}

const Planner = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();

  useEffect(() => {
    const storedTasks = localStorage.getItem('prepmate-tasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('prepmate-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = () => {
    if (newTask.trim() !== "") {
      const newTaskItem: Task = {
        id: Date.now().toString(),
        title: newTask,
        completed: false,
        dueDate: selectedDate || null,
      };
      setTasks([...tasks, newTaskItem]);
      setNewTask("");
      toast({
        title: "Task added!",
        description: "Your task has been added to the list.",
      });
    }
  };

  const handleTaskComplete = async (taskId: string) => {
  try {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
    toast({
      title: "Task completed!",
      description: "Your task has been marked as complete.",
    });
  } catch (error) {
    console.error('Error completing task:', error);
    toast({
      title: "Error",
      description: "Failed to complete task. Please try again.",
      variant: "destructive",
    });
  }
};

  const handleTaskDelete = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    toast({
      title: "Task deleted!",
      description: "Your task has been removed from the list.",
    });
  };

  const filteredTasks = selectedDate
    ? tasks.filter(task => task.dueDate && isSameDay(task.dueDate, selectedDate))
    : tasks;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="border-primary/20">
        <CardContent className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">Add New Task</h2>
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              placeholder="Enter task"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
            />
            <Button onClick={handleAddTask}>Add</Button>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center" side="bottom">
              <CalendarUI
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) =>
                  date > new Date()
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden border-primary/20">
        <CardContent className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">Today's Tasks</h2>
          {filteredTasks.length === 0 ? (
            <p className="text-muted-foreground">No tasks for today.</p>
          ) : (
            filteredTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 rounded-md hover:bg-accent/5 transition-colors">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id={task.id}
                    checked={task.completed}
                    onCheckedChange={() => handleTaskComplete(task.id)}
                  />
                  <label
                    htmlFor={task.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {task.title}
                  </label>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleTaskDelete(task.id)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-trash"
                  >
                    <path d="M3 6h18" />
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                  </svg>
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card className="border-primary/20">
        <CardContent>
          <h2 className="text-lg font-semibold">Calendar</h2>
          <CalendarUI
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            disabled={(date) =>
              date > new Date()
            }
            initialFocus
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Planner;
