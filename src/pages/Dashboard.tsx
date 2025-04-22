import React, { useState, useEffect, } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TaskCard } from '@/components/TaskCard';
import { ProgressCard } from "@/components/ProgressCard";
import { StatsCard } from '@/components/StatsCard';
import { ExamCountdown } from '@/components/ExamCountdown';
import { CalendarCheck, BookMarked, LineChart, Award, Clock, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label, } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Trash2 } from 'lucide-react';
import { Play, Pause } from 'lucide-react';
import { format } from 'date-fns';

interface StudySession {
  startTime: Date;
  endTime?: Date; // Optional, as the session might be ongoing
}

interface UserStats {
  dailyStreak: number;
  studyTimeToday: number; // in minutes
  tasksCompleted: {
    completed: number;
    total: number;

  };
  overallProgress: number; // percentage
}

interface Task {
  id: number;
  title: string;
  dueTime: string;
  subject: string;
  priority: 'High' | 'Medium' | 'Low';
  completed: boolean;
};

const Dashboard = () => {
  interface Exam {
    id: number;
    examName: string;
    date: Date | null;
  }

  // Load user stats from local storage or initialize with default values
  const [userStats, setUserStats] = useState<UserStats>(() => {
    if (typeof window !== 'undefined') {
      const storedStats = localStorage.getItem('userStats');
      return storedStats ? JSON.parse(storedStats) : {
        dailyStreak: 0,
        studyTimeToday: 0,
        tasksCompleted: { completed: 0, total: 0 },
        overallProgress: 0,
      };
    }
    return { dailyStreak: 0, studyTimeToday: 0, tasksCompleted: { completed: 0, total: 0 }, overallProgress: 0 };
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('userStats', JSON.stringify(userStats));
    }
  }, [userStats]);


    useEffect(() => {
        if (typeof window !== 'undefined') {
            const today = new Date();
            const todayFormatted = today.toISOString().split('T')[0];
            const lastActiveDate = localStorage.getItem('lastActiveDate');

            if (lastActiveDate) {
                if (lastActiveDate !== todayFormatted) {
                    const lastActive = new Date(lastActiveDate);
                    const diffTime = today.getTime() - lastActive.getTime();
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                    setUserStats(prevStats => {
                        const newStreak = diffDays === 1 ? prevStats.dailyStreak + 1 : 1;
                        localStorage.setItem('lastActiveDate', todayFormatted);
                        return {
                            ...prevStats,
                            dailyStreak: newStreak,
                        };
                    });
                }
            }
        }
    }, []);

    const updateStreak = () => {
        const today = new Date();
        const todayFormatted = today.toISOString().split('T')[0];
        localStorage.setItem('lastActiveDate', todayFormatted);
        setUserStats(prevStats => ({
            ...prevStats,
            dailyStreak: prevStats.dailyStreak + 1,
        }));
    };
  // Load exams from local storage or initialize with an empty array
    const [exams, setExams] = useState<Exam[]>(() => {
        if (typeof window !== 'undefined') {
            const storedExams = localStorage.getItem('upcomingExams');
            return storedExams ? JSON.parse(storedExams) : [];
        }
        return [];
    });

  useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('upcomingExams', JSON.stringify(exams));
        }
    }, [exams]);










  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: "Complete DSA Assignment #3", dueTime: "Today, 4:00 PM", subject: "CSE", priority: "High", completed: false },
    { id: 2, title: "Review OS Process Synchronization", dueTime: "Today, 6:00 PM", subject: "Operating Systems", priority: "Medium", completed: false },
    { id: 3, title: "Prepare for Technical Interview", dueTime: "Today, 8:00 PM", subject: "Placement Prep", priority: "High", completed: false },
    { id: 4, title: "Read Chapter 5 of Database Systems", dueTime: "Today, 2:00 PM", subject: "DBMS", priority: "Medium", completed: true },
  ]);
  const [newTask, setNewTask] = useState<Partial<Task>>({});
  const [showAddExamDialog, setShowAddExamDialog] = useState(false);
  const [newExam, setNewExam] = useState<Partial<Exam>>({});

  const addExam = () => {
      if (newExam.examName && newExam.date) {
        const nextId = exams.length > 0 ? Math.max(...exams.map(e => e.id)) + 1 : 1;
        const fullNewExam: Exam = { id: nextId, ...newExam } as Exam;
        setExams([...exams, fullNewExam]);
        setNewExam({});
        setShowAddExamDialog(false);
      }
    };

    const handleAddTask = () => {
    const nextId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
    const fullNewTask: Task = { id: nextId, completed: false, ...newTask } as Task;
    setTasks([...tasks, fullNewTask]);
    setNewTask({});
  };
  const handleRemoveTask = (id: number) => setTasks(tasks.filter(task => task.id !== id));
  const handleCompleteTask = (id: number) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
    const today = new Date();
    const todayFormatted = today.toISOString().split('T')[0];
    const lastActiveDate = localStorage.getItem('lastActiveDate');
    let newStreak;

    if (!lastActiveDate) {
        newStreak = 1;
        localStorage.setItem('lastActiveDate', todayFormatted);
    } else if (lastActiveDate === todayFormatted) {
        newStreak = undefined;
    } else {
        const lastActive = new Date(lastActiveDate);
        const diffTime = today.getTime() - lastActive.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        newStreak = diffDays === 1 ? userStats.dailyStreak + 1 : 1;
        localStorage.setItem('lastActiveDate', todayFormatted);
    }


  setUserStats(prevStats => {
    const updatedTasks = tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task);
    const completedTasksCount = updatedTasks.filter(task => task.completed).length;
    
    return {
      ...prevStats,
      dailyStreak: newStreak !== undefined ? newStreak : prevStats.dailyStreak,
      tasksCompleted: {
        completed: completedTasksCount,
        total: updatedTasks.length,
      },
    };
  });
};
    const handleRemoveExam = (id: number) => {
    setExams(exams.filter((exam) => exam.id !== id));
  };
    const calculateDaysLeft = (date: Date | null): number => {
    if (!date || !(date instanceof Date)) {
      return 0;
    }
    return Math.ceil((date.getTime() - new Date().getTime()) / (1000 * 3600 * 24));
  };

  const [studySessions, setStudySessions] = useState<StudySession[]>([]);

    const [isStudying, setIsStudying] = useState<boolean>(false);

    useEffect(() => {
        const today = new Date();
        const todayFormatted = today.toISOString().split('T')[0];
        const storageKey = `studySessions-${todayFormatted}`;

        const storedSessions = localStorage.getItem(storageKey);
        const sessions = storedSessions ? JSON.parse(storedSessions) : [];

        setStudySessions(sessions);
        setIsStudying(sessions.some((session: StudySession) => !session.endTime));

        const lastSavedDate = localStorage.getItem('lastSavedStudyDate');
        if (lastSavedDate && lastSavedDate !== todayFormatted) {
            localStorage.removeItem(`studySessions-${lastSavedDate}`);
            setStudySessions([]);
        }
        localStorage.setItem('lastSavedStudyDate', todayFormatted);
    }, []);

    const getPreviousDayStudyTime = (): number => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayFormatted = yesterday.toISOString().split('T')[0];
        const storageKey = `studySessions-${yesterdayFormatted}`;
        const storedSessions = localStorage.getItem(storageKey);
        const sessions: StudySession[] = storedSessions ? JSON.parse(storedSessions) : [];
        let totalSeconds = 0;
        for (const session of sessions) {
            if (session.startTime instanceof Date) {
                const endTime = session.endTime instanceof Date ? session.endTime : new Date();
                const durationMs = endTime.getTime() - session.startTime.getTime();
                totalSeconds += Math.floor(durationMs / 1000);
            }
        }
        return totalSeconds;
    };

    useEffect(() => {
        const formatTime = (totalSeconds: number): string => {
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;
            return `${hours}h ${minutes}m ${seconds}s`;
        };
        let intervalId: NodeJS.Timeout | null = null;
  
      if (isStudying) {
        intervalId = setInterval(() => {
            const totalSeconds = calculateTotalStudyTime(studySessions);
            setDisplayedStudyTime(formatTime(totalSeconds));
        }, 1000);
      } else if (intervalId !== null){
        
           clearInterval(intervalId);
        
        intervalId = null;
      }
  
      return () => {
        if(intervalId !== null) clearInterval(intervalId);
      };
    }, [isStudying, studySessions]);

    const startStudy = () => {
      const newSession: StudySession = { startTime: new Date() };
      const updatedSessions = [...studySessions, newSession];
      setStudySessions(updatedSessions);
      localStorage.setItem(
        `studySessions-${new Date().toISOString().split("T")[0]}`,
        JSON.stringify(updatedSessions)
      );
      setIsStudying(true);
    };

    const stopStudy = () => {
        const updatedSessions = studySessions.map((session: StudySession) => {
            if (!session.endTime) {
                return { ...session, endTime: new Date() };
            }
            return session;
        });
        setStudySessions(updatedSessions);
        localStorage.setItem(`studySessions-${new Date().toISOString().split('T')[0]}`, JSON.stringify(updatedSessions));
        setIsStudying(false);
    };

    const calculateTotalStudyTime = (sessions: StudySession[]): number => { // Change: Calculate in seconds
      let totalSeconds = 0;
      for (const session of sessions) {
        if (session.startTime instanceof Date) {
          const endTime = session.endTime instanceof Date ? session.endTime : new Date();
          const durationMs = endTime.getTime() - session.startTime.getTime();
          totalSeconds += Math.floor(durationMs / 1000); // Change: Calculate in seconds
        }
      }
      return totalSeconds;
    };

    const [studyTimeTrend, setStudyTimeTrend] = useState<number>(0);
    const [displayedStudyTime, setDisplayedStudyTime] = useState<string>('0h 0m 0s');

    useEffect(() => {
        console.log("studySessions updated:", studySessions);
        const totalSeconds = calculateTotalStudyTime(studySessions);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        setDisplayedStudyTime(`${hours}h ${minutes}m ${seconds}s`); // Updated formatting

        const previousDaySeconds = getPreviousDayStudyTime(); // Get previous day in seconds
        const trend = previousDaySeconds === 0 ? 0 : Math.round(((totalSeconds - previousDaySeconds) / previousDaySeconds) * 100);
        setStudyTimeTrend(trend);
    }, [studySessions]);

  

  

    return (
        <div className="space-y-8 animate-fade-in">
          <div>
              <h1 className="text-3xl font-bold">Hey Pardhu, Ready to crush it today? 🚀</h1>
              <p className="text-muted-foreground mt-1">Let's make progress on your goals!</p>
          </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard
                    title="Daily Streak"
                    value={`${userStats.dailyStreak} days`}
                    icon={<Flame size={24} className="text-primary" />}
                    trend={userStats.dailyStreak > 0 ? 1 : 0}
                    trendLabel="vs last week"
                />
                <StatsCard
                    onClick={() => (isStudying ? stopStudy() : startStudy())}
                    className="cursor-pointer"
                    title="Study Time Today"
                    value={displayedStudyTime}
                    icon={isStudying ? (
                        <Pause size={24} className="text-focus-blue" />
                    ) : (
                        <Play size={24} className="text-focus-blue" />
                    )}
                    trend={studyTimeTrend}
                    trendLabel="vs yesterday"
                />
                <StatsCard
                    title="Tasks Completed"
                    value={`${userStats.tasksCompleted.completed}/${userStats.tasksCompleted.total}`}
                    icon={<CalendarCheck size={24} className="text-focus-green" />}
                    trend={
                        userStats.tasksCompleted.total > 0
                            ? (userStats.tasksCompleted.completed / userStats.tasksCompleted.total) * 100
                            : 0
                    }

                />
                <StatsCard
                    title="Overall Progress"
                    value="68%"
                    icon={<Award size={24} className="text-focus-yellow" />}
                    trend={12}
                    trendLabel="this week"
                />
            </div>
              <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Upcoming Exams</h2>
                    <Dialog open={showAddExamDialog} onOpenChange={setShowAddExamDialog}>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm">Add Exam</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Add New Exam</DialogTitle>
                                <DialogDescription>
                                    Fill in the details for the new exam.
                                </DialogDescription>
                            </DialogHeader>
                            <div className='grid grid-cols-1 gap-4 py-4'>
                                <div className='space-y-1'>
                                    <Label htmlFor='examName'>Exam Name</Label>
                                    <Input
                                        id='examName'
                                        value={newExam.examName || ''}
                                        onChange={(e) => setNewExam({ ...newExam, examName: e.target.value })}
                                        className='border-gray-300 rounded-md text-sm'
                                        placeholder='e.g. Data Structures Midterm'
                                    />
                                </div>
                                <div className='space-y-1'>
                                    <Label htmlFor='examDate'>Exam Date</Label>
                                    <Calendar
                                        mode="single"
                                        selected={newExam.date}
                                        onSelect={(date) => setNewExam({ ...newExam, date })}
                                        className="rounded-md border"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type='submit' onClick={addExam}>Add Exam</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {exams.length === 0 && (
                        <div className="text-center text-gray-500 col-span-full">
                            No upcoming exams. Add some exams to get started!
                        </div>
                    )}
                    {exams.map((exam) => (
                        <div key={exam.id} className="bg-white rounded-lg shadow-md p-4 relative">
                            <ExamCountdown
                                examName={exam.examName}
                                date={exam.date ? format(exam.date, 'MMMM dd, yyyy') : ''}                            
                                daysLeft={exam.date ? calculateDaysLeft(exam.date) : 0}

                            />
                            <Button variant="destructive" size="sm" className="w-full mt-2 bg-purple-200 hover:bg-purple-300 text-white-900" onClick={() => handleRemoveExam(exam.id)}>
                                Remove Exam
                            </Button>

                        </div>

                    ))}
                </div>
            </div>
              <Tabs defaultValue="tasks">
                <TabsList className="grid grid-cols-3 w-full max-w-md mb-4">
                    <TabsTrigger value="tasks" className="flex items-center gap-2">
                        <CalendarCheck size={16} />
                        <span>Today's Tasks</span>
                    </TabsTrigger>
                    <TabsTrigger value="resources" className="flex items-center gap-2">
                        <BookMarked size={16} />
                        <span>Resources</span>
                    </TabsTrigger>
                    <TabsTrigger value="progress" className="flex items-center gap-2">
                        <LineChart size={16} />
                        <span>Progress</span>
                    </TabsTrigger>
                </TabsList>
                  <TabsContent value="tasks" className="mt-0">
                    <Card>
                        <CardContent className="p-6">
                            <div className="mb-6">
                                <h3 className="text-lg font-medium">Today's Priority Tasks</h3>
                            </div>
                            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
                                <div className='space-y-1'>
                                    <Label htmlFor="taskTitle" className="text-sm font-medium">Title</Label>
                                    <Input id="taskTitle" className="border-gray-300 rounded-md text-sm" placeholder="Enter task title" value={newTask.title || ''} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} />
                                </div>
                                <div className='space-y-1'>
                                    <Label htmlFor="taskDueTime" className="text-sm font-medium">Due Time</Label>
                                    <Input id="taskDueTime" className="border-gray-300 rounded-md text-sm" placeholder="e.g., Today, 4:00 PM" value={newTask.dueTime || ''} onChange={(e) => setNewTask({ ...newTask, dueTime: e.target.value })} />
                                </div>
                                <div className='space-y-1'>
                                    <Label htmlFor="taskSubject" className="text-sm font-medium">Subject</Label>
                                    <Input id="taskSubject" className="border-gray-300 rounded-md text-sm" placeholder="e.g., CSE" value={newTask.subject || ''} onChange={(e) => setNewTask({ ...newTask, subject: e.target.value })} />
                                </div>
                                <div className='space-y-1'>
                                    <Label htmlFor="priority" className="text-sm font-medium">Priority</Label>
                                    <Select onValueChange={(value) => setNewTask({ ...newTask, priority: value as "High" | "Medium" | "Low" })} defaultValue={"High"}>
                                        <SelectTrigger id="priority" className="border-gray-300 rounded-md text-sm">
                                            <SelectValue placeholder="Select priority" />
                                        </SelectTrigger>
                                        <SelectContent className='text-sm'>
                                            <SelectItem value="High">High</SelectItem>
                                            <SelectItem value="Medium">Medium</SelectItem>
                                            <SelectItem value="Low">Low</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className='space-y-1 flex items-end'>
                                    <Button size="sm" className="rounded-md" onClick={handleAddTask}>Add Task</Button>
                                </div>
                            </div>
                            {/* Task List Section */}
                            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                                {tasks.length === 0 && (
                                    <div className="text-center text-gray-500">
                                        No tasks for today. Add some tasks to get started!
                                    </div>
                                )}
                                <div className="space-y-3">

                                    {/* Task Item List */}

                                    {tasks.map((task) => (
                                        <div key={task.id} className='flex items-center justify-between bg-white p-3 rounded-md shadow-sm'>
                                            <TaskCard
                                                title={task.title}
                                                dueTime={task.dueTime}
                                                subject={task.subject}
                                                priority={task.priority}
                                                completed={task.completed}
                                            />
                                            <div className='flex gap-2'>
                                                <Button variant='outline' size='icon' onClick={() => handleCompleteTask(task.id)} className='rounded-full'>
                                                    <Check
                                                        className="h-4 w-4"
                                                    />
                                                </Button>
                                                <Button variant='outline' size='icon' onClick={() => handleRemoveTask(task.id)} className='rounded-full'>
                                                    <X
                                                        className="h-4 w-4"
                                                    />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-4 flex justify-center">
                                <Button variant="outline" size="sm" className="w-full" onClick={() => navigate('/Planner')}>
                                    View All Tasks
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                  <TabsContent value="resources" className="mt-0">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-medium">Recently Added Resources</h3>
                                <Button size="sm">Add Resource</Button>
                            </div>

                            <div className="space-y-3">
                                <div className="bg-muted/30 rounded-lg p-4">
                                    <h4 className="font-medium mb-2">DSA Mastery Course</h4>
                                    <p className="text-sm text-muted-foreground mb-3">A comprehensive video series covering all Data Structure topics for interviews.</p>
                                    <Button variant="outline" size="sm">Open Resource</Button>
                                </div>

                                <div className="bg-muted/30 rounded-lg p-4">
                                    <h4 className="font-medium mb-2">Operating Systems Notes</h4>
                                    <p className="text-sm text-muted-foreground mb-3">Complete compilation of OS concepts with diagrams and examples.</p>
                                    <Button variant="outline" size="sm">Open Resource</Button>
                                </div>
                            </div>

                            <div className="mt-4 flex justify-center">
                                <Button variant="outline" size="sm" className="w-full">
                                    View All Resources
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                  <TabsContent value="progress" className="mt-0">
                    <Card>
                        <CardContent className="p-6">
                            <h3 className="text-lg font-medium mb-4">Subject Progress</h3>

                            <div className="space-y-3">
                                <ProgressCard
                                    subject="Data Structures & Algorithms"
                                    progress={60}
                                    color="bg-focus-blue"
                                />
                                <ProgressCard
                                    subject="Web Development"
                                    progress={30}
                                    color="bg-focus-green"
                                />
                                <ProgressCard
                                    subject="Operating Systems"
                                    progress={90}
                                    color="bg-focus-purple"
                                />
                                <ProgressCard
                                    subject="Database Management"
                                    progress={45}
                                    color="bg-focus-yellow"
                                />
                            </div>

                            <div className="mt-4 flex justify-center">
                                <Button variant="outline" size="sm" className="w-full">
                                    View Detailed Progress
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
          </div>
    );
};

export default Dashboard;
