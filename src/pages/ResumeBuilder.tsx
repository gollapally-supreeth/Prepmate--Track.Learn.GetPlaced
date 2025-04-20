
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ResumeList from '@/components/resume/ResumeList';
import ResumeEditor from '@/components/resume/ResumeEditor';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { FileText, List } from 'lucide-react';

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
    <motion.div 
      className="container mx-auto py-6 space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <FileText className="h-5 w-5 text-primary" />
        </div>
        <h1 className="text-3xl font-bold gradient-heading">Resume Builder</h1>
      </div>
      
      <p className="text-muted-foreground max-w-2xl">
        Create and customize professional resumes tailored for different job roles and companies.
      </p>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <List size={16} />
            <span>Resume Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="editor" disabled={!activeResumeId} className="flex items-center gap-2">
            <FileText size={16} />
            <span>Resume Editor</span>
          </TabsTrigger>
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
    </motion.div>
  );
};

export default ResumeBuilder;
