import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { ExamCountdown } from "@/components/ExamCountdown";
import { StatsCard } from "@/components/StatsCard";
import { ProgressChart } from "@/components/ProgressChart";
import { TaskList } from "@/components/TaskList";
import { RecentActivity } from "@/components/RecentActivity";
import { AppSidebar } from "@/components/AppSidebar";
import { LayoutDashboard, BookMarked, FileText, LineChart, TestTube, Timer, MessageSquare, Briefcase } from 'lucide-react';

// Define task priority
type Priority = "High" | "Medium" | "Low";

// Sample task data
interface Task {
  title: string;
  deadline: string;
  priority: Priority;
  progress: number;
}

// Update priority values to match the enum
const tasks = [
  {
    title: "Complete DSA Assignment",
    deadline: "2024-04-25",
    priority: "High",
    progress: 75
  },
  {
    title: "Review React Hooks",
    deadline: "2024-04-26",
    priority: "Medium",
    progress: 30
  },
  {
    title: "Prepare System Design",
    deadline: "2024-04-28",
    priority: "High",
    progress: 90
  },
  {
    title: "Study Database Normalization",
    deadline: "2024-04-29",
    priority: "Low",
    progress: 60
  }
];

const Dashboard = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Exam Countdown */}
      <Card className="col-span-full lg:col-span-1">
        <CardContent className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">Upcoming Exam</h2>
          <ExamCountdown examName="Data Structures" examDate="2024-05-05" courseName="CS101" />
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <StatsCard
        title="Resources Viewed"
        value="24"
        trend={12}
        icon={<BookMarked size={20} />}
        color="text-focus-green"
      />
      <StatsCard
        title="Notes Taken"
        value="18"
        trend={-5}
        icon={<FileText size={20} />}
        color="text-focus-blue"
      />
      <StatsCard
        title="Practice Tests"
        value="8"
        trend={8}
        icon={<TestTube size={20} />}
        color="text-focus-red"
      />
      <StatsCard
        title="Focus Sessions"
        value="32"
        trend={15}
        icon={<Timer size={20} />}
        color="text-focus-purple"
      />

      {/* Progress Chart */}
      <Card className="col-span-full lg:col-span-2">
        <CardContent className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">Course Progress</h2>
          <ProgressChart />
        </CardContent>
      </Card>

      {/* Task List */}
      <Card className="col-span-full lg:col-span-2">
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Today's Tasks</h2>
            <Button size="sm">
              <Calendar className="mr-2 h-4 w-4" />
              View All
            </Button>
          </div>
          <TaskList tasks={tasks} />
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="col-span-full">
        <CardContent className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">Recent Activity</h2>
          <RecentActivity />
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
