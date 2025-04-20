
import React, { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { CalendarCheck2, Plus, Check, ChevronsUpDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { motion } from 'framer-motion';

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: Date | undefined;
  subject: string;
  priority: 'High' | 'Medium' | 'Low';
  completed: boolean;
}

const subjects = [
  "Mathematics",
  "Science",
  "History",
  "English",
  "Computer Science",
  "Physics",
  "Chemistry",
  "Biology",
  "Economics",
  "Geography",
  "Art",
  "Music",
  "Physical Education",
  "Foreign Language",
];

const priorities = ["High", "Medium", "Low"] as const;
type Priority = typeof priorities[number];

const Planner = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [subject, setSubject] = useState(subjects[0]);
  const [priority, setPriority] = useState<Priority>(priorities[0]);
  const [isCompletedFilter, setIsCompletedFilter] = useState(false);
  const [subjectFilter, setSubjectFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [dateFilter, setDateFilter] = useState<Date | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const createTask = () => {
    if (!title || !dueDate || !subject || !priority) {
      toast({
        title: "Missing fields",
        description: "Please fill in all fields.",
      });
      return;
    }

    const newTask: Task = {
      id: Math.random().toString(36).substring(2, 9),
      title,
      description,
      dueDate,
      subject,
      priority,
      completed: false,
    };

    setTasks([...tasks, newTask]);
    setOpen(false);
    setTitle('');
    setDescription('');
    setDueDate(undefined);
    setSubject(subjects[0]);
    setPriority(priorities[0]);
    toast({
      title: "Task created",
      description: "Your task has been created",
    });
  };

  const editTask = () => {
    if (!selectedTask) return;

    const updatedTask = {
      ...selectedTask,
      title,
      description,
      dueDate,
      subject,
      priority,
    };

    setTasks(tasks.map(task => task.id === selectedTask.id ? updatedTask : task));
    setEditOpen(false);
    setSelectedTask(null);
    setTitle('');
    setDescription('');
    setDueDate(undefined);
    setSubject(subjects[0]);
    setPriority(priorities[0]);
    toast({
      title: "Task updated",
      description: "Your task has been updated",
    });
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
    toast({
      title: "Task deleted",
      description: "Your task has been deleted",
    });
  };

  const toggleComplete = (id: string) => {
    setTasks(
      tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const clearFilters = () => {
    setIsCompletedFilter(false);
    setSubjectFilter('');
    setPriorityFilter('');
    setDateFilter(null);
  };

  const filteredTasks = tasks.filter(task => {
    if (isCompletedFilter && !task.completed) {
      return false;
    }
    if (subjectFilter && task.subject !== subjectFilter) {
      return false;
    }
    if (priorityFilter && task.priority !== priorityFilter) {
      return false;
    }
    if (dateFilter && (!task.dueDate || task.dueDate.toDateString() !== dateFilter.toDateString())) {
      return false;
    }
    return true;
  });

  const calculateProgress = () => {
    if (tasks.length === 0) return 0;
    const completedTasks = tasks.filter(task => task.completed).length;
    return (completedTasks / tasks.length) * 100;
  };

  return (
    <motion.div
      className="container mx-auto space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-1 bg-primary rounded-full animate-pulse-subtle"></div>
          <h1 className="text-3xl font-bold gradient-heading">Daily Planner</h1>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>

      <p className="text-muted-foreground">
        Organize your day, manage tasks, and boost your productivity.
      </p>

      <Card className="glass-card">
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <div className="space-y-2">
              <Label>Completed Tasks</Label>
              <Button
                variant="outline"
                className="w-full justify-start text-sm"
                onClick={() => setIsCompletedFilter(!isCompletedFilter)}
              >
                <Check className="mr-2 h-4 w-4" />
                {isCompletedFilter ? 'Hide Completed' : 'Show Completed'}
              </Button>
            </div>

            <div className="space-y-2">
              <Label>Subject</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !subjectFilter && "text-muted-foreground"
                    )}
                  >
                    {subjectFilter
                      ? subjects.find((s) => s === subjectFilter)
                      : "Select subject"}
                    <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Search subject..." />
                    <CommandList>
                      <CommandEmpty>No subject found.</CommandEmpty>
                      <CommandGroup>
                        {subjects.map((subject) => (
                          <CommandItem
                            value={subject}
                            key={subject}
                            onSelect={() => {
                              setSubjectFilter(subject === subjectFilter ? "" : subject)
                            }}
                          >
                            {subject}
                            <Check
                              className={cn(
                                "ml-auto h-4 w-4",
                                subjectFilter === subject ? "opacity-100" : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                      <CommandSeparator />
                      <CommandItem onSelect={() => setSubjectFilter("")}>
                        Clear
                      </CommandItem>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map(priority => (
                    <SelectItem key={priority} value={priority}>
                      {priority}
                    </SelectItem>
                  ))}
                  <SelectItem value="">Clear</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateFilter && "text-muted-foreground"
                    )}
                  >
                    {dateFilter ? (
                      <span>{dateFilter?.toLocaleDateString()}</span>
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarCheck2 className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start" side="bottom">
                  <Calendar
                    mode="single"
                    selected={dateFilter}
                    onSelect={setDateFilter}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <Button variant="link" onClick={clearFilters} className="mt-4">
            Clear All Filters
          </Button>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Progress Overview</CardTitle>
          <CardDescription>
            Track your task completion rate.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center justify-between">
            <span>Tasks Completed</span>
            <span className="text-sm text-muted-foreground">
              {tasks.filter(task => task.completed).length} / {tasks.length}
            </span>
          </div>
          <Progress value={calculateProgress()} />
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredTasks.length > 0 ? (
          filteredTasks.map(task => (
            <Card key={task.id} className="card-hover">
              <CardContent className="space-y-2">
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-semibold">{task.title}</h3>
                  <Badge variant="secondary">
                    {task.completed ? "Completed" : task.priority}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{task.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Due: {task.dueDate?.toLocaleDateString()}
                  </span>
                  <div className="flex gap-2">
                    <Button size="icon" variant="outline" onClick={() => {
                      setSelectedTask(task);
                      setTitle(task.title);
                      setDescription(task.description);
                      setDueDate(task.dueDate);
                      setSubject(task.subject);
                      setPriority(task.priority);
                      setEditOpen(true);
                    }}>
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
                        className="h-4 w-4"
                      >
                        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                      </svg>
                    </Button>
                    <Button size="icon" variant="destructive" onClick={() => deleteTask(task.id)}>
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
                        className="h-4 w-4"
                      >
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        <line x1="10" x2="10" y1="11" y2="17" />
                        <line x1="14" x2="14" y1="11" y2="17" />
                      </svg>
                    </Button>
                    <Button size="icon" variant="secondary" onClick={() => toggleComplete(task.id)}>
                      <Check className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center">
            <p className="text-muted-foreground">No tasks found.</p>
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
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
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dueDate" className="text-right">
                Due Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !dueDate && "text-muted-foreground"
                    )}
                  >
                    {dueDate ? (
                      <span>{dueDate?.toLocaleDateString()}</span>
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarCheck2 className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start" side="bottom">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={setDueDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="subject" className="text-right">
                Subject
              </Label>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map(subject => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="priority" className="text-right">
                Priority
              </Label>
              <Select value={priority} onValueChange={(value: Priority) => setPriority(value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map(priority => (
                    <SelectItem key={priority} value={priority}>
                      {priority}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={createTask}>
              Create Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>
              Edit the details of your task.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dueDate" className="text-right">
                Due Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !dueDate && "text-muted-foreground"
                    )}
                  >
                    {dueDate ? (
                      <span>{dueDate?.toLocaleDateString()}</span>
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarCheck2 className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start" side="bottom">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={setDueDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="subject" className="text-right">
                Subject
              </Label>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map(subject => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="priority" className="text-right">
                Priority
              </Label>
              <Select value={priority} onValueChange={(value: Priority) => setPriority(value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map(priority => (
                    <SelectItem key={priority} value={priority}>
                      {priority}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={editTask}>
              Edit Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default Planner;
