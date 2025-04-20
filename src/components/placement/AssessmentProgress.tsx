
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from '@/components/ui/progress';
import { Badge } from "@/components/ui/badge";
import {
  BarChart4,
  BookText,
  Code,
  FileCode,
  Database,
  Network,
  Layers,
  BrainCircuit
} from 'lucide-react';

// Mock assessment data
const assessmentCategories = [
  {
    id: '1',
    name: 'DSA Fundamentals',
    progress: 75,
    score: '15/20',
    icon: Code,
    color: 'bg-primary'
  },
  {
    id: '2',
    name: 'System Design',
    progress: 45,
    score: '9/20',
    icon: Layers,
    color: 'bg-focus-purple'
  },
  {
    id: '3',
    name: 'Database Concepts',
    progress: 80,
    score: '16/20',
    icon: Database,
    color: 'bg-focus-blue'
  },
  {
    id: '4',
    name: 'Computer Networks',
    progress: 60,
    score: '12/20',
    icon: Network,
    color: 'bg-focus-green'
  },
  {
    id: '5',
    name: 'Operating Systems',
    progress: 65,
    score: '13/20',
    icon: BrainCircuit,
    color: 'bg-focus-yellow'
  },
  {
    id: '6',
    name: 'Web Development',
    progress: 85,
    score: '17/20',
    icon: FileCode,
    color: 'bg-focus-red'
  },
];

const AssessmentProgress: React.FC = () => {
  return (
    <Card className="overflow-hidden border-primary/20 shadow-md hover:shadow-lg transition-all duration-300">
      <div className="absolute -top-12 -left-12 w-40 h-40 bg-primary/10 rounded-full blur-2xl"></div>
      <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-primary/5 rounded-full blur-2xl"></div>
      
      <CardHeader className="pb-2 relative z-10">
        <CardTitle className="text-xl font-bold flex items-center gap-2 gradient-heading">
          <BarChart4 className="h-5 w-5" />
          Assessment Progress
        </CardTitle>
        <CardDescription>Track your progress across different technical areas</CardDescription>
      </CardHeader>
      
      <CardContent className="relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {assessmentCategories.map((category) => (
            <div key={category.id} className="space-y-2 group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <category.icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-medium text-sm">{category.name}</span>
                </div>
                <Badge 
                  variant="outline" 
                  className="bg-background/80 group-hover:bg-primary/10 transition-colors"
                >
                  {category.score}
                </Badge>
              </div>
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div 
                  className={`h-full ${category.color} rounded-full transition-all duration-700 ease-out`} 
                  style={{ width: `${category.progress}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Progress</span>
                <span className={cn(
                  "font-medium transition-colors",
                  category.progress >= 70 ? "group-hover:text-focus-green" : 
                  category.progress >= 40 ? "group-hover:text-focus-yellow" : 
                  "group-hover:text-focus-red"
                )}>{category.progress}%</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AssessmentProgress;
