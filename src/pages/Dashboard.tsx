
import React from 'react';
import { StatsCard } from '@/components/StatsCard';
import { TaskCard } from '@/components/TaskCard';
import { ProgressCard } from '@/components/ProgressCard';
import { RecentActivity } from '@/components/RecentActivity';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  CheckCircle, 
  Code, 
  FileText as FileTextIcon,
  User, 
  Clock,
  CalendarIcon
} from 'lucide-react';
import { ExamCountdown } from '@/components/ExamCountdown';
import { ProgressChart } from '@/components/ProgressChart';
import { ProgressTracker } from '@/components/ProgressTracker';
import { MockTestsSection } from '@/components/MockTestsSection';

const Dashboard = () => {
  // Mock data
  const recentActivities = [
    {
      id: '1',
      title: 'Completed Data Structures Quiz',
      timestamp: new Date(Date.now() - 3600000),
      type: 'quiz',
      resultType: 'success'
    },
    {
      id: '2',
      title: 'Studied Algorithm Design',
      timestamp: new Date(Date.now() - 86400000),
      type: 'resource'
    },
    {
      id: '3',
      title: 'Mock Interview Session',
      timestamp: new Date(Date.now() - 172800000),
      type: 'interview'
    },
    {
      id: '4',
      title: 'Submitted Resume',
      timestamp: new Date(Date.now() - 259200000),
      type: 'resume',
      resultType: 'partial'
    }
  ];

  const upcomingExams = [
    {
      title: "Google SDE Online Assessment",
      date: new Date(Date.now() + 86400000 * 2),
      company: "Google",
      importance: "high"
    },
    {
      title: "Amazon Coding Round",
      date: new Date(Date.now() + 86400000 * 5),
      company: "Amazon",
      importance: "medium"
    }
  ];

  const mockTaskData = [
    {
      id: '1',
      title: 'Complete Data Structures Notes',
      priority: 'High',
      dueDate: new Date(Date.now() + 86400000),
      completed: false
    },
    {
      id: '2',
      title: 'Practice LeetCode Problems',
      priority: 'Medium',
      dueDate: new Date(Date.now() + 86400000 * 2),
      completed: false
    },
    {
      id: '3',
      title: 'Review System Design Concepts',
      priority: 'Low',
      dueDate: new Date(Date.now() + 86400000 * 3),
      completed: true
    }
  ];

  // Handlers
  const handleViewStats = () => {
    console.log("Navigate to stats");
    return "Navigating to stats page";
  };

  return (
    <motion.div 
      className="container mx-auto space-y-8 mb-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header Section */}
      <div className="pt-6">
        <h1 className="text-3xl font-bold gradient-heading">Welcome back!</h1>
        <p className="text-muted-foreground mt-1">
          Here's an overview of your preparation journey
        </p>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Study Hours"
          value="24.5 hrs"
          icon={<Clock size={24} />}
          trend={12}
          description="this week"
          color="bg-primary/10"
        />
        
        <StatsCard
          title="Quizzes Completed"
          value="8"
          icon={<CheckCircle size={24} />}
          trend={-5}
          description="this week"
          color="bg-focus-blue/10"
        />
        
        <StatsCard
          onClick={handleViewStats}
          className="cursor-pointer"
          title="Resources Accessed"
          value="15"
          icon={<BookOpen size={24} />}
          trend={20}
          color="bg-focus-yellow/10"
        />
        
        <StatsCard
          title="Mock Interviews"
          value="3"
          icon={<User size={24} />}
          trend={0}
          description="no change"
          color="bg-focus-purple/10"
        />
      </div>
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progress Section */}
          <div>
            <h2 className="text-xl font-semibold mb-3">Your Progress</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <ProgressCard
                title="DSA Topics" 
                value={65}
                icon={<Code size={20} />}
              />
              <ProgressCard
                title="Quizzes"
                value={48}
                icon={<CheckCircle size={20} />}
              />
              <ProgressCard
                title="Resume"
                value={90}
                icon={<FileTextIcon size={20} />}
              />
            </div>
            <ProgressTracker />
          </div>
          
          {/* Recent Activity */}
          <div>
            <h2 className="text-xl font-semibold mb-3">Recent Activity</h2>
            <RecentActivity activities={recentActivities} />
          </div>
          
          {/* Mock Tests */}
          <div>
            <h2 className="text-xl font-semibold mb-3">Mock Tests</h2>
            <MockTestsSection />
          </div>
        </div>
        
        {/* Right Column */}
        <div className="space-y-6">
          {/* Upcoming Exams */}
          <div>
            <h2 className="text-xl font-semibold mb-3">Upcoming Exams</h2>
            <div className="space-y-3">
              {upcomingExams.map((exam, index) => (
                <ExamCountdown 
                  key={index}
                  title={exam.title}
                  date={exam.date}
                  company={exam.company}
                  importance={exam.importance}
                />
              ))}
            </div>
          </div>
          
          {/* Quick Tasks */}
          <div>
            <h2 className="text-xl font-semibold flex items-center mb-3">
              <span>Tasks Due Soon</span>
              <CalendarIcon className="ml-2 h-4 w-4 text-muted-foreground" />
            </h2>
            <div className="space-y-3">
              {mockTaskData.map((task) => (
                <TaskCard
                  key={task.id}
                  title={task.title}
                  dueTime={format(task.dueDate, 'MMM dd, hh:mm a')}
                  subject={task.completed ? 'Completed' : 'Pending'}
                  priority={task.priority as "High" | "Medium" | "Low"}
                  completed={task.completed}
                  id={parseInt(task.id)}
                  onComplete={() => {}}
                />
              ))}
            </div>
          </div>
          
          {/* Chart */}
          <div>
            <h2 className="text-xl font-semibold mb-3">Weekly Activity</h2>
            <ProgressChart />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
