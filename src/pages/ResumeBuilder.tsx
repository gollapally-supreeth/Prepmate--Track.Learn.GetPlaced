
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ResumeList from '@/components/resume/ResumeList';
import ResumeEditor from '@/components/resume/ResumeEditor';
import { useToast } from '@/hooks/use-toast';

const ResumeBuilder = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [activeResumeId, setActiveResumeId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleEditResume = (id: string) => {
    setActiveResumeId(id);
    setActiveTab("editor");
  };

  const handleBackToDashboard = () => {
    setActiveResumeId(null);
    setActiveTab("dashboard");
    toast({
      title: "Resume saved",
      description: "All changes have been saved.",
    });
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Resume Builder</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="editor" disabled={!activeResumeId}>Editor</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="mt-0">
          <ResumeList onEditResume={handleEditResume} />
        </TabsContent>
        
        <TabsContent value="editor" className="mt-0">
          {activeResumeId && (
            <ResumeEditor 
              resumeId={activeResumeId}
              onBack={handleBackToDashboard}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResumeBuilder;
