import React from 'react';
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
  const {
    user, edit, basicInfo, setBasicInfo, handleBasicSave, handleStatusSave,
    bio, setBio, handleBioSave,
    academics, setAcademics, handleAcademicsSave,
    social, setSocial, handleSocialSave,
    avatarUrl, avatarInputRef, handleAvatarUpload, handleAvatarChange, handleAvatarSave,
    editingSkill, newSkill, setNewSkill, addingSkill, setAddingSkill, handleSkillEdit, handleSkillSave, handleSkillDelete, handleSkillAdd,
    editingProject, newProject, setNewProject, addingProject, setAddingProject, newTech, setNewTech, handleProjectEdit, handleProjectSave, handleProjectDelete, handleProjectAdd, handleAddTech, handleRemoveTech,
    editingExperience, newExperience, setNewExperience, addingExperience, setAddingExperience, responsibilityText, setResponsibilityText, handleExperienceEdit, handleExperienceSave, handleExperienceDelete, handleExperienceAdd, handleAddResponsibility, handleRemoveResponsibility,
    newBadge, setNewBadge, addingBadge, setAddingBadge, handleBadgeAdd, handleBadgeDelete,
    editingEvent, newEvent, setNewEvent, addingEvent, setAddingEvent, handleEventEdit, handleEventSave, handleEventDelete, handleEventAdd,
    editingLearning, newLearningPath, setNewLearningPath, addingLearning, setAddingLearning, handleLearningEdit, handleLearningSave, handleLearningDelete, handleLearningAdd,
    editingProgress, newProgress, setNewProgress, addingProgress, setAddingProgress, handleProgressEdit, handleProgressSave, handleProgressDelete, handleProgressAdd,
    settings, setSettings, editingSettings, setEditingSettings, handleSettingsChange, handleSettingsSave,
    handleEditFullProfile, handleAddProject, handleUpdateResume, handleChangePassword,
    activity, setActivity, editingActivity, setEditingActivity, handleActivityEdit, handleActivitySave, handleActivityDelete, handleActivityAdd,
    quickActions, setQuickActions, editingQuickActions, setEditingQuickActions, handleQuickActionEdit, handleQuickActionSave, handleQuickActionDelete, handleQuickActionAdd,
  } = profile;

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#F4F8FB] to-[#EAF0F7] dark:bg-[#10141A] flex flex-col items-center py-8 px-2 sm:px-8">
      <div className="w-full max-w-4xl {prepmateColors.card} rounded-2xl shadow-2xl p-6 flex flex-col gap-10">
        {/* Profile Picture & Basic Info */}
        <section className={`flex flex-col items-center gap-4 ${prepmateColors.card} rounded-xl shadow p-6 border ${prepmateColors.border}`}>
          <SectionHeader icon={User} title="Basic Information" />
          <div className="relative group mb-2">
            <Avatar className="h-28 w-28 border-4 border-[#F9A826] shadow-lg">
              <AvatarImage src={avatarUrl || '/avatar-placeholder.png'} alt={user.fullName} />
              <AvatarFallback>{user.fullName[0]}</AvatarFallback>
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
            user={user}
            edit={edit}
            basicInfo={basicInfo}
            setBasicInfo={setBasicInfo}
            onSave={handleBasicSave}
            onEdit={() => profile.setEdit((prev) => ({ ...prev, basic: true }))}
            onCancel={() => profile.setEdit((prev) => ({ ...prev, basic: false }))}
            onStatusSave={handleStatusSave}
            onStatusEdit={() => profile.setEdit((prev) => ({ ...prev, status: true }))}
            onStatusCancel={() => profile.setEdit((prev) => ({ ...prev, status: false }))}
          />
        </section>
        {/* Social Links */}
        <section className={`${prepmateColors.card} rounded-xl shadow p-6 border ${prepmateColors.border}`}>
          <SectionHeader icon={Link2} title="Social Links" />
          <ProfileSocialLinks
            user={user}
            edit={edit}
            social={social}
            setSocial={setSocial}
            onSave={handleSocialSave}
            onEdit={() => profile.setEdit((prev) => ({ ...prev, social: true }))}
            onCancel={() => profile.setEdit((prev) => ({ ...prev, social: false }))}
          />
        </section>
        {/* Quick Bio */}
        <section className={`${prepmateColors.card} rounded-xl shadow p-6 border ${prepmateColors.border}`}>
          <SectionHeader icon={ActivityIcon} title="Bio" />
          <ProfileBio
            user={user}
            edit={edit}
            bio={bio}
            setBio={setBio}
            onSave={handleBioSave}
            onEdit={() => profile.setEdit((prev) => ({ ...prev, bio: true }))}
            onCancel={() => profile.setEdit((prev) => ({ ...prev, bio: false }))}
          />
        </section>
        {/* Academic Info */}
        <section className={`${prepmateColors.card} rounded-xl shadow p-6 border ${prepmateColors.border}`}>
          <SectionHeader icon={Layers} title="Academic Information" />
          <ProfileAcademics
            user={user}
            edit={edit}
            academics={academics}
            setAcademics={setAcademics}
            onSave={handleAcademicsSave}
            onEdit={() => profile.setEdit((prev) => ({ ...prev, academics: true }))}
            onCancel={() => profile.setEdit((prev) => ({ ...prev, academics: false }))}
          />
        </section>
        {/* Skills Section */}
        <section className={`${prepmateColors.card} rounded-xl shadow p-6 border ${prepmateColors.border}`}>
          <SectionHeader icon={Star} title="Skills" />
          <ProfileSkills
            user={user}
            skills={user.skills}
            setSkills={skills => profile.setUser(prev => ({ ...prev, skills }))}
            editingSkill={editingSkill}
            setEditingSkill={profile.setEditingSkill}
            newSkill={newSkill}
            setNewSkill={setNewSkill}
            addingSkill={addingSkill}
            setAddingSkill={setAddingSkill}
            onCancelEdit={() => profile.setEditingSkill(null)}
            onCancelAdd={() => profile.setAddingSkill(false)}
          />
        </section>
        {/* Project Showcase */}
        <section className={`${prepmateColors.card} rounded-xl shadow p-6 border ${prepmateColors.border}`}>
          <SectionHeader icon={Zap} title="Projects" />
          <ProfileProjects
            user={user}
            editingProject={editingProject}
            newProject={newProject}
            setNewProject={setNewProject}
            addingProject={addingProject}
            setAddingProject={setAddingProject}
            newTech={newTech}
            setNewTech={setNewTech}
            onEdit={handleProjectEdit}
            onSave={handleProjectSave}
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
        <section className={`${prepmateColors.card} rounded-xl shadow p-6 border ${prepmateColors.border}`}>
          <SectionHeader icon={Briefcase} title="Experience" />
          <ProfileExperience
            user={user}
            editingExperience={editingExperience}
            newExperience={newExperience}
            setNewExperience={setNewExperience}
            addingExperience={addingExperience}
            setAddingExperience={setAddingExperience}
            responsibilityText={responsibilityText}
            setResponsibilityText={setResponsibilityText}
            onEdit={handleExperienceEdit}
            onSave={handleExperienceSave}
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
        <section className={`${prepmateColors.card} rounded-xl shadow p-6 border ${prepmateColors.border}`}>
          <SectionHeader icon={ListChecks} title="Progress Tracker" />
          <ProfileProgress
            user={user}
            progress={user.progress}
            setProgress={setNewProgress}
            onEdit={handleProgressEdit}
            onSave={handleProgressSave}
            onCancel={() => profile.setEditingProgress(null)}
            editingProgress={editingProgress}
          />
        </section>
        {/* Activity Feed */}
        <section className={`${prepmateColors.card} rounded-xl shadow p-6 border ${prepmateColors.border}`}>
          <SectionHeader icon={ActivityIcon} title="Activity Feed" />
          <ProfileActivityFeed
            user={user}
            activity={user.activity}
            setActivity={(activity) => profile.setUser((prev) => ({ ...prev, activity }))}
            onEdit={() => setEditingActivity(true)}
            onSave={() => setEditingActivity(false)}
            onCancel={() => setEditingActivity(false)}
            editingActivity={editingActivity}
          />
        </section>
        {/* Achievements/Badges */}
        <section className={`${prepmateColors.card} rounded-xl shadow p-6 border ${prepmateColors.border}`}>
          <SectionHeader icon={Award} title="Badges & Achievements" />
          <ProfileBadges
            user={user}
            badges={user.badges}
            setBadges={(badges) => profile.setUser((prev) => ({ ...prev, badges }))}
            editingBadge={null}
            newBadge={newBadge}
            setNewBadge={setNewBadge}
            addingBadge={addingBadge}
            setAddingBadge={setAddingBadge}
            onEdit={() => {}}
            onSave={() => {}}
            onDelete={handleBadgeDelete}
            onAdd={handleBadgeAdd}
            onEditClick={() => {}}
            onCancelEdit={() => {}}
            onCancelAdd={() => setAddingBadge(false)}
          />
        </section>
        {/* Upcoming Events/Reminders */}
        <section className={`${prepmateColors.card} rounded-xl shadow p-6 border ${prepmateColors.border}`}>
          <SectionHeader icon={Calendar} title="Events & Reminders" />
          <ProfileEvents
            user={user}
            events={user.events}
            setEvents={(events) => profile.setUser((prev) => ({ ...prev, events }))}
            editingEvent={editingEvent}
            newEvent={newEvent}
            setNewEvent={setNewEvent}
            addingEvent={addingEvent}
            setAddingEvent={setAddingEvent}
            onEdit={handleEventEdit}
            onSave={handleEventSave}
            onDelete={handleEventDelete}
            onAdd={handleEventAdd}
            onEditClick={handleEventEdit}
            onCancelEdit={() => profile.setEditingEvent(null)}
            onCancelAdd={() => profile.setAddingEvent(false)}
          />
        </section>
        {/* Learning Path/Courses in Progress */}
        <section className={`${prepmateColors.card} rounded-xl shadow p-6 border ${prepmateColors.border}`}>
          <SectionHeader icon={BookOpen} title="Learning Path" />
          <ProfileLearningPath
            user={user}
            learningPaths={user.learningPath}
            setLearningPaths={(learningPath) => profile.setUser((prev) => ({ ...prev, learningPath }))}
            editingPath={editingLearning}
            newPath={newLearningPath}
            setNewPath={setNewLearningPath}
            addingPath={addingLearning}
            setAddingPath={setAddingLearning}
            onEdit={handleLearningEdit}
            onSave={handleLearningSave}
            onDelete={handleLearningDelete}
            onAdd={handleLearningAdd}
            onEditClick={handleLearningEdit}
            onCancelEdit={() => profile.setEditingLearning(null)}
            onCancelAdd={() => profile.setAddingLearning(false)}
          />
        </section>
        {/* Settings Shortcuts */}
        <section className={`${prepmateColors.card} rounded-xl shadow p-6 border ${prepmateColors.border}`}>
          <SectionHeader icon={SettingsIcon} title="Settings" />
          <ProfileSettings
            user={user}
            settings={settings}
            setSettings={setSettings}
            onEdit={() => setEditingSettings(true)}
            onSave={handleSettingsSave}
            onCancel={() => setEditingSettings(false)}
            editingSettings={editingSettings}
          />
        </section>
        {/* Quick Actions */}
        <section className={`${prepmateColors.card} rounded-xl shadow p-6 border ${prepmateColors.border}`}>
          <SectionHeader icon={Zap} title="Quick Actions" />
          <ProfileQuickActions
            user={user}
            quickActions={user.quickActions || []}
            setQuickActions={(quickActions) => profile.setUser((prev) => ({ ...prev, quickActions }))}
            onEdit={() => {}}
            onSave={() => {}}
            onCancel={() => {}}
            editingQuickActions={false}
          />
        </section>
      </div>
    </div>
  );
} 