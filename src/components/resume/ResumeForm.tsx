
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';

interface ResumeFormProps {
  data: any;
  onChange: (section: string, data: any) => void;
}

const ResumeForm: React.FC<ResumeFormProps> = ({ data, onChange }) => {
  const handlePersonalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onChange('personal', { ...data.personal, [name]: value });
  };

  const handleEducationChange = (index: number, field: string, value: string) => {
    const updatedEducation = [...data.education];
    updatedEducation[index] = {
      ...updatedEducation[index],
      [field]: value,
    };
    onChange('education', updatedEducation);
  };

  const addEducation = () => {
    const newEducation = {
      id: `edu${Date.now()}`,
      institution: '',
      degree: '',
      gpa: '',
      startDate: '',
      endDate: '',
      description: '',
    };
    onChange('education', [...data.education, newEducation]);
  };

  const removeEducation = (index: number) => {
    const updatedEducation = [...data.education];
    updatedEducation.splice(index, 1);
    onChange('education', updatedEducation);
  };

  const handleExperienceChange = (index: number, field: string, value: string | string[]) => {
    const updatedExperience = [...data.experience];
    updatedExperience[index] = {
      ...updatedExperience[index],
      [field]: value,
    };
    onChange('experience', updatedExperience);
  };

  const addExperience = () => {
    const newExperience = {
      id: `exp${Date.now()}`,
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      description: '',
      achievements: [''],
    };
    onChange('experience', [...data.experience, newExperience]);
  };

  const removeExperience = (index: number) => {
    const updatedExperience = [...data.experience];
    updatedExperience.splice(index, 1);
    onChange('experience', updatedExperience);
  };

  const handleAchievementChange = (expIndex: number, achIndex: number, value: string) => {
    const updatedExperience = [...data.experience];
    const achievements = [...updatedExperience[expIndex].achievements];
    achievements[achIndex] = value;
    updatedExperience[expIndex].achievements = achievements;
    onChange('experience', updatedExperience);
  };

  const addAchievement = (expIndex: number) => {
    const updatedExperience = [...data.experience];
    updatedExperience[expIndex].achievements.push('');
    onChange('experience', updatedExperience);
  };

  const removeAchievement = (expIndex: number, achIndex: number) => {
    const updatedExperience = [...data.experience];
    updatedExperience[expIndex].achievements.splice(achIndex, 1);
    onChange('experience', updatedExperience);
  };

  const handleProjectChange = (index: number, field: string, value: string | string[]) => {
    const updatedProjects = [...data.projects];
    
    if (field === 'technologies' && typeof value === 'string') {
      updatedProjects[index] = {
        ...updatedProjects[index],
        [field]: value.split(',').map((tech: string) => tech.trim()),
      };
    } else {
      updatedProjects[index] = {
        ...updatedProjects[index],
        [field]: value,
      };
    }
    onChange('projects', updatedProjects);
  };

  const addProject = () => {
    const newProject = {
      id: `proj${Date.now()}`,
      title: '',
      duration: '',
      description: '',
      technologies: [],
      link: '',
    };
    onChange('projects', [...data.projects, newProject]);
  };

  const removeProject = (index: number) => {
    const updatedProjects = [...data.projects];
    updatedProjects.splice(index, 1);
    onChange('projects', updatedProjects);
  };

  const handleSkillsChange = (category: 'technical' | 'soft', value: string) => {
    const skills = value.split(',').map(skill => skill.trim());
    onChange('skills', {
      ...data.skills,
      [category]: skills,
    });
  };

  return (
    <Accordion type="multiple" defaultValue={['personal', 'education', 'experience']} className="w-full">
      <AccordionItem value="personal" className="border rounded-lg mb-4 shadow-sm">
        <AccordionTrigger className="px-4">Personal Information</AccordionTrigger>
        <AccordionContent className="px-4 pb-4 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                name="name" 
                value={data.personal.name} 
                onChange={handlePersonalChange} 
                placeholder="John Doe" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                name="email" 
                value={data.personal.email} 
                onChange={handlePersonalChange} 
                placeholder="john.doe@example.com" 
                type="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input 
                id="phone" 
                name="phone" 
                value={data.personal.phone} 
                onChange={handlePersonalChange} 
                placeholder="(123) 456-7890" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input 
                id="location" 
                name="location" 
                value={data.personal.location} 
                onChange={handlePersonalChange} 
                placeholder="City, State" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input 
                id="linkedin" 
                name="linkedin" 
                value={data.personal.linkedin} 
                onChange={handlePersonalChange} 
                placeholder="linkedin.com/in/username" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="github">GitHub</Label>
              <Input 
                id="github" 
                name="github" 
                value={data.personal.github} 
                onChange={handlePersonalChange} 
                placeholder="github.com/username" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website/Portfolio</Label>
              <Input 
                id="website" 
                name="website" 
                value={data.personal.website} 
                onChange={handlePersonalChange} 
                placeholder="yourwebsite.com" 
              />
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="education" className="border rounded-lg mb-4 shadow-sm">
        <AccordionTrigger className="px-4">Education</AccordionTrigger>
        <AccordionContent className="px-4 pb-4 pt-2">
          {data.education.map((edu: any, index: number) => (
            <Card key={edu.id} className="mb-4 p-4 relative">
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 text-destructive hover:bg-destructive/10 h-8 w-8 p-0"
                onClick={() => removeEducation(index)}
                disabled={data.education.length === 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor={`edu-institution-${index}`}>Institution</Label>
                  <Input
                    id={`edu-institution-${index}`}
                    value={edu.institution}
                    onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                    placeholder="University name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`edu-degree-${index}`}>Degree</Label>
                  <Input
                    id={`edu-degree-${index}`}
                    value={edu.degree}
                    onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                    placeholder="Bachelor of Science in Computer Science"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`edu-gpa-${index}`}>GPA</Label>
                  <Input
                    id={`edu-gpa-${index}`}
                    value={edu.gpa}
                    onChange={(e) => handleEducationChange(index, 'gpa', e.target.value)}
                    placeholder="3.8"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor={`edu-startDate-${index}`}>Start Date</Label>
                    <Input
                      id={`edu-startDate-${index}`}
                      type="month"
                      value={edu.startDate}
                      onChange={(e) => handleEducationChange(index, 'startDate', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`edu-endDate-${index}`}>End Date</Label>
                    <Input
                      id={`edu-endDate-${index}`}
                      type="month"
                      value={edu.endDate}
                      onChange={(e) => handleEducationChange(index, 'endDate', e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor={`edu-description-${index}`}>Description</Label>
                  <Textarea
                    id={`edu-description-${index}`}
                    value={edu.description}
                    onChange={(e) => handleEducationChange(index, 'description', e.target.value)}
                    placeholder="Relevant coursework, honors, etc."
                    rows={2}
                  />
                </div>
              </div>
            </Card>
          ))}
          <Button variant="outline" onClick={addEducation} className="w-full">
            <Plus className="mr-2 h-4 w-4" /> Add Education
          </Button>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="experience" className="border rounded-lg mb-4 shadow-sm">
        <AccordionTrigger className="px-4">Work Experience</AccordionTrigger>
        <AccordionContent className="px-4 pb-4 pt-2">
          {data.experience.map((exp: any, index: number) => (
            <Card key={exp.id} className="mb-4 p-4 relative">
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 text-destructive hover:bg-destructive/10 h-8 w-8 p-0"
                onClick={() => removeExperience(index)}
                disabled={data.experience.length === 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor={`exp-company-${index}`}>Company</Label>
                  <Input
                    id={`exp-company-${index}`}
                    value={exp.company}
                    onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                    placeholder="Company name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`exp-position-${index}`}>Position</Label>
                  <Input
                    id={`exp-position-${index}`}
                    value={exp.position}
                    onChange={(e) => handleExperienceChange(index, 'position', e.target.value)}
                    placeholder="Job title"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor={`exp-startDate-${index}`}>Start Date</Label>
                    <Input
                      id={`exp-startDate-${index}`}
                      type="month"
                      value={exp.startDate}
                      onChange={(e) => handleExperienceChange(index, 'startDate', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`exp-endDate-${index}`}>End Date</Label>
                    <Input
                      id={`exp-endDate-${index}`}
                      type="month"
                      value={exp.endDate}
                      onChange={(e) => handleExperienceChange(index, 'endDate', e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor={`exp-description-${index}`}>Description</Label>
                  <Textarea
                    id={`exp-description-${index}`}
                    value={exp.description}
                    onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                    placeholder="Brief description of your role"
                    rows={2}
                  />
                </div>
                
                <div className="space-y-3 md:col-span-2">
                  <div className="flex items-center justify-between">
                    <Label>Key Achievements</Label>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => addAchievement(index)}
                      className="h-7 px-2"
                    >
                      <Plus className="h-3 w-3 mr-1" /> Add
                    </Button>
                  </div>
                  
                  {exp.achievements.map((achievement: string, achIndex: number) => (
                    <div key={achIndex} className="flex items-center gap-2">
                      <Input
                        value={achievement}
                        onChange={(e) => handleAchievementChange(index, achIndex, e.target.value)}
                        placeholder="Describe a key achievement or responsibility"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAchievement(index, achIndex)}
                        disabled={exp.achievements.length === 1}
                        className="text-destructive hover:bg-destructive/10 h-9 w-9 p-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
          <Button variant="outline" onClick={addExperience} className="w-full">
            <Plus className="mr-2 h-4 w-4" /> Add Experience
          </Button>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="projects" className="border rounded-lg mb-4 shadow-sm">
        <AccordionTrigger className="px-4">Projects</AccordionTrigger>
        <AccordionContent className="px-4 pb-4 pt-2">
          {data.projects.map((project: any, index: number) => (
            <Card key={project.id} className="mb-4 p-4 relative">
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 text-destructive hover:bg-destructive/10 h-8 w-8 p-0"
                onClick={() => removeProject(index)}
                disabled={data.projects.length === 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor={`proj-title-${index}`}>Project Title</Label>
                  <Input
                    id={`proj-title-${index}`}
                    value={project.title}
                    onChange={(e) => handleProjectChange(index, 'title', e.target.value)}
                    placeholder="Project name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`proj-duration-${index}`}>Duration</Label>
                  <Input
                    id={`proj-duration-${index}`}
                    value={project.duration}
                    onChange={(e) => handleProjectChange(index, 'duration', e.target.value)}
                    placeholder="Jan 2023 - Mar 2023"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor={`proj-description-${index}`}>Description</Label>
                  <Textarea
                    id={`proj-description-${index}`}
                    value={project.description}
                    onChange={(e) => handleProjectChange(index, 'description', e.target.value)}
                    placeholder="Brief description of your project"
                    rows={2}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor={`proj-technologies-${index}`}>Technologies</Label>
                  <Input
                    id={`proj-technologies-${index}`}
                    value={project.technologies ? project.technologies.join(', ') : ''}
                    onChange={(e) => handleProjectChange(index, 'technologies', e.target.value)}
                    placeholder="React, Node.js, MongoDB, etc."
                  />
                  <p className="text-xs text-muted-foreground mt-1">Separate technologies with commas</p>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor={`proj-link-${index}`}>Project Link</Label>
                  <Input
                    id={`proj-link-${index}`}
                    value={project.link}
                    onChange={(e) => handleProjectChange(index, 'link', e.target.value)}
                    placeholder="github.com/username/project"
                  />
                </div>
              </div>
            </Card>
          ))}
          <Button variant="outline" onClick={addProject} className="w-full">
            <Plus className="mr-2 h-4 w-4" /> Add Project
          </Button>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="skills" className="border rounded-lg mb-4 shadow-sm">
        <AccordionTrigger className="px-4">Skills</AccordionTrigger>
        <AccordionContent className="px-4 pb-4 pt-2">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="technical-skills">Technical Skills</Label>
              <Textarea
                id="technical-skills"
                value={data.skills.technical ? data.skills.technical.join(', ') : ''}
                onChange={(e) => handleSkillsChange('technical', e.target.value)}
                placeholder="JavaScript, React, Node.js, Python, etc."
                rows={2}
              />
              <p className="text-xs text-muted-foreground">Separate skills with commas</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="soft-skills">Soft Skills</Label>
              <Textarea
                id="soft-skills"
                value={data.skills.soft ? data.skills.soft.join(', ') : ''}
                onChange={(e) => handleSkillsChange('soft', e.target.value)}
                placeholder="Communication, Teamwork, Problem-solving, etc."
                rows={2}
              />
              <p className="text-xs text-muted-foreground">Separate skills with commas</p>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default ResumeForm;
