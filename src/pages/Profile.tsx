import React, { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Upload, Save, User, Link2, Star, Briefcase, Award, Calendar, BookOpen, Settings as SettingsIcon, Zap, Activity as ActivityIcon, Layers, ListChecks } from 'lucide-react';
import ProfileBasicInfo from './profile/ProfileBasicInfo';
import ProfileSocialLinks from './profile/ProfileSocialLinks';
import ProfileBio from './profile/ProfileBio';
import ProfileAcademics from './profile/ProfileAcademics';
import ProfileSkills from './profile/ProfileSkills';
import ProfileProjects from './profile/ProfileProjects';
import ProfileExperience from './profile/ProfileExperience';
import ProfileBadges from './profile/ProfileBadges';
import ProfileEvents from './profile/ProfileEvents';
import ProfileLearningPath from './profile/ProfileLearningPath';
import ProfileProgress from './profile/ProfileProgress';
import ProfileSettings from './profile/ProfileSettings';
import ProfileQuickActions from './profile/ProfileQuickActions';
import ProfileActivityFeed from './profile/ProfileActivityFeed';
import { useProfileState } from '@/hooks/useProfileState';
import { fetchProfile, updateProfile, createProfile } from '@/lib/profile';
import { toast } from 'sonner';

// Prepmate color palette (example)
const prepmateColors = {
  primary: 'bg-[#2B4C7E]', // Prepmate blue
  accent: 'bg-[#F9A826]', // Prepmate yellow
  card: 'bg-white dark:bg-[#1A2233]',
  border: 'border-[#2B4C7E]/20',
  sectionHeader: 'text-[#2B4C7E] dark:text-[#F9A826]',
};

function SectionHeader({ icon: Icon, title }) {
  return (
    <div className={`flex items-center gap-2 mb-4 font-semibold text-lg ${prepmateColors.sectionHeader}`}>
      <Icon className="h-6 w-6" />
      <span>{title}</span>
    </div>
  );
}

export default function Profile() {
  const profile = useProfileState();
  const [loading, setLoading] = useState(false);
  const {
    user, edit, basicInfo, setBasicInfo, handleStatusSave,
    bio, setBio,
    academics, setAcademics,
    social, setSocial,
    avatarUrl, setAvatarUrl, avatarInputRef, handleAvatarUpload, handleAvatarChange,
    editingSkill, newSkill, setNewSkill, addingSkill, setAddingSkill, handleSkillEdit, handleSkillDelete, handleSkillAdd,
    editingProject, newProject, setNewProject, addingProject, setAddingProject, newTech, setNewTech, handleProjectEdit, handleProjectDelete, handleProjectAdd, handleAddTech, handleRemoveTech,
    editingExperience, newExperience, setNewExperience, addingExperience, setAddingExperience, responsibilityText, setResponsibilityText, handleExperienceEdit, handleExperienceDelete, handleExperienceAdd, handleAddResponsibility, handleRemoveResponsibility,
    newBadge, setNewBadge, addingBadge, setAddingBadge, handleBadgeAdd, handleBadgeDelete,
    editingEvent, newEvent, setNewEvent, addingEvent, setAddingEvent, handleEventEdit, handleEventDelete, handleEventAdd,
    editingLearning, newLearningPath, setNewLearningPath, addingLearning, setAddingLearning, handleLearningEdit, handleLearningDelete, handleLearningAdd,
    editingProgress, newProgress, setNewProgress, addingProgress, setAddingProgress, handleProgressEdit, handleProgressDelete, handleProgressAdd,
    settings, setSettings, editingSettings, setEditingSettings, handleSettingsChange,
    handleEditFullProfile, handleAddProject, handleUpdateResume, handleChangePassword,
    activity, setActivity, editingActivity, setEditingActivity, handleActivityEdit, handleActivitySave, handleActivityDelete, handleActivityAdd,
    quickActions, setQuickActions, editingQuickActions, setEditingQuickActions, handleQuickActionEdit, handleQuickActionSave, handleQuickActionDelete, handleQuickActionAdd,
  } = profile;

  // Helper to sync all local state from backend
  const syncProfileState = (profileData: any) => {
    profile.setUser(profileData);
    setBasicInfo({
      fullName: profileData.fullName || '',
      username: profileData.username || '',
      contact: profileData.contact || '',
      dob: profileData.dob || '',
      status: profileData.status || '',
    });
    setSocial({
      linkedin: (profileData.social && profileData.social.linkedin) || profileData.linkedin || '',
      github: (profileData.social && profileData.social.github) || profileData.github || '',
      twitter: (profileData.social && profileData.social.twitter) || profileData.twitter || '',
      website: (profileData.social && profileData.social.website) || profileData.website || '',
    });
    setBio(profileData.bio || '');
    // Always set both academics and educations for robust academic info display
    const academicsArr = Array.isArray(profileData.academics) ? profileData.academics : (Array.isArray(profileData.educations) ? profileData.educations : []);
    setAcademics(academicsArr);
    setAvatarUrl(profileData.avatarUrl || profileData.avatar || '');
    profile.setUser((prev: any) => ({
      ...prev,
      skills: Array.isArray(profileData.skills) ? profileData.skills : [],
      projects: Array.isArray(profileData.projects) ? profileData.projects : [],
      experience: Array.isArray(profileData.experience) ? profileData.experience : [],
      badges: Array.isArray(profileData.badges) ? profileData.badges : [],
      events: Array.isArray(profileData.events) ? profileData.events : [],
      learningPath: Array.isArray(profileData.learningPath) ? profileData.learningPath : [],
      progress: Array.isArray(profileData.progress) ? profileData.progress : [],
      activity: Array.isArray(profileData.activity) ? profileData.activity : (Array.isArray(profileData.activityFeed) ? profileData.activityFeed : []),
      quickActions: Array.isArray(profileData.quickActions) ? profileData.quickActions : [],
      settings: profileData.settings && typeof profileData.settings === 'object' ? profileData.settings : {},
      academics: academicsArr,
      educations: academicsArr,
      avatarUrl: profileData.avatarUrl || profileData.avatar || '',
    }));
  };

  // Central handler for updating profile
  const handleProfileUpdate = async (updatedFields: Partial<any>) => {
    try {
      setLoading(true);
      const updatedProfile = { ...user, ...updatedFields };
      // Remove dob if it's an empty string or not a valid date
      if (!updatedProfile.dob || updatedProfile.dob === "" || isNaN(Date.parse(updatedProfile.dob))) {
        delete updatedProfile.dob;
      }
      const saved = await updateProfile(updatedProfile);
      syncProfileState(saved); // Sync all local state from backend response
      // --- Patch: update localStorage with latest profile and avatar ---
      localStorage.setItem('userAvatar', saved.avatarUrl || saved.avatar || '');
      localStorage.setItem('userProfile', JSON.stringify(saved));
      // --------------------------------------------------------------
      toast.success('Profile updated!');
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchProfile()
      .then(profileData => {
        syncProfileState(profileData); // Sync all local state from backend
      })
      .catch(err => {
        toast.error('Failed to load profile');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-lg font-semibold">Loading profile...</span>
      </div>
    );
  }

  // Defensive: ensure all fields are defined
  const safeUser = {
    ...user,
    fullName: user.fullName || '',
    username: user.username || '',
    contact: user.contact || '',
    social: user.social || { linkedin: '', github: '', twitter: '', website: '' },
    skills: user.skills || [],
    projects: user.projects || [],
    experience: user.experience || [],
    progress: user.progress || [],
    activity: user.activity || [],
    badges: user.badges || [],
    events: user.events || [],
    learningPath: user.learningPath || [],
    quickActions: user.quickActions || [],
    settings: user.settings || {},
  };

  // Patch: persist avatar to backend as well
  const handleAvatarSave = () => {
    profile.setUser((prev) => ({ ...prev, avatar: avatarUrl }));
    localStorage.setItem('userAvatar', avatarUrl);
    const event = new CustomEvent('avatar-updated', { detail: { avatar: avatarUrl } });
    window.dispatchEvent(event);
    // Persist avatar to backend
    handleProfileUpdate({ avatarUrl });
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#F4F8FB] to-[#EAF0F7] dark:bg-[#10141A] flex flex-col items-center py-8 px-2 sm:px-8">
      <div className="w-full max-w-4xl {prepmateColors.card} rounded-2xl shadow-2xl p-4 flex flex-col gap-6">
        {/* Profile Picture & Basic Info (spans both columns) */}
        <section className={`flex flex-col items-center gap-4 ${prepmateColors.card} rounded-xl shadow p-4 border ${prepmateColors.border} col-span-2`}>
          <SectionHeader icon={User} title="Basic Information" />
          <div className="relative group mb-2">
            <Avatar className="h-28 w-28 border-4 border-[#F9A826] shadow-lg">
              <AvatarImage src={avatarUrl || '/avatar-placeholder.png'} alt={safeUser.fullName || 'User'} />
              <AvatarFallback>{safeUser.fullName && safeUser.fullName.length > 0 ? safeUser.fullName[0] : '?'}</AvatarFallback>
            </Avatar>
            <label className="absolute bottom-0 right-0 bg-[#F9A826] rounded-full p-2 cursor-pointer shadow group-hover:scale-110 transition-transform" onClick={handleAvatarUpload} title="Upload Avatar">
              <Upload className="h-5 w-5 text-white" />
              <input type="file" accept="image/*" className="hidden" ref={avatarInputRef} onChange={handleAvatarChange} />
            </label>
            {avatarUrl !== user.avatar && (
              <Button
                size="sm"
                className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-[#2B4C7E] text-white hover:bg-[#1A2233]"
                onClick={handleAvatarSave}
                title="Save Avatar"
              >
                <Save className="h-3 w-3 mr-1" />Save Avatar
              </Button>
            )}
          </div>
          <ProfileBasicInfo
            user={safeUser}
            edit={edit}
            basicInfo={basicInfo}
            setBasicInfo={setBasicInfo}
            onSave={() => handleProfileUpdate(basicInfo)}
            onEdit={() => profile.setEdit((prev) => ({ ...prev, basic: true }))}
            onCancel={() => profile.setEdit((prev) => ({ ...prev, basic: false }))}
            onStatusSave={handleStatusSave}
            onStatusEdit={() => profile.setEdit((prev) => ({ ...prev, status: true }))}
            onStatusCancel={() => profile.setEdit((prev) => ({ ...prev, status: false }))}
          />
        </section>
        {/* Responsive grid for the rest */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Social Links */}
          <section className={`${prepmateColors.card} rounded-xl shadow p-4 border ${prepmateColors.border}`}>
            <SectionHeader icon={Link2} title="Social Links" />
            <ProfileSocialLinks
              user={safeUser}
              edit={edit}
              social={social}
              setSocial={setSocial}
              onSave={() => handleProfileUpdate(social)}
              onEdit={() => profile.setEdit((prev) => ({ ...prev, social: true }))}
              onCancel={() => profile.setEdit((prev) => ({ ...prev, social: false }))}
            />
          </section>
          {/* Quick Bio */}
          <section className={`${prepmateColors.card} rounded-xl shadow p-4 border ${prepmateColors.border}`}>
            <SectionHeader icon={ActivityIcon} title="Bio" />
            <ProfileBio
              user={safeUser}
              edit={edit}
              bio={bio}
              setBio={setBio}
              onSave={() => handleProfileUpdate({ bio })}
              onEdit={() => profile.setEdit((prev) => ({ ...prev, bio: true }))}
              onCancel={() => profile.setEdit((prev) => ({ ...prev, bio: false }))}
            />
          </section>
          {/* Academic Info */}
          <section className={`${prepmateColors.card} rounded-xl shadow p-4 border ${prepmateColors.border}`}>
            <SectionHeader icon={Layers} title="Academic Information" />
            <ProfileAcademics
              user={safeUser}
              edit={edit}
              setAcademics={setAcademics}
              onSave={() => handleProfileUpdate({ educations: academics })}
              onEdit={() => profile.setEdit((prev) => ({ ...prev, academics: true }))}
              onCancel={() => profile.setEdit((prev) => ({ ...prev, academics: false }))}
              educations={academics}
              editingEducation={profile.editingEducation}
              setEditingEducation={profile.setEditingEducation}
              newEducation={profile.newEducation}
              setNewEducation={profile.setNewEducation}
              addingEducation={profile.addingEducation}
              setAddingEducation={profile.setAddingEducation}
              handleEducationEdit={profile.handleEducationEdit}
              handleEducationSave={profile.handleEducationSave}
              handleEducationDelete={profile.handleEducationDelete}
              handleEducationAdd={profile.handleEducationAdd}
            />
          </section>
          {/* Skills Section */}
          <section className={`${prepmateColors.card} rounded-xl shadow p-4 border ${prepmateColors.border}`}>
            <SectionHeader icon={Star} title="Skills" />
            <ProfileSkills
              user={safeUser}
              skills={safeUser.skills}
              setSkills={skills => profile.setUser(prev => ({ ...prev, skills }))}
              editingSkill={editingSkill}
              setEditingSkill={profile.setEditingSkill}
              newSkill={newSkill}
              setNewSkill={setNewSkill}
              addingSkill={addingSkill}
              setAddingSkill={setAddingSkill}
              onEdit={handleSkillEdit}
              onSave={() => handleProfileUpdate({ skills: safeUser.skills })}
              onDelete={handleSkillDelete}
              onAdd={handleSkillAdd}
              onEditClick={handleSkillEdit}
              onCancelEdit={() => profile.setEditingSkill(null)}
              onCancelAdd={() => profile.setAddingSkill(false)}
            />
          </section>
          {/* Project Showcase */}
          <section className={`${prepmateColors.card} rounded-xl shadow p-4 border ${prepmateColors.border}`}>
            <SectionHeader icon={Zap} title="Projects" />
            <ProfileProjects
              user={safeUser}
              editingProject={editingProject}
              newProject={newProject}
              setNewProject={setNewProject}
              addingProject={addingProject}
              setAddingProject={setAddingProject}
              newTech={newTech}
              setNewTech={setNewTech}
              onEdit={handleProjectEdit}
              onSave={() => handleProfileUpdate({ projects: safeUser.projects })}
              onDelete={handleProjectDelete}
              onAdd={handleProjectAdd}
              onEditClick={handleProjectEdit}
              onCancelEdit={() => profile.setEditingProject(null)}
              onCancelAdd={() => profile.setAddingProject(false)}
              onAddTech={handleAddTech}
              onRemoveTech={handleRemoveTech}
            />
          </section>
          {/* Internship/Work Experience */}
          <section className={`${prepmateColors.card} rounded-xl shadow p-4 border ${prepmateColors.border}`}>
            <SectionHeader icon={Briefcase} title="Experience" />
            <ProfileExperience
              user={safeUser}
              editingExperience={editingExperience}
              newExperience={newExperience}
              setNewExperience={setNewExperience}
              addingExperience={addingExperience}
              setAddingExperience={setAddingExperience}
              responsibilityText={responsibilityText}
              setResponsibilityText={setResponsibilityText}
              onEdit={handleExperienceEdit}
              onSave={() => handleProfileUpdate({ experience: safeUser.experience })}
              onDelete={handleExperienceDelete}
              onAdd={handleExperienceAdd}
              onEditClick={handleExperienceEdit}
              onCancelEdit={() => profile.setEditingExperience(null)}
              onCancelAdd={() => profile.setAddingExperience(false)}
              onAddResponsibility={handleAddResponsibility}
              onRemoveResponsibility={handleRemoveResponsibility}
            />
          </section>
          {/* Progress Tracker */}
          <section className={`${prepmateColors.card} rounded-xl shadow p-4 border ${prepmateColors.border}`}>
            <SectionHeader icon={ListChecks} title="Progress Tracker" />
            <ProfileProgress
              user={safeUser}
              progress={safeUser.progress}
              setProgress={(progress) => {
                profile.setUser((prev) => ({
                  ...prev,
                  progress: Array.isArray(progress) ? progress : [],
                }));
              }}
              onEdit={handleProgressEdit}
              onSave={() => handleProfileUpdate({ progress: profile.user.progress })}
              onCancel={() => profile.setEditingProgress(null)}
              editingProgress={editingProgress}
            />
          </section>
          {/* Activity Feed */}
          <section className={`${prepmateColors.card} rounded-xl shadow p-4 border ${prepmateColors.border}`}>
            <SectionHeader icon={ActivityIcon} title="Activity Feed" />
            <ProfileActivityFeed
              user={safeUser}
              activity={safeUser.activity}
              setActivity={(activity) => {
                profile.setUser((prev) => ({ ...prev, activity }));
              }}
              onEdit={() => setEditingActivity(true)}
              onSave={() => handleProfileUpdate({ activityFeed: profile.user.activity })}
              onCancel={() => setEditingActivity(false)}
              editingActivity={editingActivity}
            />
          </section>
          {/* Achievements/Badges */}
          <section className={`${prepmateColors.card} rounded-xl shadow p-4 border ${prepmateColors.border}`}>
            <SectionHeader icon={Award} title="Badges & Achievements" />
            <ProfileBadges
              user={safeUser}
              badges={safeUser.badges}
              setBadges={(badges) => profile.setUser((prev) => ({ ...prev, badges }))}
              editingBadge={null}
              newBadge={newBadge}
              setNewBadge={setNewBadge}
              addingBadge={addingBadge}
              setAddingBadge={setAddingBadge}
              onEdit={() => {}}
              onSave={() => handleProfileUpdate({ badges: safeUser.badges })}
              onDelete={handleBadgeDelete}
              onAdd={handleBadgeAdd}
              onEditClick={() => {}}
              onCancelEdit={() => {}}
              onCancelAdd={() => setAddingBadge(false)}
            />
          </section>
          {/* Upcoming Events/Reminders */}
          <section className={`${prepmateColors.card} rounded-xl shadow p-4 border ${prepmateColors.border}`}>
            <SectionHeader icon={Calendar} title="Events & Reminders" />
            <ProfileEvents
              user={safeUser}
              events={safeUser.events}
              setEvents={(events) => profile.setUser((prev) => ({ ...prev, events }))}
              editingEvent={editingEvent}
              newEvent={newEvent}
              setNewEvent={setNewEvent}
              addingEvent={addingEvent}
              setAddingEvent={setAddingEvent}
              onEdit={handleEventEdit}
              onSave={() => handleProfileUpdate({ events: safeUser.events })}
              onDelete={handleEventDelete}
              onAdd={handleEventAdd}
              onEditClick={handleEventEdit}
              onCancelEdit={() => profile.setEditingEvent(null)}
              onCancelAdd={() => profile.setAddingEvent(false)}
            />
          </section>
          {/* Learning Path/Courses in Progress */}
          <section className={`${prepmateColors.card} rounded-xl shadow p-4 border ${prepmateColors.border}`}>
            <SectionHeader icon={BookOpen} title="Learning Path" />
            <ProfileLearningPath
              user={safeUser}
              learningPaths={safeUser.learningPath}
              setLearningPaths={(learningPath) => profile.setUser((prev) => ({ ...prev, learningPath }))}
              editingPath={editingLearning}
              newPath={newLearningPath}
              setNewPath={setNewLearningPath}
              addingPath={addingLearning}
              setAddingPath={setAddingLearning}
              onEdit={handleLearningEdit}
              onSave={() => handleProfileUpdate({ learningPath: safeUser.learningPath })}
              onDelete={handleLearningDelete}
              onAdd={handleLearningAdd}
              onEditClick={handleLearningEdit}
              onCancelEdit={() => profile.setEditingLearning(null)}
              onCancelAdd={() => profile.setAddingLearning(false)}
            />
          </section>
          {/* Settings Shortcuts */}
          <section className={`${prepmateColors.card} rounded-xl shadow p-4 border ${prepmateColors.border}`}>
            <SectionHeader icon={SettingsIcon} title="Settings" />
            <ProfileSettings
              user={safeUser}
              settings={settings}
              setSettings={setSettings}
              onEdit={() => setEditingSettings(true)}
              onSave={() => handleProfileUpdate({ settings })}
              onCancel={() => setEditingSettings(false)}
              editingSettings={editingSettings}
            />
          </section>
          {/* Quick Actions */}
          <section className={`${prepmateColors.card} rounded-xl shadow p-4 border ${prepmateColors.border}`}>
            <SectionHeader icon={Zap} title="Quick Actions" />
            <ProfileQuickActions
              user={safeUser}
              quickActions={safeUser.quickActions}
              setQuickActions={(quickActions) => profile.setUser((prev) => ({ ...prev, quickActions }))}
              onEdit={() => {}}
              onSave={() => handleProfileUpdate({ quickActions: safeUser.quickActions })}
              onCancel={() => {}}
              editingQuickActions={false}
            />
          </section>
        </div>
      </div>
    </div>
  );
} 