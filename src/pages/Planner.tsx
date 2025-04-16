
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TaskCard } from '@/components/TaskCard';
import { 
  Search, 
  PlusCircle, 
  Filter, 
  Calendar, 
  Clock, 
  Tag, 
  AlertCircle 
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Sample task data
const sampleTasks = [
  {
    id: 1,
    title: "Revise Graphs in DSA",
    dueTime: "Today, 8:00 PM",
    subject: "CSE",
    priority: "High" as const,
    status: "todo"
  },
  {
    id: 2,
    title: "Complete Web Dev Assignment",
    dueTime: "Today, 5:00 PM",
    subject: "Web Dev",
    priority: "Medium" as const,
    status: "todo"
  },
  {
    id: 3,
    title: "Study SQL Joins",
    dueTime: "Tomorrow, 12:00 PM",
    subject: "DBMS",
    priority: "Medium" as const,
    status: "in-progress"
  },
  {
    id: 4,
    title: "Research for OS Project",
    dueTime: "Today, 3:00 PM",
    subject: "Operating Systems",
    priority: "Low" as const,
    status: "in-progress"
  },
  {
    id: 5,
    title: "Practice Python Problems",
    dueTime: "Yesterday, 6:00 PM",
    subject: "Programming",
    priority: "Medium" as const,
    status: "completed",
    completed: true
  },
  {
    id: 6,
    title: "Read Chapter 3 of Computer Networks",
    dueTime: "Yesterday, 7:00 PM",
    subject: "Networks",
    priority: "High" as const,
    status: "completed",
    completed: true
  },
];

const Planner = () => {
  const [filter, setFilter] = useState("all");
  const [subject, setSubject] = useState("all");
  
  // Filter tasks based on current filters
  const filteredTasks = sampleTasks.filter(task => {
    if (filter !== "all" && task.status !== filter) return false;
    if (subject !== "all" && task.subject !== subject) return false;
    return true;
  });
  
  const todoTasks = filteredTasks.filter(task => task.status === "todo");
  const inProgressTasks = filteredTasks.filter(task => task.status === "in-progress");
  const completedTasks = filteredTasks.filter(task => task.status === "completed");
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Daily Planner</h1>
        <p className="text-muted-foreground mt-1">Organize your tasks efficiently</p>
      </div>
      
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <Input placeholder="Search tasks..." className="pl-10" />
        </div>
        
        <div className="flex gap-3">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[150px]">
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
            <SelectTrigger className="w-[150px]">
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
          
          <Button variant="outline" className="gap-2">
            <Filter size={16} />
            <span className="hidden sm:inline">More Filters</span>
          </Button>
        </div>
      </div>
      
      {/* Add Task Button */}
      <Button className="gap-2">
        <PlusCircle size={16} />
        <span>Add New Task</span>
      </Button>
      
      {/* Tasks Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* To Do Column */}
        <Card className="overflow-hidden">
          <div className="bg-secondary p-3 border-b">
            <div className="flex items-center justify-between">
              <h3 className="font-medium flex items-center gap-2">
                <AlertCircle size={16} className="text-focus-red" />
                <span>To Do</span>
                <span className="bg-focus-red/10 text-focus-red px-1.5 rounded-full text-xs">
                  {todoTasks.length}
                </span>
              </h3>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <PlusCircle size={16} />
              </Button>
            </div>
          </div>
          <CardContent className="p-3 space-y-3 h-[calc(100vh-340px)] overflow-y-auto">
            {todoTasks.map(task => (
              <TaskCard
                key={task.id}
                title={task.title}
                dueTime={task.dueTime}
                subject={task.subject}
                priority={task.priority}
                completed={task.completed}
              />
            ))}
            {todoTasks.length === 0 && (
              <div className="flex flex-col items-center justify-center h-32 text-center">
                <p className="text-muted-foreground text-sm">No tasks found</p>
                <Button variant="ghost" size="sm" className="mt-2">
                  Add Task
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* In Progress Column */}
        <Card className="overflow-hidden">
          <div className="bg-secondary p-3 border-b">
            <div className="flex items-center justify-between">
              <h3 className="font-medium flex items-center gap-2">
                <Clock size={16} className="text-focus-yellow" />
                <span>In Progress</span>
                <span className="bg-focus-yellow/10 text-focus-yellow px-1.5 rounded-full text-xs">
                  {inProgressTasks.length}
                </span>
              </h3>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <PlusCircle size={16} />
              </Button>
            </div>
          </div>
          <CardContent className="p-3 space-y-3 h-[calc(100vh-340px)] overflow-y-auto">
            {inProgressTasks.map(task => (
              <TaskCard
                key={task.id}
                title={task.title}
                dueTime={task.dueTime}
                subject={task.subject}
                priority={task.priority}
                completed={task.completed}
              />
            ))}
            {inProgressTasks.length === 0 && (
              <div className="flex flex-col items-center justify-center h-32 text-center">
                <p className="text-muted-foreground text-sm">No tasks in progress</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Completed Column */}
        <Card className="overflow-hidden">
          <div className="bg-secondary p-3 border-b">
            <div className="flex items-center justify-between">
              <h3 className="font-medium flex items-center gap-2">
                <Calendar size={16} className="text-focus-green" />
                <span>Completed</span>
                <span className="bg-focus-green/10 text-focus-green px-1.5 rounded-full text-xs">
                  {completedTasks.length}
                </span>
              </h3>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <PlusCircle size={16} />
              </Button>
            </div>
          </div>
          <CardContent className="p-3 space-y-3 h-[calc(100vh-340px)] overflow-y-auto">
            {completedTasks.map(task => (
              <TaskCard
                key={task.id}
                title={task.title}
                dueTime={task.dueTime}
                subject={task.subject}
                priority={task.priority}
                completed={task.completed}
              />
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
