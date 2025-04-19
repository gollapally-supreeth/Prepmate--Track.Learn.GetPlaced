
import React, { useState } from 'react';
import { ArrowLeft, FileText, Save, Download, MessageSquare, Share, Eye, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import ResumeForm from '@/components/resume/ResumeForm';
import ResumePreview from '@/components/resume/ResumePreview';
import ResumeAITools from '@/components/resume/ResumeAITools';
import ResumeStyleOptions from '@/components/resume/ResumeStyleOptions';

// Sample resume data - would come from API in real implementation
const mockResumeData = {
  id: '1',
  title: 'Software Engineer Resume',
  personal: {
    name: 'Alex Johnson',
    email: 'alex@example.com',
    phone: '(555) 123-4567',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/alexj',
    github: 'github.com/alexj',
    website: 'alexjohnson.dev',
  },
  education: [
    {
      id: 'edu1',
      institution: 'University of California, Berkeley',
      degree: 'Bachelor of Science in Computer Science',
      gpa: '3.8',
      startDate: '2020-09',
      endDate: '2024-05',
      description: 'Relevant coursework: Data Structures, Algorithms, Machine Learning, Web Development',
    },
  ],
  experience: [
    {
      id: 'exp1',
      company: 'Tech Innovations Inc.',
      position: 'Software Engineer Intern',
      startDate: '2023-05',
      endDate: '2023-08',
      description: 'Developed and maintained web applications using React and Node.js. Collaborated with a team of 5 engineers to deliver features on time.',
      achievements: [
        'Implemented a new feature that increased user engagement by 25%',
        'Optimized database queries resulting in 30% faster load times',
        'Built automated testing tools that reduced QA time by 15%',
      ],
    },
    {
      id: 'exp2',
      company: 'StartupXYZ',
      position: 'Web Developer (Part-time)',
      startDate: '2022-06',
      endDate: '2023-04',
      description: 'Maintained company website and developed new features.',
      achievements: [
        'Redesigned the company website resulting in 40% increase in leads',
        'Integrated payment processing system with Stripe API',
      ],
    },
  ],
  projects: [
    {
      id: 'proj1',
      title: 'E-commerce Platform',
      duration: 'Jan 2023 - Apr 2023',
      description: 'Built a full-stack e-commerce platform with React, Node.js, and MongoDB.',
      technologies: ['React', 'Node.js', 'MongoDB', 'Express', 'Redux'],
      link: 'github.com/alexj/ecommerce',
    },
    {
      id: 'proj2',
      title: 'Machine Learning Image Classifier',
      duration: 'Sep 2022 - Dec 2022',
      description: 'Developed an image classification model using TensorFlow and Python.',
      technologies: ['Python', 'TensorFlow', 'Keras', 'NumPy'],
      link: 'github.com/alexj/image-classifier',
    },
  ],
  skills: {
    technical: ['JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'Git', 'AWS', 'Docker'],
    soft: ['Communication', 'Problem Solving', 'Teamwork', 'Leadership'],
  },
  certifications: [
    {
      id: 'cert1',
      name: 'AWS Certified Developer',
      issuer: 'Amazon Web Services',
      date: '2023-06',
      link: 'verify.aws.com/12345',
    },
  ],
  languages: [
    { language: 'English', proficiency: 'Native' },
    { language: 'Spanish', proficiency: 'Intermediate' },
  ],
  style: {
    template: 'modern',
    primaryColor: '#1a73e8',
    fontSize: 'medium',
    spacing: 'default',
  },
};

interface ResumeEditorProps {
  resumeId: string;
  onBack: () => void;
}

const ResumeEditor: React.FC<ResumeEditorProps> = ({ resumeId, onBack }) => {
  const [resumeData, setResumeData] = useState(mockResumeData);
  const [activeTab, setActiveTab] = useState('form');
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const handleSaveResume = () => {
    // In a real app, this would be an API call to save the resume
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast({
        title: "Resume saved",
        description: "All changes have been saved successfully.",
      });
    }, 800);
  };

  const handleFormChange = (sectionName: string, data: any) => {
    setResumeData({
      ...resumeData,
      [sectionName]: data,
    });
  };

  const handleStyleChange = (styleData: any) => {
    setResumeData({
      ...resumeData,
      style: {
        ...resumeData.style,
        ...styleData,
      },
    });
  };

  const handleDownload = () => {
    toast({
      title: "Downloading resume",
      description: "Your resume will be downloaded as PDF shortly.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          <h2 className="text-2xl font-semibold">{resumeData.title}</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleSaveResume} disabled={saving}>
            {saving ? "Saving..." : (
              <>
                <Save className="h-4 w-4 mr-1" /> Save
              </>
            )}
          </Button>
          <Button size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-1" /> Download
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="form">
            <FileText className="h-4 w-4 mr-2" /> Edit
          </TabsTrigger>
          <TabsTrigger value="style">
            <Code className="h-4 w-4 mr-2" /> Customize
          </TabsTrigger>
          <TabsTrigger value="ai">
            <MessageSquare className="h-4 w-4 mr-2" /> AI Tools
          </TabsTrigger>
          <TabsTrigger value="preview">
            <Eye className="h-4 w-4 mr-2" /> Preview
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="form" className="mt-0 space-y-4">
          <ResumeForm data={resumeData} onChange={handleFormChange} />
        </TabsContent>
        
        <TabsContent value="style" className="mt-0 space-y-4">
          <ResumeStyleOptions style={resumeData.style} onChange={handleStyleChange} />
        </TabsContent>
        
        <TabsContent value="ai" className="mt-0 space-y-4">
          <ResumeAITools resumeData={resumeData} onUpdate={(updatedData) => setResumeData(updatedData)} />
        </TabsContent>
        
        <TabsContent value="preview" className="mt-0 space-y-4">
          <ResumePreview data={resumeData} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResumeEditor;
