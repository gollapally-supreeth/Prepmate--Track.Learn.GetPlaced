import { useState, useRef, useEffect } from 'react';

const initialUser = {
  avatar: '',
  fullName: 'Aarav Sharma',
  username: 'aarav123',
  email: 'aarav.sharma@email.com',
  contact: '+91 9876543210',
  dob: '2002-05-15',
  status: 'Available for Internship',
  bio: 'Aspiring software engineer with a passion for AI and open source.',
  course: 'B.Tech, Computer Science',
  semester: 4,
  totalSemesters: 8,
  cgpa: 8.7,
  skills: [
    { name: 'Python', level: 'Advanced', rating: 5 },
    { name: 'Java', level: 'Intermediate', rating: 4 },
    { name: 'Data Structures', level: 'Advanced', rating: 5 },
    { name: 'React', level: 'Intermediate', rating: 4 },
    { name: 'SQL', level: 'Beginner', rating: 2 },
  ],
  projects: [
    {
      title: 'Portfolio Website',
      description: 'A personal website built with React and Node.js',
      github: 'https://github.com/aarav/portfolio',
      demo: '',
      tech: ['React', 'Node.js', 'CSS'],
      thumbnail: '',
    },
    {
      title: 'AI Chatbot',
      description: 'Conversational AI chatbot for student queries',
      github: 'https://github.com/aarav/ai-chatbot',
      demo: '',
      tech: ['Python', 'TensorFlow'],
      thumbnail: '',
    },
  ],
  experience: [
    {
      role: 'Software Intern',
      company: 'Tech Solutions Inc.',
      duration: 'June 2023 - August 2023',
      responsibilities: [
        'Developed REST APIs in Node.js',
        'Collaborated on frontend features in React',
        'Wrote unit tests and documentation',
      ],
      linkedin: 'https://linkedin.com/in/aaravsharma',
    },
  ],
  progress: [
    { label: 'AI/ML Course', percent: 50, deadline: 'End of Semester', category: 'Learning Path' },
    { label: 'Portfolio Website Project', percent: 75, deadline: 'May 2024', category: 'Project Completion' },
    { label: 'Certifications', percent: 30, deadline: 'July 2024', category: 'Skill Development' },
  ],
  activity: [
    { type: 'test', text: 'Completed Java Programming Test - 85%', time: '2 hours ago', link: '#' },
    { type: 'cert', text: 'Completed "Data Structures" course', time: '1 day ago', link: '#' },
    { type: 'project', text: 'Finished AI Chatbot project', time: '3 days ago', link: '#' },
  ],
  settings: {
    darkMode: true,
    notifications: true,
    privacy: 'Public',
    profileVisibility: 'Public',
  },
  social: {
    linkedin: 'https://linkedin.com/in/aaravsharma',
    github: 'https://github.com/aarav',
    twitter: '',
    website: '',
  },
  badges: [
    { name: 'Top Performer', icon: 'Award' },
    { name: 'AI Enthusiast', icon: 'BookOpen' },
  ],
  events: [
    { name: 'Mock Test: DSA', date: '2024-06-10', time: '10:00 AM', link: '#' },
    { name: 'Project Deadline: Portfolio', date: '2024-06-15', time: '11:59 PM', link: '#' },
  ],
  learningPath: [
    { course: 'AI/ML Course', percent: 50, deadline: 'End of Semester' },
    { course: 'Web Dev Bootcamp', percent: 80, deadline: 'July 2024' },
  ],
  quickActions: [
    'Edit Profile',
    'Add Project',
    'Update Resume',
    'Change Password',
  ],
  educations: [
    // Example entry
    // {
    //   school: 'ABC University',
    //   degree: 'B.Tech',
    //   fieldOfStudy: 'Computer Science',
    //   startYear: 2020,
    //   endYear: 2024,
    //   grade: '8.7 CGPA',
    //   description: 'Relevant coursework, achievements, etc.'
    // }
  ],
};

export function useProfileState() {
  const [user, setUser] = useState(initialUser);
  const [edit, setEdit] = useState({
    basic: false,
    bio: false,
    academics: false,
    skills: false,
    projects: false,
    experience: false,
    settings: false,
    social: false,
    status: false,
  });
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [showAddProject, setShowAddProject] = useState(false);
  const [showAddExperience, setShowAddExperience] = useState(false);
  const [showAddBadge, setShowAddBadge] = useState(false);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [showAddLearning, setShowAddLearning] = useState(false);

  // Editable fields state
  const [basicInfo, setBasicInfo] = useState({
    fullName: user.fullName,
    username: user.username,
    contact: user.contact,
    dob: user.dob,
    status: user.status,
  });
  const [bio, setBio] = useState(user.bio);
  const [academics, setAcademics] = useState({
    course: user.course,
    semester: user.semester,
    totalSemesters: user.totalSemesters,
    cgpa: user.cgpa,
  });
  const [social, setSocial] = useState(user.social);
  const [avatarUrl, setAvatarUrl] = useState(user.avatar);
  const avatarInputRef = useRef(null);

  // Skill handlers
  const [editingSkill, setEditingSkill] = useState(null); // index of skill being edited
  const [newSkill, setNewSkill] = useState({ name: '', level: 'Beginner', rating: 1 });
  const [addingSkill, setAddingSkill] = useState(false);

  // Project state and handlers
  const [editingProject, setEditingProject] = useState(null);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    github: '',
    demo: '',
    tech: [],
    thumbnail: '',
  });
  const [addingProject, setAddingProject] = useState(false);
  const [newTech, setNewTech] = useState('');

  // Experience state and handlers
  const [editingExperience, setEditingExperience] = useState(null);
  const [newExperience, setNewExperience] = useState({
    role: '',
    company: '',
    duration: '',
    responsibilities: [''],
    linkedin: '',
  });
  const [addingExperience, setAddingExperience] = useState(false);
  const [responsibilityText, setResponsibilityText] = useState('');

  // Badge state
  const [newBadge, setNewBadge] = useState({ name: '', icon: 'Award' });
  const [addingBadge, setAddingBadge] = useState(false);

  // Event state
  const [editingEvent, setEditingEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({ name: '', date: '', time: '', link: '#' });
  const [addingEvent, setAddingEvent] = useState(false);

  // Learning Path state
  const [editingLearning, setEditingLearning] = useState(null);
  const [newLearningPath, setNewLearningPath] = useState({ course: '', percent: 0, deadline: '' });
  const [addingLearning, setAddingLearning] = useState(false);

  // Progress Tracker state
  const [editingProgress, setEditingProgress] = useState(null);
  const [newProgress, setNewProgress] = useState({ label: '', percent: 0, deadline: '', category: '' });
  const [addingProgress, setAddingProgress] = useState(false);

  const [settings, setSettings] = useState(user.settings);
  const [editingSettings, setEditingSettings] = useState(false);

  // Activity Feed state and handlers
  const [activity, setActivity] = useState(user.activity);
  const [editingActivity, setEditingActivity] = useState(false);
  const handleActivityEdit = (idx) => {
    setEditingActivity(idx);
  };
  const handleActivitySave = () => {
    setUser((prev) => ({ ...prev, activity }));
    setEditingActivity(false);
  };
  const handleActivityDelete = (idx) => {
    const updated = activity.filter((_, i) => i !== idx);
    setActivity(updated);
    setUser((prev) => ({ ...prev, activity: updated }));
  };
  const handleActivityAdd = (item) => {
    setActivity((prev) => [...prev, item]);
  };

  // Quick Actions state and handlers
  const [quickActions, setQuickActions] = useState(user.quickActions);
  const [editingQuickActions, setEditingQuickActions] = useState(false);
  const handleQuickActionEdit = (idx, value) => {
    const updated = [...quickActions];
    updated[idx] = value;
    setQuickActions(updated);
  };
  const handleQuickActionSave = () => {
    setUser((prev) => ({ ...prev, quickActions }));
    setEditingQuickActions(false);
  };
  const handleQuickActionDelete = (idx) => {
    const updated = quickActions.filter((_, i) => i !== idx);
    setQuickActions(updated);
    setUser((prev) => ({ ...prev, quickActions: updated }));
  };
  const handleQuickActionAdd = (action) => {
    setQuickActions((prev) => [...prev, action]);
  };

  const [educations, setEducations] = useState(user.educations);
  const [editingEducation, setEditingEducation] = useState(null); // index of education being edited
  const [newEducation, setNewEducation] = useState({
    school: '',
    degree: '',
    fieldOfStudy: '',
    startYear: '',
    endYear: '',
    grade: '',
    description: '',
  });
  const [addingEducation, setAddingEducation] = useState(false);

  // Education handlers
  const handleEducationEdit = (idx) => {
    setEditingEducation(idx);
    setNewEducation({ ...educations[idx] });
  };
  const handleEducationSave = (idx) => {
    const updated = [...educations];
    updated[idx] = { ...newEducation };
    setEducations(updated);
    setUser((prev) => ({ ...prev, educations: updated }));
    setEditingEducation(null);
    setNewEducation({ school: '', degree: '', fieldOfStudy: '', startYear: '', endYear: '', grade: '', description: '' });
  };
  const handleEducationDelete = (idx) => {
    const updated = educations.filter((_, i) => i !== idx);
    setEducations(updated);
    setUser((prev) => ({ ...prev, educations: updated }));
  };
  const handleEducationAdd = () => {
    setEducations((prev) => [...prev, { ...newEducation }]);
    setUser((prev) => ({ ...prev, educations: [...prev.educations, { ...newEducation }] }));
    setNewEducation({ school: '', degree: '', fieldOfStudy: '', startYear: '', endYear: '', grade: '', description: '' });
    setAddingEducation(false);
  };

  useEffect(() => {
    const handleExternalAvatarUpdate = (event) => {
      if (event.detail && event.detail.avatar) {
        setAvatarUrl(event.detail.avatar);
        setUser((prev) => ({ ...prev, avatar: event.detail.avatar }));
      }
    };
    window.addEventListener('avatar-updated', handleExternalAvatarUpdate);
    const savedAvatar = localStorage.getItem('userAvatar');
    if (savedAvatar) {
      setAvatarUrl(savedAvatar);
      setUser((prev) => ({ ...prev, avatar: savedAvatar }));
    }
    return () => {
      window.removeEventListener('avatar-updated', handleExternalAvatarUpdate);
    };
  }, []);

  // Handler functions from Profile.tsx:
  const handleSettingsChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };
  const handleSettingsSave = () => {
    setUser((prev) => ({ ...prev, settings: settings }));
    setEditingSettings(false);
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
  const handleAvatarUpload = () => {
    avatarInputRef.current?.click();
  };
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
    }
  };
  const handleAvatarSave = () => {
    setUser((prev) => ({ ...prev, avatar: avatarUrl }));
    localStorage.setItem('userAvatar', avatarUrl);
    const event = new CustomEvent('avatar-updated', { detail: { avatar: avatarUrl } });
    window.dispatchEvent(event);
  };
  const handleBasicSave = () => {
    setUser((prev) => ({ ...prev, ...basicInfo }));
    setEdit((prev) => ({ ...prev, basic: false }));
  };
  const handleBioSave = () => {
    setUser((prev) => ({ ...prev, bio }));
    setEdit((prev) => ({ ...prev, bio: false }));
  };
  const handleAcademicsSave = () => {
    setUser((prev) => ({ ...prev, ...academics }));
    setEdit((prev) => ({ ...prev, academics: false }));
  };
  const handleSocialSave = () => {
    setUser((prev) => ({ ...prev, social }));
    setEdit((prev) => ({ ...prev, social: false }));
  };
  const handleStatusSave = () => {
    setUser((prev) => ({ ...prev, status: basicInfo.status }));
    setEdit((prev) => ({ ...prev, status: false }));
  };
  // Skill handlers
  const handleSkillEdit = (idx) => {
    setEditingSkill(idx);
    setNewSkill({ ...user.skills[idx] });
  };
  const handleSkillSave = (idx) => {
    const updatedSkills = [...user.skills];
    updatedSkills[idx] = { ...newSkill };
    setUser((prev) => ({ ...prev, skills: updatedSkills }));
    setEditingSkill(null);
    setNewSkill({ name: '', level: 'Beginner', rating: 1 });
  };
  const handleSkillDelete = (idx) => {
    const updatedSkills = user.skills.filter((_, i) => i !== idx);
    setUser((prev) => ({ ...prev, skills: updatedSkills }));
  };
  const handleSkillAdd = () => {
    setUser((prev) => ({ ...prev, skills: [...prev.skills, { ...newSkill }] }));
    setNewSkill({ name: '', level: 'Beginner', rating: 1 });
    setAddingSkill(false);
  };
  // Project handlers
  const handleProjectEdit = (idx) => {
    setEditingProject(idx);
    setNewProject({ ...user.projects[idx] });
  };
  const handleProjectSave = (idx) => {
    const updatedProjects = [...user.projects];
    updatedProjects[idx] = { ...newProject };
    setUser((prev) => ({ ...prev, projects: updatedProjects }));
    setEditingProject(null);
  };
  const handleProjectDelete = (idx) => {
    const updatedProjects = user.projects.filter((_, i) => i !== idx);
    setUser((prev) => ({ ...prev, projects: updatedProjects }));
  };
  const handleProjectAdd = () => {
    if (newProject.title.trim()) {
      setUser((prev) => ({ ...prev, projects: [...prev.projects, { ...newProject }] }));
      setNewProject({
        title: '',
        description: '',
        github: '',
        demo: '',
        tech: [],
        thumbnail: '',
      });
      setAddingProject(false);
    }
  };
  const handleAddTech = () => {
    if (newTech.trim()) {
      setNewProject((prev) => ({
        ...prev,
        tech: [...prev.tech, newTech.trim()],
      }));
      setNewTech('');
    }
  };
  const handleRemoveTech = (techToRemove) => {
    setNewProject((prev) => ({
      ...prev,
      tech: prev.tech.filter((tech) => tech !== techToRemove),
    }));
  };
  // Experience handlers
  const handleExperienceEdit = (idx) => {
    setEditingExperience(idx);
    setNewExperience({ ...user.experience[idx] });
  };
  const handleExperienceSave = (idx) => {
    const updatedExperience = [...user.experience];
    updatedExperience[idx] = { ...newExperience };
    setUser((prev) => ({ ...prev, experience: updatedExperience }));
    setEditingExperience(null);
  };
  const handleExperienceDelete = (idx) => {
    const updatedExperience = user.experience.filter((_, i) => i !== idx);
    setUser((prev) => ({ ...prev, experience: updatedExperience }));
  };
  const handleExperienceAdd = () => {
    if (newExperience.role.trim() && newExperience.company.trim()) {
      setUser((prev) => ({ ...prev, experience: [...prev.experience, { ...newExperience }] }));
      setNewExperience({
        role: '',
        company: '',
        duration: '',
        responsibilities: [''],
        linkedin: '',
      });
      setAddingExperience(false);
    }
  };
  const handleAddResponsibility = () => {
    if (responsibilityText.trim()) {
      setNewExperience((prev) => ({
        ...prev,
        responsibilities: [...prev.responsibilities, responsibilityText.trim()],
      }));
      setResponsibilityText('');
    }
  };
  const handleRemoveResponsibility = (idx) => {
    setNewExperience((prev) => ({
      ...prev,
      responsibilities: prev.responsibilities.filter((_, i) => i !== idx),
    }));
  };
  // Badge handlers
  const handleBadgeAdd = () => {
    if (newBadge.name.trim()) {
      setUser((prev) => ({
        ...prev,
        badges: [...prev.badges, { name: newBadge.name, icon: newBadge.icon }],
      }));
      setNewBadge({ name: '', icon: 'Award' });
      setAddingBadge(false);
    }
  };
  const handleBadgeDelete = (idx) => {
    const updatedBadges = user.badges.filter((_, i) => i !== idx);
    setUser((prev) => ({ ...prev, badges: updatedBadges }));
  };
  // Event handlers
  const handleEventEdit = (idx) => {
    setEditingEvent(idx);
    setNewEvent({ ...user.events[idx] });
  };
  const handleEventSave = (idx) => {
    const updatedEvents = [...user.events];
    updatedEvents[idx] = { ...newEvent };
    setUser((prev) => ({ ...prev, events: updatedEvents }));
    setEditingEvent(null);
  };
  const handleEventDelete = (idx) => {
    const updatedEvents = user.events.filter((_, i) => i !== idx);
    setUser((prev) => ({ ...prev, events: updatedEvents }));
  };
  const handleEventAdd = () => {
    if (newEvent.name.trim() && newEvent.date.trim()) {
      setUser((prev) => ({ ...prev, events: [...prev.events, { ...newEvent }] }));
      setNewEvent({ name: '', date: '', time: '', link: '#' });
      setAddingEvent(false);
    }
  };
  // Learning Path handlers
  const handleLearningEdit = (idx) => {
    setEditingLearning(idx);
    setNewLearningPath({ ...user.learningPath[idx] });
  };
  const handleLearningSave = (idx) => {
    const updatedLearning = [...user.learningPath];
    updatedLearning[idx] = { ...newLearningPath };
    setUser((prev) => ({ ...prev, learningPath: updatedLearning }));
    setEditingLearning(null);
  };
  const handleLearningDelete = (idx) => {
    const updatedLearning = user.learningPath.filter((_, i) => i !== idx);
    setUser((prev) => ({ ...prev, learningPath: updatedLearning }));
  };
  const handleLearningAdd = () => {
    if (newLearningPath.course.trim()) {
      setUser((prev) => ({ ...prev, learningPath: [...prev.learningPath, { ...newLearningPath }] }));
      setNewLearningPath({ course: '', percent: 0, deadline: '' });
      setAddingLearning(false);
    }
  };
  // Progress handlers
  const handleProgressEdit = (idx) => {
    setEditingProgress(idx);
    setNewProgress({ ...user.progress[idx] });
  };
  const handleProgressSave = (idx) => {
    const updatedProgress = [...user.progress];
    updatedProgress[idx] = { ...newProgress };
    setUser((prev) => ({ ...prev, progress: updatedProgress }));
    setEditingProgress(null);
  };
  const handleProgressDelete = (idx) => {
    const updatedProgress = user.progress.filter((_, i) => i !== idx);
    setUser((prev) => ({ ...prev, progress: updatedProgress }));
  };
  const handleProgressAdd = () => {
    if (newProgress.label.trim()) {
      setUser((prev) => ({ ...prev, progress: [...prev.progress, { ...newProgress }] }));
      setNewProgress({ label: '', percent: 0, deadline: '', category: '' });
      setAddingProgress(false);
    }
  };
  // Quick Actions
  const handleEditFullProfile = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setEdit((prev) => ({ ...prev, basic: true }));
  };
  const handleAddProject = () => {
    const projectsSection = document.querySelector('section:nth-of-type(6)');
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth' });
      setAddingProject(true);
      setNewProject({
        title: '',
        description: '',
        github: '',
        demo: '',
        tech: [],
        thumbnail: '',
      });
    }
  };
  const handleUpdateResume = () => {
    const experienceSection = document.querySelector('section:nth-of-type(7)');
    if (experienceSection) {
      experienceSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  const handleChangePassword = () => {
    alert('Password change functionality would be implemented here.');
  };

  return {
    user, setUser, edit, setEdit, showAddSkill, setShowAddSkill, showAddProject, setShowAddProject, showAddExperience, setShowAddExperience, showAddBadge, setShowAddBadge, showAddEvent, setShowAddEvent, showAddLearning, setShowAddLearning,
    basicInfo, setBasicInfo, bio, setBio, academics, setAcademics, social, setSocial, avatarUrl, setAvatarUrl, avatarInputRef,
    editingSkill, setEditingSkill, newSkill, setNewSkill, addingSkill, setAddingSkill,
    editingProject, setEditingProject, newProject, setNewProject, addingProject, setAddingProject, newTech, setNewTech,
    editingExperience, setEditingExperience, newExperience, setNewExperience, addingExperience, setAddingExperience, responsibilityText, setResponsibilityText,
    newBadge, setNewBadge, addingBadge, setAddingBadge,
    editingEvent, setEditingEvent, newEvent, setNewEvent, addingEvent, setAddingEvent,
    editingLearning, setEditingLearning, newLearningPath, setNewLearningPath, addingLearning, setAddingLearning,
    editingProgress, setEditingProgress, newProgress, setNewProgress, addingProgress, setAddingProgress,
    settings, setSettings, editingSettings, setEditingSettings,
    handleSettingsChange, handleSettingsSave, handleAvatarUpload, handleAvatarChange, handleAvatarSave,
    handleBasicSave, handleBioSave, handleAcademicsSave, handleSocialSave, handleStatusSave,
    handleSkillEdit, handleSkillSave, handleSkillDelete, handleSkillAdd,
    handleProjectEdit, handleProjectSave, handleProjectDelete, handleProjectAdd, handleAddTech, handleRemoveTech,
    handleExperienceEdit, handleExperienceSave, handleExperienceDelete, handleExperienceAdd, handleAddResponsibility, handleRemoveResponsibility,
    handleBadgeAdd, handleBadgeDelete,
    handleEventEdit, handleEventSave, handleEventDelete, handleEventAdd,
    handleLearningEdit, handleLearningSave, handleLearningDelete, handleLearningAdd,
    handleProgressEdit, handleProgressSave, handleProgressDelete, handleProgressAdd,
    handleEditFullProfile, handleAddProject, handleUpdateResume, handleChangePassword,
    activity, setActivity, editingActivity, setEditingActivity, handleActivityEdit, handleActivitySave, handleActivityDelete, handleActivityAdd,
    quickActions, setQuickActions, editingQuickActions, setEditingQuickActions, handleQuickActionEdit, handleQuickActionSave, handleQuickActionDelete, handleQuickActionAdd,
    educations, setEducations, editingEducation, setEditingEducation, newEducation, setNewEducation, addingEducation, setAddingEducation,
    handleEducationEdit, handleEducationSave, handleEducationDelete, handleEducationAdd,
  };
} 