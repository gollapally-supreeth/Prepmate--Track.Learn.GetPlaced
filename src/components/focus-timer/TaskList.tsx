
import React, { useState } from 'react';
import { useFocusTimer, FocusTask, TaskPriority } from './FocusTimerContext';
import { 
  CheckCircle2,
  Circle,
  Pencil,
  Trash2,
  Clock,
  PlusCircle,
  AlarmClock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface TaskListProps {
  className?: string;
  compact?: boolean;
}

export function TaskList({ className, compact = false }: TaskListProps) {
  const { 
    state, 
    addTask, 
    editTask, 
    completeTask, 
    deleteTask, 
    setCurrentTask, 
    formatTime 
  } = useFocusTimer();
  
  const { tasks, currentTask } = state;
  
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isEditingTask, setIsEditingTask] = useState<string | null>(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as TaskPriority,
  });
  
  const [editingTask, setEditingTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as TaskPriority,
  });
  
  // Reset form values
  const resetForm = () => {
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
    });
    setEditingTask({
      title: '',
      description: '',
      priority: 'medium',
    });
  };
  
  // Handle form submission for adding a new task
  const handleAddTask = () => {
    if (!newTask.title.trim()) return;
    
    addTask({
      title: newTask.title.trim(),
      description: newTask.description.trim(),
      priority: newTask.priority,
    });
    
    resetForm();
    setIsAddingTask(false);
  };
  
  // Handle form submission for editing a task
  const handleEditTask = () => {
    if (!isEditingTask || !editingTask.title.trim()) return;
    
    editTask(isEditingTask, {
      title: editingTask.title.trim(),
      description: editingTask.description.trim(),
      priority: editingTask.priority,
    });
    
    setIsEditingTask(null);
    resetForm();
  };
  
  // Start editing a task
  const startEditingTask = (task: FocusTask) => {
    setEditingTask({
      title: task.title,
      description: task.description,
      priority: task.priority,
    });
    setIsEditingTask(task.id);
  };
  
  // Get priority color
  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case 'high':
        return 'bg-focus-red/10 text-focus-red border-focus-red/20';
      case 'medium':
        return 'bg-focus-yellow/10 text-focus-yellow border-focus-yellow/20';
      case 'low':
        return 'bg-focus-green/10 text-focus-green border-focus-green/20';
      default:
        return 'bg-secondary text-muted-foreground';
    }
  };
  
  const getPriorityName = (priority: TaskPriority) => {
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  };
  
  if (compact) {
    return (
      <div className={cn("p-2", className)}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium">Current Tasks</h3>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setIsAddingTask(true)}
          >
            <PlusCircle className="h-4 w-4" />
          </Button>
        </div>
        
        {tasks.length === 0 ? (
          <p className="text-xs text-muted-foreground">No tasks yet. Add one to get started!</p>
        ) : (
          <ul className="space-y-1">
            {tasks.filter(task => !task.completed).slice(0, 3).map(task => (
              <li
                key={task.id}
                className={cn(
                  "flex items-center text-xs p-1 rounded-md cursor-pointer",
                  task.id === currentTask?.id ? "bg-primary/5 border border-primary/20" : ""
                )}
                onClick={() => setCurrentTask(task.id === currentTask?.id ? null : task.id)}
              >
                <div className="flex-1 truncate">{task.title}</div>
                <div className={cn(
                  "px-1 rounded text-xs",
                  getPriorityColor(task.priority)
                )}>
                  {getPriorityName(task.priority).charAt(0)}
                </div>
              </li>
            ))}
            {tasks.filter(task => !task.completed).length > 3 && (
              <li className="text-xs text-center text-muted-foreground">
                +{tasks.filter(task => !task.completed).length - 3} more tasks
              </li>
            )}
          </ul>
        )}
        
        <Dialog open={isAddingTask} onOpenChange={setIsAddingTask}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
              <DialogDescription>
                Create a new task for your focus session.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <Input
                placeholder="Task title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="col-span-12"
              />
              
              <Textarea
                placeholder="Task description (optional)"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                className="col-span-12"
              />
              
              <Select
                value={newTask.priority}
                onValueChange={(value) => setNewTask({ ...newTask, priority: value as TaskPriority })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="low">Low Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddingTask(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddTask}>Add Task</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
  
  return (
    <div className={cn("p-4", className)}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Focus Tasks</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsAddingTask(true)}
          className="flex items-center gap-1"
        >
          <PlusCircle className="h-4 w-4" />
          <span>New Task</span>
        </Button>
      </div>
      
      {tasks.length === 0 ? (
        <div className="text-center p-8 border border-dashed border-muted rounded-lg">
          <h3 className="text-muted-foreground mb-2">No tasks added yet</h3>
          <p className="text-sm text-muted-foreground mb-4">Add tasks to track during your focus sessions</p>
          <Button
            variant="outline"
            onClick={() => setIsAddingTask(true)}
            className="flex items-center gap-1"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Add Your First Task</span>
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.filter(task => !task.completed).map(task => (
            <Card
              key={task.id}
              className={cn(
                "p-3 transition-all duration-200 hover:shadow-md",
                task.id === currentTask?.id 
                  ? "border-primary/50 shadow-sm bg-primary/5" 
                  : "hover:border-primary/20"
              )}
            >
              <div className="flex items-start gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 rounded-full"
                  onClick={() => completeTask(task.id)}
                >
                  {task.completed ? 
                    <CheckCircle2 className="h-5 w-5 text-primary" /> : 
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  }
                </Button>
                
                <div 
                  className="flex-1 cursor-pointer" 
                  onClick={() => setCurrentTask(task.id === currentTask?.id ? null : task.id)}
                >
                  <h3 className="font-medium line-clamp-1">{task.title}</h3>
                  {task.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {task.description}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-3 mt-2">
                    <span className={cn(
                      "px-2 py-0.5 text-xs rounded-full",
                      getPriorityColor(task.priority)
                    )}>
                      {getPriorityName(task.priority)}
                    </span>
                    
                    {task.timeSpent > 0 && (
                      <span className="flex items-center text-xs text-muted-foreground gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTime(task.timeSpent)}
                      </span>
                    )}
                    
                    {task.id === currentTask?.id && (
                      <span className="flex items-center text-xs text-primary gap-1">
                        <AlarmClock className="h-3 w-3" />
                        Current Focus
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 opacity-50 hover:opacity-100"
                    onClick={() => startEditingTask(task)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 opacity-50 hover:opacity-100 hover:text-destructive"
                    onClick={() => deleteTask(task.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
          
          {tasks.some(task => task.completed) && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Completed Tasks
              </h3>
              
              <div className="space-y-2">
                {tasks.filter(task => task.completed).map(task => (
                  <div
                    key={task.id}
                    className="flex items-center gap-2 p-2 rounded-md bg-muted/50"
                  >
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    <span className="flex-1 text-sm line-through text-muted-foreground">
                      {task.title}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatTime(task.timeSpent)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Add Task Dialog */}
      <Dialog open={isAddingTask} onOpenChange={setIsAddingTask}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
            <DialogDescription>
              Create a new task for your focus session.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <Input
              placeholder="Task title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              className="col-span-12"
            />
            
            <Textarea
              placeholder="Task description (optional)"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              className="col-span-12"
            />
            
            <Select
              value={newTask.priority}
              onValueChange={(value) => setNewTask({ ...newTask, priority: value as TaskPriority })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">High Priority</SelectItem>
                <SelectItem value="medium">Medium Priority</SelectItem>
                <SelectItem value="low">Low Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingTask(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddTask}>Add Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Task Dialog */}
      <Dialog open={isEditingTask !== null} onOpenChange={(open) => !open && setIsEditingTask(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>
              Update your focus task details.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <Input
              placeholder="Task title"
              value={editingTask.title}
              onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
              className="col-span-12"
            />
            
            <Textarea
              placeholder="Task description (optional)"
              value={editingTask.description}
              onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
              className="col-span-12"
            />
            
            <Select
              value={editingTask.priority}
              onValueChange={(value) => setEditingTask({ ...editingTask, priority: value as TaskPriority })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">High Priority</SelectItem>
                <SelectItem value="medium">Medium Priority</SelectItem>
                <SelectItem value="low">Low Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditingTask(null)}>
              Cancel
            </Button>
            <Button onClick={handleEditTask}>Update Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
