import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils"; // Add the missing import

interface AssessmentProgressProps {
  assessments: {
    id: string;
    name: string;
    progress: number;
    dueDate?: string;
  }[];
}

export function AssessmentProgress({ assessments }: AssessmentProgressProps) {
  // Sort assessments by progress (ascending)
  const sortedAssessments = [...assessments].sort((a, b) => a.progress - b.progress);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-md">Assessment Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedAssessments.map((assessment) => (
            <div key={assessment.id} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{assessment.name}</span>
                <span 
                  className={cn(
                    "text-xs font-medium",
                    assessment.progress < 30 ? "text-destructive" :
                    assessment.progress < 70 ? "text-amber-500" :
                    "text-green-500"
                  )}
                >
                  {assessment.progress}%
                </span>
              </div>
              <Progress value={assessment.progress} className="h-2" />
              {assessment.dueDate && (
                <div className="text-xs text-muted-foreground text-right">
                  Due: {assessment.dueDate}
                </div>
              )}
            </div>
          ))}
          
          {assessments.length === 0 && (
            <div className="py-6 text-center text-muted-foreground">
              No assessments available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
