
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Download, Share, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ResumePreviewProps {
  data: any;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ data }) => {
  const [viewMode, setViewMode] = useState<'normal' | 'recruiter'>('normal');
  const { toast } = useToast();

  const handleDownload = () => {
    toast({
      title: "Downloading resume",
      description: "Your resume will be downloaded as PDF shortly.",
    });
  };

  const handleShare = () => {
    toast({
      title: "Share link generated",
      description: "A shareable link has been copied to your clipboard.",
    });
  };

  const getTemplateStyles = () => {
    const baseStyles = {
      fontFamily: "'Inter', sans-serif",
      fontSize: data.style?.fontSize === 'small' ? '0.9rem' : 
                data.style?.fontSize === 'large' ? '1.1rem' : '1rem',
      lineHeight: data.style?.spacing === 'compact' ? '1.4' : 
                  data.style?.spacing === 'relaxed' ? '1.8' : '1.6',
    };
    
    const colorAccent = data.style?.primaryColor || '#1a73e8';
    
    switch(data.style?.template) {
      case 'minimal':
        return {
          ...baseStyles,
          colorAccent,
          headerStyle: 'border-b border-gray-200 pb-4',
          sectionStyle: 'mt-4',
          headingStyle: `font-semibold text-lg ${colorAccent === '#202124' ? 'text-gray-800' : `text-[${colorAccent}]`}`,
          subheadingStyle: 'font-medium',
        };
      case 'colorful':
        return {
          ...baseStyles,
          colorAccent,
          headerStyle: `bg-[${colorAccent}]/10 p-6 rounded-t`,
          sectionStyle: 'mt-6',
          headingStyle: `font-bold text-lg text-[${colorAccent}]`,
          subheadingStyle: 'font-semibold',
        };
      case 'professional':
        return {
          ...baseStyles,
          colorAccent,
          headerStyle: 'pb-4 mb-4 border-b-2',
          sectionStyle: 'mt-5',
          headingStyle: 'font-bold text-lg uppercase tracking-wider',
          subheadingStyle: 'font-semibold',
        };
      case 'creative':
        return {
          ...baseStyles,
          colorAccent,
          headerStyle: 'pb-4',
          sectionStyle: 'mt-6',
          headingStyle: `font-extrabold text-xl text-[${colorAccent}]`,
          subheadingStyle: 'font-bold',
        };
      case 'modern':
      default:
        return {
          ...baseStyles,
          colorAccent,
          headerStyle: 'pb-4',
          sectionStyle: 'mt-5',
          headingStyle: `font-semibold text-lg text-[${colorAccent}]`,
          subheadingStyle: 'font-medium',
        };
    }
  };
  
  const styles = getTemplateStyles();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button 
            variant={viewMode === 'normal' ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode('normal')}
          >
            <Eye className="h-4 w-4 mr-2" /> Normal View
          </Button>
          <Button 
            variant={viewMode === 'recruiter' ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode('recruiter')}
          >
            <Eye className="h-4 w-4 mr-2" /> Recruiter View
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share className="h-4 w-4 mr-2" /> Share
          </Button>
          <Button size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" /> Download PDF
          </Button>
        </div>
      </div>
      
      <Card className="p-6 shadow-lg max-w-4xl mx-auto bg-white border">
        <div className="relative" style={{ fontFamily: styles.fontFamily, fontSize: styles.fontSize, lineHeight: styles.lineHeight }}>
          {/* Header Section */}
          <header className={styles.headerStyle}>
            <h1 className="text-2xl font-bold mb-1" style={{ color: styles.colorAccent }}>{data.personal.name}</h1>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
              {data.personal.email && <div>{data.personal.email}</div>}
              {data.personal.phone && <div>{data.personal.phone}</div>}
              {data.personal.location && <div>{data.personal.location}</div>}
              {data.personal.linkedin && <div>LinkedIn: {data.personal.linkedin}</div>}
              {data.personal.github && <div>GitHub: {data.personal.github}</div>}
              {data.personal.website && <div>Website: {data.personal.website}</div>}
            </div>
            
            {data.personal.summary && (
              <div className="mt-3">
                <p>{data.personal.summary}</p>
                
                {viewMode === 'recruiter' && (
                  <Badge className="ml-2 mt-1" variant="outline">Good summary</Badge>
                )}
              </div>
            )}
          </header>
          
          {/* Education Section */}
          <section className={styles.sectionStyle}>
            <h2 className={styles.headingStyle}>Education</h2>
            <div className="space-y-3 mt-2">
              {data.education.map((edu: any) => (
                <div key={edu.id} className="relative">
                  <div className="flex justify-between">
                    <h3 className={`${styles.subheadingStyle}`}>{edu.institution}</h3>
                    <div className="text-sm">
                      {edu.startDate && edu.endDate ? (
                        `${new Date(edu.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - ${new Date(edu.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`
                      ) : null}
                    </div>
                  </div>
                  <div>{edu.degree}{edu.gpa ? ` • GPA: ${edu.gpa}` : ''}</div>
                  {edu.description && <div className="text-sm mt-1">{edu.description}</div>}
                  
                  {viewMode === 'recruiter' && (
                    <Badge className="absolute top-0 -right-4" variant="outline">✓</Badge>
                  )}
                </div>
              ))}
            </div>
          </section>
          
          {/* Experience Section */}
          <section className={styles.sectionStyle}>
            <h2 className={styles.headingStyle}>Experience</h2>
            <div className="space-y-4 mt-2">
              {data.experience.map((exp: any) => (
                <div key={exp.id} className="relative">
                  <div className="flex justify-between">
                    <h3 className={`${styles.subheadingStyle}`}>{exp.company}</h3>
                    <div className="text-sm">
                      {exp.startDate && exp.endDate ? (
                        `${new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - ${new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`
                      ) : null}
                    </div>
                  </div>
                  <div className="font-medium">{exp.position}</div>
                  {exp.description && <div className="text-sm mt-1">{exp.description}</div>}
                  {exp.achievements && exp.achievements.length > 0 && (
                    <ul className="list-disc list-outside ml-4 space-y-1 mt-2 text-sm">
                      {exp.achievements.map((achievement: string, i: number) => (
                        <li key={i} className="relative pl-1">
                          {achievement}
                          {viewMode === 'recruiter' && i === 0 && (
                            <Badge className="ml-2" variant="secondary">Strong achievement</Badge>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                  
                  {viewMode === 'recruiter' && (
                    <Badge className="absolute top-0 -right-4" variant="outline">✓</Badge>
                  )}
                </div>
              ))}
            </div>
          </section>
          
          {/* Projects Section */}
          <section className={styles.sectionStyle}>
            <h2 className={styles.headingStyle}>Projects</h2>
            <div className="space-y-3 mt-2">
              {data.projects.map((project: any) => (
                <div key={project.id}>
                  <div className="flex justify-between">
                    <h3 className={`${styles.subheadingStyle}`}>{project.title}</h3>
                    {project.duration && <div className="text-sm">{project.duration}</div>}
                  </div>
                  {project.description && <div className="text-sm mt-1">{project.description}</div>}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {project.technologies.map((tech: string) => (
                        <Badge key={tech} variant="outline" className="text-xs">
                          {tech}
                          {viewMode === 'recruiter' && ['React', 'Node.js'].includes(tech) && (
                            <span className="ml-1 text-green-600">✓</span>
                          )}
                        </Badge>
                      ))}
                    </div>
                  )}
                  {project.link && <div className="text-xs mt-1">Link: {project.link}</div>}
                </div>
              ))}
            </div>
          </section>
          
          {/* Skills Section */}
          <section className={styles.sectionStyle}>
            <h2 className={styles.headingStyle}>Skills</h2>
            <div className="space-y-2 mt-2">
              {data.skills.technical && data.skills.technical.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium">Technical Skills</h3>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {data.skills.technical.map((skill: string) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                        {viewMode === 'recruiter' && ['JavaScript', 'React', 'Node.js', 'SQL'].includes(skill) && (
                          <span className="ml-1 text-green-600">✓</span>
                        )}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {data.skills.soft && data.skills.soft.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium">Soft Skills</h3>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {data.skills.soft.map((skill: string) => (
                      <Badge key={skill} variant="outline" className="text-xs">{skill}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
          
          {/* Certifications Section */}
          {data.certifications && data.certifications.length > 0 && (
            <section className={styles.sectionStyle}>
              <h2 className={styles.headingStyle}>Certifications</h2>
              <div className="space-y-2 mt-2">
                {data.certifications.map((cert: any) => (
                  <div key={cert.id}>
                    <div className="flex justify-between">
                      <h3 className="font-medium">{cert.name}</h3>
                      {cert.date && <div className="text-sm">{new Date(cert.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</div>}
                    </div>
                    <div className="text-sm">{cert.issuer}</div>
                    {cert.link && <div className="text-xs">Verify: {cert.link}</div>}
                  </div>
                ))}
              </div>
            </section>
          )}
          
          {/* Languages Section */}
          {data.languages && data.languages.length > 0 && (
            <section className={styles.sectionStyle}>
              <h2 className={styles.headingStyle}>Languages</h2>
              <div className="flex flex-wrap gap-x-6 gap-y-1 mt-2">
                {data.languages.map((lang: any, index: number) => (
                  <div key={index} className="text-sm">
                    <span className="font-medium">{lang.language}</span>
                    {lang.proficiency && ` (${lang.proficiency})`}
                  </div>
                ))}
              </div>
            </section>
          )}
          
          {viewMode === 'recruiter' && (
            <div className="absolute top-0 right-0 w-3 h-full bg-gradient-to-b from-green-300 via-yellow-300 to-transparent opacity-20"></div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ResumePreview;
