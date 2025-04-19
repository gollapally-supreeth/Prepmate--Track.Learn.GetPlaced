
import React, { useState } from 'react';
import { Plus, Pencil, Eye, Download, Copy, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import NewResumeDialog from './NewResumeDialog';

// Sample resume data - would come from API in real implementation
const mockResumes = [
  {
    id: '1',
    title: 'Software Engineer Resume',
    completion: 85,
    lastUpdated: new Date('2025-04-15'),
    atsScore: 92,
    templateId: 'modern',
  },
  {
    id: '2',
    title: 'Data Science Position',
    completion: 70,
    lastUpdated: new Date('2025-04-10'),
    atsScore: 78,
    templateId: 'minimal',
  },
  {
    id: '3',
    title: 'Full Stack Developer Application',
    completion: 95,
    lastUpdated: new Date('2025-04-18'),
    atsScore: 88,
    templateId: 'colorful',
  }
];

interface ResumeListProps {
  onEditResume: (id: string) => void;
}

const ResumeList: React.FC<ResumeListProps> = ({ onEditResume }) => {
  const [resumes, setResumes] = useState(mockResumes);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [resumeToDelete, setResumeToDelete] = useState<string | null>(null);
  const { toast } = useToast();
  
  const handleNewResume = (newResume: any) => {
    // In a real app, this would be an API call to create a new resume
    const newId = (resumes.length + 1).toString();
    setResumes([...resumes, { ...newResume, id: newId, lastUpdated: new Date(), completion: 0, atsScore: 0 }]);
    toast({
      title: "Resume created",
      description: `${newResume.title} has been created successfully.`,
    });
  };

  const handleDeleteClick = (id: string) => {
    setResumeToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (resumeToDelete) {
      setResumes(resumes.filter(resume => resume.id !== resumeToDelete));
      toast({
        title: "Resume deleted",
        description: "The resume has been deleted successfully.",
        variant: "destructive",
      });
      setDeleteDialogOpen(false);
      setResumeToDelete(null);
    }
  };

  const handleCloneResume = (id: string) => {
    const resumeToClone = resumes.find(resume => resume.id === id);
    if (resumeToClone) {
      const newId = (resumes.length + 1).toString();
      const clonedResume = {
        ...resumeToClone,
        id: newId,
        title: `${resumeToClone.title} (Copy)`,
        lastUpdated: new Date()
      };
      setResumes([...resumes, clonedResume]);
      toast({
        title: "Resume cloned",
        description: `A copy of ${resumeToClone.title} has been created.`,
      });
    }
  };

  const handleDownload = (id: string) => {
    // In a real app, this would be an API call to download the resume
    toast({
      title: "Downloading resume",
      description: "Your resume will be downloaded shortly.",
    });
  };

  const handlePreview = (id: string) => {
    // In a real app, this would open a preview modal
    toast({
      title: "Preview mode",
      description: "Opening resume preview...",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Resumes</h2>
        <NewResumeDialog onCreateResume={handleNewResume} />
      </div>

      {resumes.length === 0 ? (
        <div className="text-center py-12 border border-dashed rounded-lg">
          <h3 className="text-xl font-semibold mb-3">No resumes yet</h3>
          <p className="text-muted-foreground mb-6">Create your first resume to get started</p>
          <NewResumeDialog onCreateResume={handleNewResume}>
            <Button>
              <Plus className="mr-2" /> Create Resume
            </Button>
          </NewResumeDialog>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumes.map((resume) => (
            <Card key={resume.id} className="overflow-hidden">
              <CardHeader className="bg-muted/30 pb-2">
                <CardTitle className="truncate text-lg">{resume.title}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Last updated: {resume.lastUpdated.toLocaleDateString()}
                </p>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Completion</span>
                    <span className="font-medium">{resume.completion}%</span>
                  </div>
                  <Progress value={resume.completion} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>ATS Score</span>
                    <span className="font-medium">{resume.atsScore}/100</span>
                  </div>
                  <Progress 
                    value={resume.atsScore} 
                    className="h-2"
                    color={
                      resume.atsScore > 85 ? "bg-green-600" : 
                      resume.atsScore > 70 ? "bg-yellow-500" : "bg-red-500"
                    } 
                  />
                </div>

                <div className="bg-muted/30 px-3 py-2 rounded text-sm">
                  <p><strong>Template:</strong> {resume.templateId.charAt(0).toUpperCase() + resume.templateId.slice(1)}</p>
                </div>
              </CardContent>
              <CardFooter className="flex flex-wrap gap-2 border-t pt-4">
                <Button size="sm" variant="outline" onClick={() => onEditResume(resume.id)}>
                  <Pencil className="h-4 w-4 mr-1" /> Edit
                </Button>
                <Button size="sm" variant="outline" onClick={() => handlePreview(resume.id)}>
                  <Eye className="h-4 w-4 mr-1" /> View
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleDownload(resume.id)}>
                  <Download className="h-4 w-4 mr-1" /> PDF
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleCloneResume(resume.id)}>
                  <Copy className="h-4 w-4 mr-1" /> Clone
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="text-destructive hover:bg-destructive/10"
                  onClick={() => handleDeleteClick(resume.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to delete this resume?</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">
            This action cannot be undone. This will permanently delete your resume.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ResumeList;
