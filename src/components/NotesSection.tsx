import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Circle, CheckCircle, BookText } from 'lucide-react';

const NotesSection: React.FC = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <div className="space-y-1">
          <CardTitle className="text-lg font-semibold">Notes</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Your recent notes and summaries
          </CardDescription>
        </div>
        <Badge variant="outline">Note</Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center">
            <Circle className="mr-2 h-4 w-4 text-yellow-500" fill="yellow" />
            <div>
              <h3 className="text-sm font-medium">Data Structures and Algorithms</h3>
              <p className="text-xs text-muted-foreground">Last edited: July 14, 2023</p>
            </div>
          </div>
          <div className="flex items-center">
            <CheckCircle className="mr-2 h-4 w-4 text-green-500" fill="green" />
            <div>
              <h3 className="text-sm font-medium">System Design Basics</h3>
              <p className="text-xs text-muted-foreground">Completed: July 10, 2023</p>
            </div>
          </div>
          <div className="flex items-center">
            <BookText className="mr-2 h-4 w-4 text-blue-500" fill="blue" />
            <div>
              <h3 className="text-sm font-medium">Behavioral Interview Prep</h3>
              <p className="text-xs text-muted-foreground">Created: July 5, 2023</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotesSection;
