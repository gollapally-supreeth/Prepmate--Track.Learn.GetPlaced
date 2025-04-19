import React, { useState } from 'react';
import { Calendar } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { format } from 'date-fns';
import { Plus, Pencil, Trash2 } from 'lucide-react';

// Setup the localizer by providing the dependencies.
// Depending on the type of calendar you want, there are different localizers available.
import { DateLocalizer, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'

const localizer = momentLocalizer(moment)

interface Task {
  id: string;
  title: string;
  start: Date;
  end: Date;
  subject: string;
  description: string;
  completed: boolean;
}

const Planner = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    id: '',
    title: '',
    start: new Date(),
    end: new Date(),
    subject: '',
    description: '',
    completed: false,
  });
  const { toast } = useToast();

  const handleTaskClick = (event: Task) => {
    setSelectedTask(event);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date: Date | null, name: 'start' | 'end') => {
    if (date) {
      setNewTask({ ...newTask, [name]: date });
    }
  };

  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const taskId = Date.now().toString();
    const taskToAdd = { ...newTask, id: taskId };
    setTasks([...tasks, taskToAdd]);
    setNewTask({
      id: '',
      title: '',
      start: new Date(),
      end: new Date(),
      subject: '',
      description: '',
      completed: false,
    });
    setIsTaskModalOpen(false);
    toast({
      title: "Task Added",
      description: "New task has been added to your planner"
    });
  };

  const handleEditTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTask) {
      const updatedTasks = tasks.map(task =>
        task.id === selectedTask.id ? { ...selectedTask } : task
      );
      setTasks(updatedTasks);
      setSelectedTask(null);
      setIsEditModalOpen(false);
      toast({
        title: "Task Updated",
        description: "The task has been updated successfully"
      });
    }
  };

  const handleDeleteTask = () => {
    if (selectedTask) {
      const updatedTasks = tasks.filter(task => task.id !== selectedTask.id);
      setTasks(updatedTasks);
      setSelectedTask(null);
      setIsEditModalOpen(false);
      toast({
        title: "Task Deleted",
        description: "The task has been removed from your planner"
      });
    }
  };

  const handleTaskCompletion = (id: string, completed: boolean) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, completed: completed } : task
    );
    setTasks(updatedTasks);
  };

  const eventStyleGetter = (event: Task) => {
    const backgroundColor = event.completed ? '#d3d3d3' : '#3182CE';
    const style = {
      backgroundColor: backgroundColor,
      borderRadius: '5px',
      opacity: 0.8,
      color: 'white',
      border: '0px',
      display: 'block'
    };
    return {
      style: style
    };
  };

  return (
    <div className="container mx-auto py-6 animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Daily Planner</h1>
          <p className="text-muted-foreground mt-1">Organize your day for maximum productivity</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
              <DialogDescription>
                Create a new task to add to your planner.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input type="text" id="title" name="title" value={newTask.title} onChange={handleInputChange} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="subject" className="text-right">
                  Subject
                </Label>
                <Input type="text" id="subject" name="subject" value={newTask.subject} onChange={handleInputChange} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="start" className="text-right">
                  Start Date
                </Label>
                <Input
                  type="datetime-local"
                  id="start"
                  name="start"
                  value={format(newTask.start, "yyyy-MM-dd'T'HH:mm")}
                  onChange={(e) => handleDateChange(new Date(e.target.value), 'start')}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="end" className="text-right">
                  End Date
                </Label>
                <Input
                  type="datetime-local"
                  id="end"
                  name="end"
                  value={format(newTask.end, "yyyy-MM-dd'T'HH:mm")}
                  onChange={(e) => handleDateChange(new Date(e.target.value), 'end')}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="description" className="text-right mt-2">
                  Description
                </Label>
                <Textarea id="description" name="description" value={newTask.description} onChange={handleInputChange} className="col-span-3" />
              </div>
            </div>
            <Button type="submit" onClick={handleTaskSubmit}>Add Task</Button>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="h-[600px]">
        <CardHeader>
          <CardTitle>Calendar</CardTitle>
          <CardDescription>View and manage your tasks in a calendar format</CardDescription>
        </CardHeader>
        <CardContent className="overflow-auto">
          <Calendar
            localizer={localizer}
            events={tasks}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500, width: '100%' }}
            onSelectEvent={handleTaskClick}
            eventPropGetter={eventStyleGetter}
          />
        </CardContent>
      </Card>

      {selectedTask && (
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogTrigger asChild>
            <Button variant="secondary" className="mt-4">
              <Pencil className="mr-2 h-4 w-4" />
              Edit Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
              <DialogDescription>
                Edit the details of the selected task.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input
                  type="text"
                  id="title"
                  defaultValue={selectedTask.title}
                  className="col-span-3"
                  onChange={(e) => setSelectedTask({ ...selectedTask, title: e.target.value } as Task)}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="subject" className="text-right">
                  Subject
                </Label>
                <Input
                  type="text"
                  id="subject"
                  defaultValue={selectedTask.subject}
                  className="col-span-3"
                  onChange={(e) => setSelectedTask({ ...selectedTask, subject: e.target.value } as Task)}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="start" className="text-right">
                  Start Date
                </Label>
                <Input
                  type="datetime-local"
                  id="start"
                  defaultValue={format(selectedTask.start, "yyyy-MM-dd'T'HH:mm")}
                  className="col-span-3"
                  onChange={(e) => {
                    const newDate = new Date(e.target.value);
                    setSelectedTask({ ...selectedTask, start: newDate } as Task);
                  }}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="end" className="text-right">
                  End Date
                </Label>
                <Input
                  type="datetime-local"
                  id="end"
                  defaultValue={format(selectedTask.end, "yyyy-MM-dd'T'HH:mm")}
                  className="col-span-3"
                  onChange={(e) => {
                    const newDate = new Date(e.target.value);
                    setSelectedTask({ ...selectedTask, end: newDate } as Task);
                  }}
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="description" className="text-right mt-2">
                  Description
                </Label>
                <Textarea
                  id="description"
                  defaultValue={selectedTask.description}
                  className="col-span-3"
                  onChange={(e) => setSelectedTask({ ...selectedTask, description: e.target.value } as Task)}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="completed" className="text-right">
                  Completed
                </Label>
                <Checkbox
                  id="completed"
                  defaultChecked={selectedTask.completed}
                  onCheckedChange={(checked) => setSelectedTask({ ...selectedTask, completed: checked } as Task)}
                />
              </div>
            </div>
            <Button type="submit" onClick={handleEditTask}>
              Update Task
            </Button>
            <Button variant="destructive" className="mt-2" onClick={handleDeleteTask}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Task
            </Button>
            <Button variant="ghost" className="mt-2" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Planner;
