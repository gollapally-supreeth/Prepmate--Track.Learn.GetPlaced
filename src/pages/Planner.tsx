import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlannerTaskCard } from '@/components/PlannerTaskCard';
import { Search, PlusCircle, Filter, Calendar, Clock, Tag, AlertCircle, GripVertical } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useTaskStore } from '@/contexts/TaskStoreContext';
import { nanoid } from 'nanoid';

interface Task {
  id: string;
  title: string;
  description: string;
  dueTime: string;
  subject: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'todo' | 'in-progress' | 'completed';
  completed?: boolean;
  inPlanner: boolean;
  inFocus: boolean;
}

interface NewTask extends Partial<Task> {
  title: string;
  description: string;
  dueTime: string;
}

// Sample task data
const sampleTasks = [
  {
    id: nanoid(),
    title: "Revise Graphs in DSA",
    dueTime: "Today, 8:00 PM",
    subject: "CSE",
    priority: "High" as const,
    status: "todo",
    description: "Prepare for DSA assignment",
    inPlanner: true,
    inFocus: false,
  },
  {
    id: nanoid(),
    title: "Complete Web Dev Assignment",
    dueTime: "Today, 5:00 PM",
    subject: "Web Dev",
    priority: "Medium" as const,
    status: "todo",
    description: "Complete web dev assignment",
    inPlanner: true,
    inFocus: false,
  },
  {
    id: nanoid(),
    title: "Study SQL Joins",
    dueTime: "Tomorrow, 12:00 PM",
    subject: "DBMS",
    priority: "Medium" as const,
    status: "in-progress",
    description: "Study for sql joins",
    inPlanner: true,
    inFocus: false,
  },
  {
    id: nanoid(),
    title: "Research for OS Project",
    dueTime: "Today, 3:00 PM",
    subject: "Operating Systems",
    priority: "Low" as const,
    status: "in-progress",
    description: "Do some research for OS project",
    inPlanner: true,
    inFocus: false,
  },
  {
    id: nanoid(),
    title: "Practice Python Problems",
    dueTime: "Yesterday, 6:00 PM",
    subject: "Programming",
    priority: "Medium" as const,
    status: "completed",
    description: "Complete some python problems",
    completed: true,
    inPlanner: true,
    inFocus: false,
  },
  {
    id: nanoid(),
    title: "Read Chapter 3 of Computer Networks",
    dueTime: "Yesterday, 7:00 PM",
    subject: "Networks",
    priority: "High" as const,
    status: "completed",
    description: "complete reading of CN chapter 3",
    completed: true,
    inPlanner: true,
    inFocus: false,
  },
];

const Planner = () => {
  const { toast } = useToast();
  const { tasks, addTask, editTask, deleteTask, completeTask } = useTaskStore();
  const [showTutorial, setShowTutorial] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('plannerTutorialSeen') !== 'true';
    }
    return true;
  });

  useEffect(() => {
    if (showTutorial) {
      localStorage.setItem('plannerTutorialSeen', 'true');
    }
  }, [showTutorial]);
  
  const [newTask, setNewTask] = useState<NewTask>({ title: '', description: '', dueTime: '' });
  
  const handleAddTask = () => {
    if (newTask.title && newTask.description && newTask.dueTime && newTask.subject && newTask.priority) {
      const fullNewTask = {
        id: nanoid(),
        title: newTask.title,
        description: newTask.description,
        dueTime: newTask.dueTime,
        subject: newTask.subject,
        priority: newTask.priority,
        status: 'todo',
        completed: false,
        inPlanner: true,
        inFocus: false,
      };
      addTask(fullNewTask);
      setNewTask({ title: '', description: '', dueTime: '' });
      toast({ description: "Task created successfully!" });
    }
  };

  const handleCompleteTask = (id: string) => {
    completeTask(id);
    toast({ description: "Task completed!" });
  };

  const handleMoveToInProgress = (id: string) => {
    editTask(id, { status: 'in-progress' });
  };

  const handleRemoveTask = (id: string) => {
    deleteTask(id);
  };

  const handleEditTask = (id: string, updatedTask: Partial<Task>) => {
    editTask(id, updatedTask);
  };

  const handleStatusChange = (id: string, newStatus: Task['status']) => {
    editTask(id, { status: newStatus });
  };

  const [filter, setFilter] = useState("all");
  const [subject, setSubject] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTasks = tasks.filter((task) => {
    if (!task.inPlanner) return false;
    if (filter !== "all" && task.status !== filter) return false;
    if (subject !== "all" && task.subject !== subject) return false;
    return true;
  });

  const todoTasks = filteredTasks.filter(task => task.status === "todo");
  const inProgressTasks = filteredTasks.filter(task => task.status === "in-progress");
  const completedTasks = filteredTasks.filter(task => task.status === "completed");
  const taskTitleRef = useRef<HTMLInputElement>(null);

  const handleDragEnd = (status: Task['status'], items: Task[]) => {
    items.forEach((item, idx) => {
      editTask(item.id, { status, order: idx });
    });
  };

  // Local UI state for targeting tasks
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);

  return (
    <div className="space-y-6 animate-fade-in">
      <Dialog open={showTutorial} onOpenChange={setShowTutorial}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Welcome to Daily Planner!</DialogTitle>
            <DialogDescription>
              New features have been added to help you manage tasks more efficiently:
              <div>
                <ul className="mt-2 space-y-2">
                  <li className="flex items-center gap-2">
                    <GripVertical className="h-4 w-4 text-primary" />
                    Drag and drop tasks between columns
                  </li>
                  <li className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-primary" />
                    Color-coded priorities and subjects
                  </li>
                  <li className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    Real-time status updates
                  </li>
                </ul>
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button onClick={() => setShowTutorial(false)}>Got it!</Button>
          </div>
        </DialogContent>
      </Dialog>

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-primary">Daily Planner</h1>
          <p className="text-muted-foreground mt-1">Organize your tasks efficiently</p>
        </div>

        <Card className="bg-card">
          <CardContent className="pt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="Task title"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Task description"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dueTime">Due Time</Label>
                <Input
                  id="dueTime"
                  value={newTask.dueTime}
                  onChange={(e) => setNewTask({ ...newTask, dueTime: e.target.value })}
                  placeholder="e.g. Today, 3:00 PM"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="subject">Subject</Label>
                <Select
                  value={newTask.subject}
                  onValueChange={(value) => setNewTask({ ...newTask, subject: value })}
                >
                  <SelectTrigger id="subject">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CSE">CSE</SelectItem>
                    <SelectItem value="Web Dev">Web Dev</SelectItem>
                    <SelectItem value="DBMS">DBMS</SelectItem>
                    <SelectItem value="Operating Systems">Operating Systems</SelectItem>
                    <SelectItem value="Programming">Programming</SelectItem>
                    <SelectItem value="Networks">Networks</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={newTask.priority}
                  onValueChange={(value) => setNewTask({ ...newTask, priority: value as 'High' | 'Medium' | 'Low' })}
                >
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button onClick={handleAddTask} className="w-full">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Add Task
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

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
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-card border-muted">
            <CardHeader className="pb-3">
              <CardTitle className="text-primary flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary/70"></div>
                To Do
                <span className="ml-auto text-sm text-muted-foreground">
                  {todoTasks.length}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Reorder.Group
                axis="y"
                values={todoTasks}
                onReorder={(items: Task[]) => handleDragEnd('todo', items)}
                className="space-y-3"
                as={undefined}
              >
                <AnimatePresence>
                  {todoTasks.map((task) => (
                    <Reorder.Item key={task.id} value={task} as={undefined}>
                      <PlannerTaskCard
                        {...task}
                        completed={task.status === 'completed'}
                        onComplete={handleCompleteTask}
                        onMoveToInProgress={handleMoveToInProgress}
                        onRemove={handleRemoveTask}
                        expanded={expandedTaskId === task.id}
                        onExpand={() => setExpandedTaskId(expandedTaskId === task.id ? null : task.id)}
                        editing={editingTaskId === task.id}
                        onEdit={() => setEditingTaskId(task.id)}
                        current={currentTaskId === task.id}
                        onSetCurrent={() => setCurrentTaskId(currentTaskId === task.id ? null : task.id)}
                      />
                    </Reorder.Item>
                  ))}
                </AnimatePresence>
              </Reorder.Group>
            </CardContent>
          </Card>

          <Card className="bg-card border-muted">
            <CardHeader className="pb-3">
              <CardTitle className="text-primary flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary/70"></div>
                In Progress
                <span className="ml-auto text-sm text-muted-foreground">
                  {inProgressTasks.length}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Reorder.Group
                axis="y"
                values={inProgressTasks}
                onReorder={(items: Task[]) => handleDragEnd('in-progress', items)}
                className="space-y-3"
                as={undefined}
              >
                <AnimatePresence>
                  {inProgressTasks.map((task) => (
                    <Reorder.Item key={task.id} value={task} as={undefined}>
                      <PlannerTaskCard
                        {...task}
                        completed={task.status === 'completed'}
                        onComplete={handleCompleteTask}
                        onMoveToInProgress={handleMoveToInProgress}
                        onRemove={handleRemoveTask}
                        expanded={expandedTaskId === task.id}
                        onExpand={() => setExpandedTaskId(expandedTaskId === task.id ? null : task.id)}
                        editing={editingTaskId === task.id}
                        onEdit={() => setEditingTaskId(task.id)}
                        current={currentTaskId === task.id}
                        onSetCurrent={() => setCurrentTaskId(currentTaskId === task.id ? null : task.id)}
                      />
                    </Reorder.Item>
                  ))}
                </AnimatePresence>
              </Reorder.Group>
            </CardContent>
          </Card>

          <Card className="bg-card border-muted">
            <CardHeader className="pb-3">
              <CardTitle className="text-primary flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary/70"></div>
                Completed
                <span className="ml-auto text-sm text-muted-foreground">
                  {completedTasks.length}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Reorder.Group
                axis="y"
                values={completedTasks}
                onReorder={(items: Task[]) => handleDragEnd('completed', items)}
                className="space-y-3"
                as={undefined}
              >
                <AnimatePresence>
                  {completedTasks.map((task) => (
                    <Reorder.Item key={task.id} value={task} as={undefined}>
                      <PlannerTaskCard
                        {...task}
                        completed={task.status === 'completed'}
                        onComplete={handleCompleteTask}
                        onMoveToInProgress={handleMoveToInProgress}
                        onRemove={handleRemoveTask}
                        expanded={expandedTaskId === task.id}
                        onExpand={() => setExpandedTaskId(expandedTaskId === task.id ? null : task.id)}
                        editing={editingTaskId === task.id}
                        onEdit={() => setEditingTaskId(task.id)}
                        current={currentTaskId === task.id}
                        onSetCurrent={() => setCurrentTaskId(currentTaskId === task.id ? null : task.id)}
                      />
                    </Reorder.Item>
                  ))}
                </AnimatePresence>
              </Reorder.Group>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

export default Planner;