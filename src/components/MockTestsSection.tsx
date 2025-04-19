import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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

const MockTestsSection: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mock Tests</CardTitle>
        <CardDescription>Practice with mock tests to assess your skills</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Code className="h-5 w-5 text-primary" />
                </div>
                <span className="font-medium text-sm">DSA Mock Test</span>
              </div>
              <Badge variant="outline">Test</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Test your data structures and algorithms knowledge.
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Layers className="h-5 w-5 text-primary" />
                </div>
                <span className="font-medium text-sm">System Design Mock</span>
              </div>
              <Badge variant="outline">Test</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Evaluate your system design skills with real-world scenarios.
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Database className="h-5 w-5 text-primary" />
                </div>
                <span className="font-medium text-sm">Database Mock Test</span>
              </div>
              <Badge variant="outline">Test</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Assess your database concepts and SQL skills.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MockTestsSection;
