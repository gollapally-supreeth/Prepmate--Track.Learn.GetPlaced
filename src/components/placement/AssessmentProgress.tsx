
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
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

// Mock assessment data
const assessmentCategories = [
  {
    id: '1',
    name: 'DSA Fundamentals',
    progress: 75,
    score: '15/20',
    icon: Code,
  },
  {
    id: '2',
    name: 'System Design',
    progress: 45,
    score: '9/20',
    icon: Layers,
  },
  {
    id: '3',
    name: 'Database Concepts',
    progress: 80,
    score: '16/20',
    icon: Database,
  },
  {
    id: '4',
    name: 'Computer Networks',
    progress: 60,
    score: '12/20',
    icon: Network,
  },
  {
    id: '5',
    name: 'Operating Systems',
    progress: 65,
    score: '13/20',
    icon: BrainCircuit,
  },
  {
    id: '6',
    name: 'Web Development',
    progress: 85,
    score: '17/20',
    icon: FileCode,
  },
];

const AssessmentProgress: React.FC = () => {
  const { toast } = useToast();
  
  const handlePracticeMore = (category: string) => {
    toast({
      title: "Practice Mode",
      description: `Starting practice session for ${category}`,
    });
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Assessment Progress</CardTitle>
          <CardDescription>Track your progress across different technical areas</CardDescription>
        </div>
        <Button size="sm" variant="outline" onClick={() => toast({
          title: "All Assessments",
          description: "View all your assessment results and analytics"
        })}>
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {assessmentCategories.map((category) => (
            <div key={category.id} className="space-y-2 bg-muted/30 hover:bg-muted/50 p-4 rounded-lg transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <category.icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-medium text-sm">{category.name}</span>
                </div>
                <Badge variant="outline">{category.score}</Badge>
              </div>
              <Progress value={category.progress} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Progress</span>
                <span>{category.progress}%</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full mt-2"
                onClick={() => handlePracticeMore(category.name)}
              >
                Practice More
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AssessmentProgress;
