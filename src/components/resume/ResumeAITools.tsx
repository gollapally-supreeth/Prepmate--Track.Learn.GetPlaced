
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { MessageSquare, Wand, FileCheck, Upload, ArrowRight, Check } from 'lucide-react';

interface ResumeAIToolsProps {
  resumeData: any;
  onUpdate: (updatedData: any) => void;
}

const ResumeAITools: React.FC<ResumeAIToolsProps> = ({ resumeData, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('enhance');
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [jobDescription, setJobDescription] = useState('');
  const [bulletPoint, setBulletPoint] = useState('');
  const [enhancedBulletPoint, setEnhancedBulletPoint] = useState('');
  const [atsScore, setAtsScore] = useState<null | number>(null);
  const [atsReport, setAtsReport] = useState<any>(null);
  const [coverLetter, setCoverLetter] = useState('');
  const { toast } = useToast();

  const simulateAIRequest = (endpoint: string, duration: number = 1500) => {
    return new Promise((resolve) => {
      setLoading({ ...loading, [endpoint]: true });
      setTimeout(() => {
        setLoading({ ...loading, [endpoint]: false });
        resolve(null);
      }, duration);
    });
  };

  const handleEnhanceBulletPoint = async () => {
    if (!bulletPoint.trim()) {
      toast({
        title: "Empty field",
        description: "Please enter a bullet point to enhance.",
        variant: "destructive",
      });
      return;
    }
    
    await simulateAIRequest('enhanceBullet');
    
    // Simulated AI response
    const enhanced = `Engineered and deployed a high-performance microservice architecture that reduced server load by 40% while increasing request throughput by 25%, resulting in improved user experience and lower infrastructure costs.`;
    setEnhancedBulletPoint(enhanced);
    
    toast({
      title: "Bullet point enhanced",
      description: "Your bullet point has been professionally rewritten.",
    });
  };

  const handleGenerateSummary = async () => {
    await simulateAIRequest('generateSummary');
    
    // Update the resume data with the AI-generated summary
    const updatedData = {
      ...resumeData,
      personal: {
        ...resumeData.personal,
        summary: "Results-driven software engineer with over 2 years of experience in full-stack development, specializing in React.js and Node.js. Proven track record of delivering high-quality web applications with a focus on performance optimization and user experience. Seeking to leverage technical expertise and creative problem-solving skills in a challenging software development role."
      }
    };
    
    onUpdate(updatedData);
    
    toast({
      title: "Summary generated",
      description: "A professional summary has been added to your resume.",
    });
  };

  const handleATSCheck = async () => {
    await simulateAIRequest('atsCheck', 2000);
    
    // Simulated ATS report
    const score = 78;
    setAtsScore(score);
    setAtsReport({
      formatting: {
        status: 'good',
        message: 'Resume format is ATS-friendly',
      },
      keywords: {
        status: 'warning',
        message: 'Missing key skills: Docker, CI/CD, TypeScript',
        suggestions: ['Docker', 'CI/CD', 'TypeScript'],
      },
      content: {
        status: 'warning',
        message: 'Work experience bullet points could be more achievement-oriented',
      },
      sections: {
        status: 'error',
        message: 'Missing "Summary" section at the top of resume',
      },
    });
    
    toast({
      title: "ATS Check Complete",
      description: "Your resume has been analyzed for ATS compatibility.",
    });
  };

  const handleAnalyzeJobDescription = async () => {
    if (!jobDescription.trim()) {
      toast({
        title: "Empty field",
        description: "Please enter a job description to analyze.",
        variant: "destructive",
      });
      return;
    }
    
    await simulateAIRequest('analyzeJob', 2500);
    
    // Simulated keywords
    const keywords = [
      'React.js', 'Node.js', 'TypeScript', 'REST API', 
      'Redux', 'AWS', 'CI/CD', 'Docker', 'Kubernetes',
      'Agile', 'Team leadership'
    ];
    
    const updatedReport = {
      ...atsReport,
      jobMatch: {
        keywords,
        matchPercentage: 65,
        missingKeywords: ['TypeScript', 'CI/CD', 'Docker', 'Kubernetes'],
      }
    };
    
    setAtsReport(updatedReport);
    
    toast({
      title: "Job Description Analyzed",
      description: "Keywords extracted and match analysis complete.",
    });
  };

  const handleGenerateCoverLetter = async () => {
    if (!jobDescription.trim()) {
      toast({
        title: "Missing job description",
        description: "Please enter a job description first.",
        variant: "destructive",
      });
      return;
    }
    
    await simulateAIRequest('generateCoverLetter', 3000);
    
    // Simulated cover letter
    setCoverLetter(`Dear Hiring Manager,

I am writing to express my interest in the Software Engineer position at TechCorp as advertised. With over 2 years of experience in full-stack development using React.js and Node.js, I am confident in my ability to contribute effectively to your team.

My experience aligns well with the requirements outlined in your job description. At Tech Innovations Inc., I developed and maintained web applications that improved user engagement by 25% and optimized database queries resulting in 30% faster load times. Additionally, my work at StartupXYZ allowed me to gain valuable experience in payment integration systems.

I am particularly drawn to TechCorp's mission to create innovative solutions that solve real-world problems. Your focus on cutting-edge technologies and collaborative work environment is exactly what I am looking for in my next role.

I would welcome the opportunity to discuss how my skills and experiences can benefit TechCorp. Thank you for considering my application.

Sincerely,
Alex Johnson`);
    
    toast({
      title: "Cover Letter Generated",
      description: "Your personalized cover letter is ready.",
    });
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="enhance">
            <Wand className="h-4 w-4 mr-2" /> Enhance Content
          </TabsTrigger>
          <TabsTrigger value="ats">
            <FileCheck className="h-4 w-4 mr-2" /> ATS Check
          </TabsTrigger>
          <TabsTrigger value="job">
            <Upload className="h-4 w-4 mr-2" /> Job Matcher
          </TabsTrigger>
          <TabsTrigger value="cover">
            <MessageSquare className="h-4 w-4 mr-2" /> Cover Letter
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="enhance" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Generate Professional Summary</CardTitle>
                <CardDescription>
                  Create a compelling professional summary based on your experience
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Our AI will analyze your work experience and education to generate a tailored professional summary.
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleGenerateSummary} 
                  disabled={loading['generateSummary']}
                  className="w-full"
                >
                  {loading['generateSummary'] ? 'Generating...' : 'Generate Summary'}
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Enhance Bullet Points</CardTitle>
                <CardDescription>
                  Transform basic statements into powerful achievements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bullet-point">Enter a bullet point</Label>
                  <Textarea
                    id="bullet-point"
                    placeholder="e.g., Built a microservice architecture that improved performance"
                    value={bulletPoint}
                    onChange={(e) => setBulletPoint(e.target.value)}
                    rows={2}
                  />
                </div>
                
                {enhancedBulletPoint && (
                  <div className="space-y-2 pt-2">
                    <Label htmlFor="enhanced-bullet">Enhanced version:</Label>
                    <div className="p-3 bg-muted/50 rounded-md border text-sm">
                      {enhancedBulletPoint}
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleEnhanceBulletPoint} 
                  disabled={loading['enhanceBullet']} 
                  className="w-full"
                >
                  {loading['enhanceBullet'] ? 'Enhancing...' : 'Enhance Bullet Point'}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="ats" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>ATS Compatibility Check</CardTitle>
              <CardDescription>
                Analyze your resume for ATS (Applicant Tracking System) compatibility
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Our AI will scan your resume for potential issues that might prevent it from passing through ATS filters.
              </p>
              
              {atsScore !== null && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label>ATS Score</Label>
                      <span className="font-medium">{atsScore}/100</span>
                    </div>
                    <Progress 
                      value={atsScore} 
                      className="h-2"
                      style={{
                        backgroundColor: atsScore > 85 ? "#22c55e" : 
                                        atsScore > 70 ? "#eab308" : "#ef4444"
                      }}
                    />
                  </div>
                  
                  <div className="space-y-3 mt-4">
                    <h4 className="font-medium">Analysis:</h4>
                    
                    <div className="space-y-2">
                      {Object.entries(atsReport).map(([key, value]: [string, any]) => (
                        <div key={key} className="flex items-start gap-2 p-2 border rounded-md">
                          <div className={`rounded-full w-3 h-3 mt-1 
                            ${value.status === 'good' ? 'bg-green-500' : 
                              value.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'}`} 
                          />
                          <div>
                            <p className="font-medium capitalize">{key}</p>
                            <p className="text-sm text-muted-foreground">{value.message}</p>
                            {value.suggestions && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {value.suggestions.map((suggestion: string) => (
                                  <Badge key={suggestion} variant="outline">{suggestion}</Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleATSCheck} 
                disabled={loading['atsCheck']} 
                className="w-full"
              >
                {loading['atsCheck'] ? 'Checking...' : 'Check ATS Compatibility'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="job" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Job Description Analyzer</CardTitle>
              <CardDescription>
                Compare your resume with a job description to find keyword matches
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="job-description">Paste job description</Label>
                <Textarea
                  id="job-description"
                  placeholder="Paste the job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={5}
                />
              </div>
              
              {atsReport?.jobMatch && (
                <div className="space-y-4 mt-4 pt-4 border-t">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label>Resume-Job Match</Label>
                      <span className="font-medium">{atsReport.jobMatch.matchPercentage}%</span>
                    </div>
                    <Progress 
                      value={atsReport.jobMatch.matchPercentage}
                      className="h-2" 
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium mb-2">Keywords Found in Job Description:</h4>
                      <div className="flex flex-wrap gap-2">
                        {atsReport.jobMatch.keywords.map((keyword: string) => (
                          <Badge 
                            key={keyword} 
                            variant={atsReport.jobMatch.missingKeywords.includes(keyword) ? "outline" : "default"}
                            className={!atsReport.jobMatch.missingKeywords.includes(keyword) ? "bg-green-100 text-green-800 hover:bg-green-200" : ""}
                          >
                            {keyword}
                            {!atsReport.jobMatch.missingKeywords.includes(keyword) && (
                              <Check className="ml-1 h-3 w-3" />
                            )}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-destructive mb-2">Missing Keywords:</h4>
                      <div className="flex flex-wrap gap-2">
                        {atsReport.jobMatch.missingKeywords.map((keyword: string) => (
                          <Badge key={keyword} variant="outline" className="text-destructive">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleAnalyzeJobDescription}
                disabled={loading['analyzeJob']} 
                className="w-full"
              >
                {loading['analyzeJob'] ? 'Analyzing...' : 'Analyze Job Description'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="cover" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Cover Letter Generator</CardTitle>
              <CardDescription>
                Create a personalized cover letter based on your resume and job description
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Enter a job description to generate a tailored cover letter. For best results, use the same job description you analyzed in the Job Matcher tab.
              </p>
              
              <div className="space-y-2">
                <Label htmlFor="job-description-cover">Job Description</Label>
                <Textarea
                  id="job-description-cover"
                  placeholder="Paste the job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={4}
                />
              </div>
              
              {coverLetter && (
                <div className="space-y-2 mt-4 pt-4 border-t">
                  <h4 className="font-medium">Generated Cover Letter:</h4>
                  <div className="p-4 bg-muted/30 rounded-md border whitespace-pre-line">
                    {coverLetter}
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleGenerateCoverLetter} 
                disabled={loading['generateCoverLetter']} 
                className="w-full"
              >
                {loading['generateCoverLetter'] ? 'Generating...' : 'Generate Cover Letter'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResumeAITools;
