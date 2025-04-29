import React, { useState } from 'react';
import { useFocusTimer, FocusTask, TaskPriority, FocusSubtask } from './FocusTimerContext';
import { useTaskStore } from '@/contexts/TaskStoreContext';
import { 
  CheckCircle2,
  Circle,
  Pencil,
  Trash2,
  Clock,
  PlusCircle,
  AlarmClock,
  GripVertical,
  Tag,
  Calendar,
  ListTodo,
  ChevronDown,
  ChevronUp,
  Star,
  StarHalf,
  StarOff,
  BookOpen,
  Filter,
  SortAsc,
  SortDesc
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
import { motion, AnimatePresence } from 'framer-motion';

interface TaskListProps {
  className?: string;
  compact?: boolean;
}

// Helper for sorting
const sortTasks = (tasks, sortBy, sortDir) => {
  const sorted = [...tasks];
  sorted.sort((a, b) => {
    if (sortBy === 'priority') {
      const order = { high: 0, medium: 1, low: 2 };
      return (order[a.priority] - order[b.priority]) * (sortDir === 'asc' ? 1 : -1);
    }
    if (sortBy === 'dueDate') {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return (new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()) * (sortDir === 'asc' ? 1 : -1);
    }
    if (sortBy === 'pomodoros') {
      return ((a.pomodoros || 0) - (b.pomodoros || 0)) * (sortDir === 'asc' ? 1 : -1);
    }
    return (a.order || 0) - (b.order || 0);
  });
  return sorted;
};

export function TaskList({ className, compact = false }: TaskListProps) {
  const { 
    state, 
    addTask, 
    editTask, 
    completeTask, 
    deleteTask, 
    setCurrentTask, 
    formatTime,
    // Advanced actions (to be added in context):
    // dispatch for subtasks, pomodoros, reorder
  } = useFocusTimer();
  const {
    tasks,
    addTask: addTaskStore,
    editTask: editTaskStore,
    completeTask: completeTaskStore,
    deleteTask: deleteTaskStore,
    reorderTasks,
  } = useTaskStore();
  const { currentTask } = state;

  // UI state
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed'>('all');
  const [filterPriority, setFilterPriority] = useState<'all' | TaskPriority>('all');
  const [sortBy, setSortBy] = useState<'order' | 'priority' | 'dueDate' | 'pomodoros'>('order');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [search, setSearch] = useState('');

  // New/Editing task state
  const [newTask, setNewTask] = useState<any>({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    tags: '',
    notes: '',
    subtasks: [],
  });
  const [editingTask, setEditingTask] = useState<any>({});

  // Toggle for showing/hiding task list
  const [showTasks, setShowTasks] = useState(true);

  // Filtering and sorting
  let filtered = tasks.filter(t => t.inFocus);
  if (filterStatus !== 'all') filtered = filtered.filter(t => filterStatus === 'active' ? !t.completed : t.completed);
  if (filterPriority !== 'all') filtered = filtered.filter(t => t.priority === filterPriority);
  if (search) filtered = filtered.filter(t => t.title.toLowerCase().includes(search.toLowerCase()) || (t.tags || []).join(',').toLowerCase().includes(search.toLowerCase()));
  filtered = sortTasks(filtered, sortBy, sortDir);

  // Drag-and-drop (simple version)
  const handleDragStart = (e, idx) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', idx);
  };
  const handleDrop = (e, idx) => {
    const from = Number(e.dataTransfer.getData('text/plain'));
    if (from !== idx) {
      // dispatch({ type: 'REORDER_TASKS', payload: { sourceIndex: from, destinationIndex: idx } });
    }
  };

  // Priority color
  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case 'high': return 'bg-focus-red/10 text-focus-red border-focus-red/20';
      case 'medium': return 'bg-focus-yellow/10 text-focus-yellow border-focus-yellow/20';
      case 'low': return 'bg-focus-green/10 text-focus-green border-focus-green/20';
      default: return 'bg-secondary text-muted-foreground';
    }
  };
  const getPriorityName = (priority: TaskPriority) => priority.charAt(0).toUpperCase() + priority.slice(1);

  // Compact mode (sidebar)
  if (compact) {
    return (
      <div className={cn('p-2', className)}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium">Current Tasks</h3>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setIsAddingTask(true)}>
            <PlusCircle className="h-4 w-4" />
          </Button>
        </div>
        {filtered.length === 0 ? (
          <p className="text-xs text-muted-foreground">No tasks yet. Add one to get started!</p>
        ) : (
          <ul className="space-y-1">
            {filtered.filter(t => !t.completed).slice(0, 3).map(task => (
              <li
                key={task.id}
                className={cn(
                  'flex items-center text-xs p-1 rounded-md cursor-pointer',
                  task.id === currentTask?.id ? 'bg-primary/5 border border-primary/20' : ''
                )}
                onClick={() => setCurrentTask(task.id === currentTask?.id ? null : task.id)}
              >
                <div className="flex-1 truncate">{task.title}</div>
                <div className={cn('px-1 rounded text-xs', getPriorityColor(task.priority))}>
                  {getPriorityName(task.priority).charAt(0)}
                </div>
              </li>
            ))}
            {filtered.filter(t => !t.completed).length > 3 && (
              <li className="text-xs text-center text-muted-foreground">
                +{filtered.filter(t => !t.completed).length - 3} more tasks
              </li>
            )}
          </ul>
        )}
      </div>
    );
  }
  
  // Main advanced UI
  return (
    <div className={cn('p-4', className)}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Focus Session Tasks</h2>
        <div className="flex gap-2 items-center">
          <Button variant="ghost" size="sm" onClick={() => setShowTasks(v => !v)}>
            {showTasks ? 'Hide Focus Tasks' : 'Show Focus Tasks'}
          </Button>
        <Button
            variant="default"
          size="sm"
          onClick={() => setIsAddingTask(true)}
          className="flex items-center gap-1"
        >
          <PlusCircle className="h-4 w-4" />
          <span>New Task</span>
        </Button>
      </div>
      </div>
      <div className="mb-2 text-xs text-muted-foreground">
        <span>Only add tasks you want to work on in deep focus sessions. </span>
        <br />
        <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3 text-blue-500" /> = Imported from Daily Planner</span>
        </div>
      {showTasks && (
        <div className="space-y-3">
          <AnimatePresence>
            {filtered.map((task, idx) => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
              >
            <Card
              className={cn(
                    'p-3 transition-all duration-200 hover:shadow-md flex flex-col',
                    task.id === currentTask?.id ? 'border-primary/50 shadow-sm bg-primary/5' : 'hover:border-primary/20',
                    'relative group'
                  )}
                  draggable
                  onDragStart={e => handleDragStart(e, idx)}
                  onDragOver={e => e.preventDefault()}
                  onDrop={e => handleDrop(e, idx)}
                >
                  <div className="flex items-start gap-2">
                    <span className="cursor-move text-muted-foreground opacity-60 group-hover:opacity-100"><GripVertical className="h-4 w-4" /></span>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 rounded-full" onClick={() => completeTaskStore(task.id)}>
                      {task.completed ? <CheckCircle2 className="h-5 w-5 text-primary" /> : <Circle className="h-5 w-5 text-muted-foreground" />}
                </Button>
                    <div className="flex-1 cursor-pointer" onClick={() => setCurrentTask(task.id === currentTask?.id ? null : task.id)}>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium line-clamp-1">{task.title}</h3>
                        {task.origin === 'planner' && (
                          <span title="Imported from Planner">
                            <Calendar className="h-4 w-4 text-blue-500 inline" />
                          </span>
                        )}
                        {task.dueDate && <span className="flex items-center text-xs text-muted-foreground gap-1"><Calendar className="h-3 w-3" />{task.dueDate}</span>}
                        {task.tags && task.tags.length > 0 && task.tags.map(tag => <span key={tag} className="text-xs px-1 py-0.5 rounded bg-muted/50 text-muted-foreground"><Tag className="h-3 w-3 inline" /> {tag}</span>)}
                      </div>
                      {task.description && <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{task.description}</p>}
                      <div className="flex items-center gap-3 mt-2 flex-wrap">
                        <span className={cn('px-2 py-0.5 text-xs rounded-full', getPriorityColor(task.priority))}>{getPriorityName(task.priority)}</span>
                        {task.timeSpent > 0 && <span className="flex items-center text-xs text-muted-foreground gap-1"><Clock className="h-3 w-3" />{formatTime(task.timeSpent)}</span>}
                        {task.pomodoros > 0 && <span className="flex items-center text-xs text-pink-600 gap-1"><AlarmClock className="h-3 w-3" />{task.pomodoros} Pomodoros</span>}
                        {task.id === currentTask?.id && <span className="flex items-center text-xs text-primary gap-1"><AlarmClock className="h-3 w-3" />Current Focus</span>}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 opacity-50 hover:opacity-100" onClick={() => { setEditingTask(task); setEditingTaskId(task.id); }}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 opacity-50 hover:opacity-100 hover:text-destructive" onClick={() => deleteTaskStore(task.id)}><Trash2 className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 opacity-50 hover:opacity-100" onClick={() => setExpandedTaskId(expandedTaskId === task.id ? null : task.id)}>{expandedTaskId === task.id ? <ChevronUp /> : <ChevronDown />}</Button>
              </div>
                  </div>
                  {/* Expanded details: notes, subtasks */}
                  <AnimatePresence>
                    {expandedTaskId === task.id && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}>
                        <div className="mt-3 space-y-2">
                          {task.notes && <div className="flex items-start gap-2"><BookOpen className="h-4 w-4 text-muted-foreground mt-0.5" /><span className="text-sm text-muted-foreground">{task.notes}</span></div>}
                          {task.subtasks && task.subtasks.length > 0 && (
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-2 text-xs font-medium mb-1"><ListTodo className="h-3 w-3" />Subtasks</div>
                              {task.subtasks.map(st => (
                                <div key={st.id} className="flex items-center gap-2 pl-4">
                                  <Button variant="ghost" size="sm" className="h-5 w-5 p-0" /* onClick={...} */>
                                    {st.completed ? <CheckCircle2 className="h-4 w-4 text-primary" /> : <Circle className="h-4 w-4 text-muted-foreground" />}
                                  </Button>
                                  <span className={cn('text-xs', st.completed && 'line-through text-muted-foreground')}>{st.title}</span>
                  </div>
                ))}
              </div>
                          )}
            </div>
                      </motion.div>
          )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
      
      {/* Add/Edit Task Dialogs */}
      <Dialog open={isAddingTask} onOpenChange={setIsAddingTask}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
            <DialogDescription>All fields are optional except title.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input placeholder="Task title" value={newTask.title} onChange={e => setNewTask({ ...newTask, title: e.target.value })} />
            <Textarea placeholder="Task description" value={newTask.description} onChange={e => setNewTask({ ...newTask, description: e.target.value })} />
            <Input placeholder="Due date (YYYY-MM-DD)" value={newTask.dueDate} onChange={e => setNewTask({ ...newTask, dueDate: e.target.value })} />
            <Input placeholder="Tags (comma separated)" value={newTask.tags} onChange={e => setNewTask({ ...newTask, tags: e.target.value })} />
            <Textarea placeholder="Notes" value={newTask.notes} onChange={e => setNewTask({ ...newTask, notes: e.target.value })} />
            {/* Subtasks UI could be added here */}
            <Select value={newTask.priority} onValueChange={v => setNewTask({ ...newTask, priority: v as TaskPriority })}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Priority" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingTask(false)}>Cancel</Button>
            <Button onClick={() => {
              if (!newTask.title.trim()) return;
              addTaskStore({
                ...newTask,
                inFocus: true,
                title: newTask.title.trim(),
                description: newTask.description.trim(),
                priority: newTask.priority,
                dueDate: newTask.dueDate || undefined,
                tags: newTask.tags ? newTask.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [],
                notes: newTask.notes,
                subtasks: [],
              });
              setNewTask({ title: '', description: '', priority: 'medium', dueDate: '', tags: '', notes: '', subtasks: [] });
              setIsAddingTask(false);
            }}>Add Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={!!editingTaskId} onOpenChange={open => !open && setEditingTaskId(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>Update your task details.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input placeholder="Task title" value={editingTask.title || ''} onChange={e => setEditingTask({ ...editingTask, title: e.target.value })} />
            <Textarea placeholder="Task description" value={editingTask.description || ''} onChange={e => setEditingTask({ ...editingTask, description: e.target.value })} />
            <Input placeholder="Due date (YYYY-MM-DD)" value={editingTask.dueDate || ''} onChange={e => setEditingTask({ ...editingTask, dueDate: e.target.value })} />
            <Input placeholder="Tags (comma separated)" value={editingTask.tags ? editingTask.tags.join(', ') : ''} onChange={e => setEditingTask({ ...editingTask, tags: e.target.value.split(',').map((t: string) => t.trim()).filter(Boolean) })} />
            <Textarea placeholder="Notes" value={editingTask.notes || ''} onChange={e => setEditingTask({ ...editingTask, notes: e.target.value })} />
            {/* Subtasks UI could be added here */}
            <Select value={editingTask.priority || 'medium'} onValueChange={v => setEditingTask({ ...editingTask, priority: v as TaskPriority })}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Priority" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingTaskId(null)}>Cancel</Button>
            <Button onClick={() => {
              if (!editingTask.title.trim()) return;
              editTaskStore(editingTaskId, {
                title: editingTask.title.trim(),
                description: editingTask.description.trim(),
                priority: editingTask.priority,
                dueDate: editingTask.dueDate || undefined,
                tags: editingTask.tags,
                notes: editingTask.notes,
                // subtasks: editingTask.subtasks,
              });
              setEditingTaskId(null);
            }}>Update Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
