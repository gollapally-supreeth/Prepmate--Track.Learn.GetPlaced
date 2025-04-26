import React, { useState, useEffect } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Pencil, Github, Linkedin, Upload, Star, Moon, Sun, Cog, Bell, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function StudentProfilePopover() {
  // Use localStorage for avatar and user info
  const [avatar, setAvatar] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [dob, setDob] = useState('');
  const [bio, setBio] = useState('');
  const [editingBio, setEditingBio] = useState(false);
  const [course, setCourse] = useState('');
  const [semester, setSemester] = useState(0);
  const [totalSemesters, setTotalSemesters] = useState(0);
  const [cgpa, setCgpa] = useState(0);
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [experience, setExperience] = useState([]);
  const [progress, setProgress] = useState([]);
  const [activity, setActivity] = useState([]);
  const [settings, setSettings] = useState({
    darkMode: true,
    notifications: true,
    privacy: 'Public',
  });

  useEffect(() => {
    // On mount, get avatar and user info from localStorage if available
    const storedAvatar = localStorage.getItem('userAvatar');
    if (storedAvatar) setAvatar(storedAvatar);
    const storedProfile = localStorage.getItem('userProfile');
    if (storedProfile) {
      try {
        const profile = JSON.parse(storedProfile);
        setFullName(profile.fullName || '');
        setUsername(profile.username || '');
        setEmail(profile.email || '');
        setContact(profile.contact || '');
        setDob(profile.dob || '');
        setBio(profile.bio || '');
        setCourse(profile.course || '');
        setSemester(profile.semester || 0);
        setTotalSemesters(profile.totalSemesters || 0);
        setCgpa(profile.cgpa || 0);
        setSkills(profile.skills || []);
        setProjects(profile.projects || []);
        setExperience(profile.experience || []);
        setProgress(profile.progress || []);
        setActivity(profile.activity || []);
        setSettings(profile.settings || {
          darkMode: true,
          notifications: true,
          privacy: 'Public',
        });
      } catch {}
    }
    // Listen for avatar updates
    const handler = (event: any) => {
      if (event.detail && event.detail.avatar) {
        setAvatar(event.detail.avatar);
      }
    };
    window.addEventListener('avatar-updated', handler);
    return () => window.removeEventListener('avatar-updated', handler);
  }, []);

  // Handler for avatar upload
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatar(url);
      localStorage.setItem('userAvatar', url);
      const event = new CustomEvent('avatar-updated', { detail: { avatar: url } });
      window.dispatchEvent(event);
    }
  };

  const handleBioSave = () => {
    setEditingBio(false);
    // Optionally, persist bio to localStorage or backend
  };

  const handleSkillClick = (skill: string) => {
    // navigate to skills page
  };

  const handleThemeToggle = () => setSettings((s) => ({ ...s, darkMode: !s.darkMode }));
  const handleNotificationsToggle = () => setSettings((s) => ({ ...s, notifications: !s.notifications }));

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button className="focus:outline-none">
          <Avatar className="h-10 w-10 border-2 border-primary shadow-md">
            <AvatarImage src={avatar || '/avatar-placeholder.png'} alt={fullName || 'User'} />
            <AvatarFallback>{fullName ? fullName[0] : '?'}</AvatarFallback>
          </Avatar>
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          sideOffset={12}
          align="end"
          className={cn(
            'z-50 w-[350px] max-w-[95vw] rounded-2xl bg-background shadow-xl border p-5 flex flex-col gap-4',
            'transition-all duration-200',
            'md:w-[400px]'
          )}
        >
          {/* Profile Picture & Upload */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative group">
              <Avatar className="h-20 w-20 border-4 border-primary shadow-lg">
                <AvatarImage src={avatar || '/avatar-placeholder.png'} alt={fullName || 'User'} />
                <AvatarFallback>{fullName ? fullName[0] : '?'}</AvatarFallback>
              </Avatar>
              <label className="absolute bottom-0 right-0 bg-primary rounded-full p-1 cursor-pointer shadow group-hover:scale-110 transition-transform">
                <Upload className="h-4 w-4 text-white" />
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              </label>
            </div>
            <div className="text-center mt-2">
              <div className="font-bold text-lg">{fullName}</div>
              <div className="text-muted-foreground text-sm">@{username}</div>
              <div className="text-xs text-muted-foreground mt-1">{email}</div>
              {contact && <div className="text-xs text-muted-foreground">{contact}</div>}
              {dob && <div className="text-xs text-muted-foreground">DOB: {dob}</div>}
            </div>
          </div>

          {/* Quick Bio */}
          <div className="flex items-start gap-2">
            {editingBio ? (
              <div className="flex-1 flex gap-2 items-center">
                <Input
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  className="text-sm"
                  maxLength={120}
                />
                <Button size="icon" variant="ghost" onClick={handleBioSave}>
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex-1 text-sm text-muted-foreground">
                {bio || <span className="italic text-xs">No bio yet.</span>}
              </div>
            )}
            {!editingBio && (
              <Button size="icon" variant="ghost" onClick={() => setEditingBio(true)}>
                <Pencil className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Academic Info */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">{course}</span>
              <span className="text-xs text-muted-foreground">Semester {semester} of {totalSemesters}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs">CGPA:</span>
              <span className="font-semibold text-sm">{cgpa ?? 'Not Provided'}</span>
              <Progress value={semester / totalSemesters * 100} className="h-1 w-24 ml-2" />
            </div>
          </div>

          {/* Skills Section */}
          <div>
            <div className="font-medium text-sm mb-1">Skills</div>
            <div className="flex flex-wrap gap-2">
              {skills.map(skill => (
                <Button
                  key={skill.name}
                  size="sm"
                  variant="outline"
                  className="rounded-full px-3 py-1 flex items-center gap-1 text-xs"
                  onClick={() => handleSkillClick(skill.name)}
                >
                  {skill.name}
                  <Badge className={cn('ml-1', skill.level === 'Advanced' && 'bg-emerald-500', skill.level === 'Intermediate' && 'bg-amber-500', skill.level === 'Beginner' && 'bg-slate-400')}>{skill.level}</Badge>
                  <span className="flex gap-0.5 ml-1">
                    {[...Array(skill.rating)].map((_, i) => <Star key={i} className="h-3 w-3 text-yellow-400 fill-yellow-400" />)}
                  </span>
                </Button>
              ))}
            </div>
          </div>

          {/* Project Showcase */}
          <div>
            <div className="font-medium text-sm mb-1">Projects</div>
            <div className="flex flex-col gap-2">
              {projects.map(project => (
                <div key={project.title} className="flex items-start gap-2 p-2 rounded-lg hover:bg-muted transition">
                  <div className="h-8 w-8 bg-muted rounded-md flex items-center justify-center">
                    {/* Thumbnail or icon */}
                    <span className="text-xs font-bold">{project.title[0]}</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-xs flex items-center gap-1">
                      <a href={project.github} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        {project.title}
                      </a>
                      <a href={project.github} target="_blank" rel="noopener noreferrer">
                        <Github className="h-3 w-3 ml-1 text-muted-foreground" />
                      </a>
                    </div>
                    <div className="text-xs text-muted-foreground">{project.description}</div>
                    <div className="flex gap-1 mt-1 flex-wrap">
                      {project.tech.map(tech => (
                        <Badge key={tech} className="bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200 px-2 py-0.5 text-[10px]">{tech}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Internship/Work Experience */}
          <div>
            <div className="font-medium text-sm mb-1">Experience</div>
            <div className="flex flex-col gap-2">
              {experience.map(exp => (
                <div key={exp.role} className="p-2 rounded-lg hover:bg-muted transition">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs">{exp.role}</span>
                    <span className="text-xs text-muted-foreground">@ {exp.company}</span>
                    <a href={exp.linkedin} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="h-3 w-3 ml-1 text-blue-600" />
                    </a>
                  </div>
                  <div className="text-xs text-muted-foreground">{exp.duration}</div>
                  <ul className="list-disc ml-5 text-xs mt-1">
                    {exp.responsibilities.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Progress Tracker */}
          <div>
            <div className="font-medium text-sm mb-1">Progress Tracker</div>
            <div className="flex flex-col gap-2">
              {progress.map(p => (
                <div key={p.label} className="flex items-center gap-2">
                  <span className="text-xs w-32 truncate">{p.label}</span>
                  <Progress value={p.percent} className="h-1 w-24" />
                  <span className="text-xs text-muted-foreground">{p.percent}%</span>
                  <span className="text-xs text-muted-foreground ml-auto">{p.deadline}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Feed */}
          <div>
            <div className="font-medium text-sm mb-1">Recent Activity</div>
            <div className="flex flex-col gap-1">
              {activity.map((a, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="font-semibold">{a.text}</span>
                  <span className="ml-auto">{a.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Settings Shortcuts */}
          <div className="flex items-center gap-3 border-t pt-3 mt-2">
            <Button size="icon" variant="ghost" onClick={handleThemeToggle} title="Toggle Theme">
              {settings.darkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>
            <Button size="icon" variant="ghost" onClick={handleNotificationsToggle} title="Notifications">
              <Bell className={settings.notifications ? 'h-4 w-4 text-primary' : 'h-4 w-4'} />
            </Button>
            <Button size="icon" variant="ghost" title="Privacy Settings">
              <Lock className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" title="Account Settings">
              <Cog className="h-4 w-4" />
            </Button>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
} 