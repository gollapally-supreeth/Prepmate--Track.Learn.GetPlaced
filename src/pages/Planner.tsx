import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlannerTaskCard } from '@/components/PlannerTaskCard';
import { Search, PlusCircle, Filter, Calendar, Clock, Tag, AlertCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';

interface Task {
  id: number;
  title: string;
  description: string;
  dueTime: string;
  subject: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'todo' | 'in-progress' | 'completed';
  
  completed?: boolean;
}

interface NewTask extends Partial<Task> {
  title: string;
  description: string;
  dueTime: string;
}

// Sample task data
const sampleTasks = [
  {
    id: 1,
    title: "Revise Graphs in DSA",
    dueTime: "Today, 8:00 PM",
    subject: "CSE",
    priority: "High" as const,
    status: "todo",
    description: "Prepare for DSA assignment",
  },
  {
    id: 2,
    title: "Complete Web Dev Assignment",
    dueTime: "Today, 5:00 PM",
    subject: "Web Dev",
    priority: "Medium" as const,
    status: "todo",
    description: "Complete web dev assignment",
  },
  {
    id: 3,
    title: "Study SQL Joins",
    dueTime: "Tomorrow, 12:00 PM",
    subject: "DBMS",
    priority: "Medium" as const,
    status: "in-progress",
    description: "Study for sql joins",
  },
  {
    id: 4,
    title: "Research for OS Project",
    dueTime: "Today, 3:00 PM",
    subject: "Operating Systems",
    priority: "Low" as const,
    status: "in-progress",
    description: "Do some research for OS project",
  },
  {
    id: 5,
    title: "Practice Python Problems",
    dueTime: "Yesterday, 6:00 PM",
    subject: "Programming",
    priority: "Medium" as const,
    status: "completed" ,
    description: "Complete some python problems",
    completed: true
    
  },
  {
    id: 6,
    title: "Read Chapter 3 of Computer Networks",
    dueTime: "Yesterday, 7:00 PM",
    subject: "Networks",
     priority: "High" as const,
     status: "completed",
     description: "complete reading of CN chapter 3",
    completed: true
  },
];

const Planner = () => {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>(() => {
    if (typeof window !== 'undefined') {
      const storedTasks = localStorage.getItem('plannerTasks');
      return storedTasks ? JSON.parse(storedTasks) : sampleTasks;
    }
    return sampleTasks;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('plannerTasks', JSON.stringify(tasks));
    }
  }, [tasks]);
  
  const [newTask, setNewTask] = useState<NewTask>({ title: '', description: '', dueTime: '' });
  
  const handleAddTask = () => {
    if (newTask.title && newTask.description && newTask.dueTime && newTask.subject && newTask.priority ) {
      const nextId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
      const fullNewTask: Task = { id: nextId, status: "todo", completed: false, ...newTask } as Task;
      setTasks([...tasks, fullNewTask]);
      setNewTask({ title: '', description: '', dueTime: '' });
      toast({ description: "Task created successfully!", position: "bottom-center" });
    }
  };

  const handleCompleteTask = (id: number) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        return { ...task, status: 'completed', completed: true };
      }
      return task;
    }));
    toast({ description: "Task completed!", position: "bottom-center" });
  };

  const handleMoveToInProgress = (id: number) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        return { ...task, status: 'in-progress' };
      }
      return task;
    }));
  };

  const handleRemoveTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleEditTask = (id: number, updatedTask: Partial<Task>) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, ...updatedTask } : task));
  };

  const handleStatusChange = (id: number, newStatus: Task['status']) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, status: newStatus } : task));
  };


   const [filter, setFilter] = useState("all");
    const [subject, setSubject] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");

  const filteredTasks = tasks.filter((task) => {
    
     if (filter !== "all" && task.status !== filter) return false;
    if (subject !== "all" && task.subject !== subject) return false;
    return true;
  });
  

  
  const todoTasks = filteredTasks.filter(task => task.status === "todo");
  const inProgressTasks = filteredTasks.filter(task => task.status === "in-progress");
  const completedTasks = filteredTasks.filter(task => task.status === "completed");
  const taskTitleRef = useRef<HTMLInputElement>(null);
  
  return (
    <div className="space-y-6 animate-fade-in">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold gradient-heading">Daily Planner</h1>
        <p className="text-muted-foreground mt-1">Organize your tasks efficiently</p>
      </motion.div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder="Search tasks..."
            className="pl-10 bg-card border-primary/10 focus:border-primary/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-3">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[150px] border-primary/10">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={subject} onValueChange={setSubject}>
            <SelectTrigger className="w-[150px] border-primary/10">
              <SelectValue placeholder="Subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              <SelectItem value="CSE">CSE</SelectItem>
              <SelectItem value="Web Dev">Web Dev</SelectItem>
              <SelectItem value="DBMS">DBMS</SelectItem>
              <SelectItem value="Operating Systems">Operating Systems</SelectItem>
              <SelectItem value="Programming">Programming</SelectItem>
              <SelectItem value="Networks">Networks</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 bg-card/50 p-6 rounded-lg border border-primary/5">
        <motion.div 
          className="space-y-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Label htmlFor="taskTitle" className="text-sm font-medium">Title</Label>
          <Input
            id="taskTitle"
            className="border-primary/10 focus:border-primary/20"
            placeholder="Enter task title"
            ref={taskTitleRef}
            value={newTask.title || ''}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          />
        </motion.div>
        
        <motion.div 
          className="space-y-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
        >
          <Label htmlFor="taskDescription" className="text-sm font-medium">Description</Label>
          <Input
            id="taskDescription"
            className="border-primary/10 focus:border-primary/20"
            placeholder="Enter task description"
            value={newTask.description || ''}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          />
        </motion.div>
        
        <motion.div 
          className="space-y-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Label htmlFor="taskDueTime" className="text-sm font-medium">Due Time</Label>
          <Input
            id="taskDueTime"
            className="border-primary/10 focus:border-primary/20"
            placeholder="e.g., Today, 4:00 PM"
            value={newTask.dueTime || ''}
            onChange={(e) => setNewTask({ ...newTask, dueTime: e.target.value })}
          />
        </motion.div>
        <motion.div 
          className="space-y-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.25 }}
        >
          <Label htmlFor="taskSubject" className="text-sm font-medium">Subject</Label>
          <Input
            id="taskSubject"
            className="border-primary/10 focus:border-primary/20"
            placeholder="e.g., CSE"
            value={newTask.subject || ''}
            onChange={(e) => setNewTask({ ...newTask, subject: e.target.value })}
          />
        </motion.div>
        <motion.div 
          className="space-y-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Label htmlFor="priority" className="text-sm font-medium">Priority</Label>
          <Select onValueChange={(value) => setNewTask({ ...newTask, priority: value as "High" | "Medium" | "Low" })} defaultValue={"High"}>
            <SelectTrigger id="priority" className="border-primary/10">
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent className='text-sm'>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>
        
        <motion.div 
          className="space-y-1 flex items-end"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Button 
            size="sm" 
            className="w-full bg-primary/90 hover:bg-primary" 
            onClick={handleAddTask}
          >
            Add Task
          </Button>
        </motion.div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="overflow-hidden border-primary/10">
          <div className="bg-primary/5 p-3 border-b border-primary/10">
            <div className="flex items-center justify-between">
              <h3 className="font-medium flex items-center gap-2 text-primary">
                <AlertCircle size={16} className="text-focus-red" />
                <span>To Do</span>
                <span className="bg-focus-red/10 text-focus-red px-1.5 rounded-full text-xs">
                  {todoTasks.length}
                </span>
              </h3>
            </div>
          </div>
          <CardContent className="p-3 space-y-3 h-[calc(100vh-340px)] overflow-y-auto custom-scrollbar">
            {todoTasks
            .filter((task) => {
              const lowerCaseSearchTerm = searchTerm.toLowerCase();
              return (
                task.title.toLowerCase().includes(lowerCaseSearchTerm) 
              );
            })
            .map(task => (
              <div className='flex flex-col'>
                <PlannerTaskCard
                  key={task.id}
                  
                  subject={task.subject}
                  priority={task.priority}
                  completed={task.completed}
                  title={task.title}
                  dueTime={task.dueTime}
                  description={task.description}
                  subject={task.subject}
                  priority={task.priority}
                  completed={task.completed}
                  onComplete={handleCompleteTask}
                  id={task.id}
                  subject={task.subject}
                  priority={task.priority}
                  completed={task.completed}
                  onComplete={handleCompleteTask}
                  description={task.description}
                  id={task.id}
                  onMoveToInProgress={handleMoveToInProgress}
                  onRemove={handleRemoveTask}
                  />
              </div>
            ))}
            {todoTasks.length === 0 && (
              <div className="flex flex-col items-center justify-center h-32 text-center" >
                <p className="text-muted-foreground text-sm">No tasks found. Create a new task?</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2"
                 
                    
                    onClick={() => taskTitleRef.current?.focus()}
                  >
                New Task
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden border-primary/10">
          <div className="bg-primary/5 p-3 border-b border-primary/10">
            <div className="flex items-center justify-between">
              <h3 className="font-medium flex items-center gap-2 text-primary">
                <Clock size={16} className="text-focus-yellow" />
                <span>In Progress</span>
                <span className="bg-focus-yellow/10 text-focus-yellow px-1.5 rounded-full text-xs">
                  {inProgressTasks.length}
                </span>
              </h3>
            </div>
          </div>
          <CardContent className="p-3 space-y-3 h-[calc(100vh-340px)] overflow-y-auto custom-scrollbar">
            {inProgressTasks.map(task => (
              <div className='flex flex-col'>
                <PlannerTaskCard
                  key={task.id}
                  title={task.title}
                  dueTime={task.dueTime}
                  description={task.description}
                  subject={task.subject}
                  priority={task.priority}
                  completed={task.completed}
                  onComplete={handleCompleteTask}
                  description={task.description}
                  id={task.id}
                  onMoveToInProgress={handleMoveToInProgress}
                  onRemove={handleRemoveTask}
                  />
              </div>
            ))}
            {inProgressTasks.length === 0 && (
              <div className="flex flex-col items-center justify-center h-32 text-center">
                <p className="text-muted-foreground text-sm">No tasks in progress</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden border-primary/10">
          <div className="bg-primary/5 p-3 border-b border-primary/10">
            <div className="flex items-center justify-between">
              <h3 className="font-medium flex items-center gap-2 text-primary">
                <Calendar size={16} className="text-focus-green" />
                <span>Completed</span>
                <span className="bg-focus-green/10 text-focus-green px-1.5 rounded-full text-xs">
                  {completedTasks.length}
                </span>
              </h3>
            </div>
          </div>
          <CardContent className="p-3 space-y-3 h-[calc(100vh-340px)] overflow-y-auto custom-scrollbar">
            {completedTasks.map(task => (
              <div className='flex flex-col'>
                <PlannerTaskCard
                  key={task.id}
                  title={task.title}
                  dueTime={task.dueTime}
                  description={task.description}
                  subject={task.subject}
                  priority={task.priority}
                  completed={task.completed}
                  onComplete={handleCompleteTask}
                  description={task.description}
                  id={task.id}
                  onMoveToInProgress={handleMoveToInProgress}
                  onRemove={handleRemoveTask}
                  />
              </div>
            ))}
            {completedTasks.length === 0 && (
              <div className="flex flex-col items-center justify-center h-32 text-center">
                <p className="text-muted-foreground text-sm">No completed tasks</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Planner;
