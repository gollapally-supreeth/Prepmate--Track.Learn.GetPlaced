import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Save, X, Edit2, Trash2, Award, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

const badgeIcons = {
  Award: Award,
  BookOpen: BookOpen,
};

export default function ProfileBadges({ user, badges, setBadges, editingBadge, newBadge, setNewBadge, addingBadge, setAddingBadge, onEdit, onSave, onDelete, onAdd, onEditClick, onCancelEdit, onCancelAdd }) {
  return (
    <section className="mb-6">
      <div className="bg-white dark:bg-[#232B43] rounded-xl shadow-md border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Award className="h-5 w-5 text-[#F9A826]" />
          <span className="font-semibold text-lg text-[#2B4C7E]">Badges</span>
          <Button size="icon" variant="ghost" onClick={() => {
            setAddingBadge(true);
            setNewBadge({ name: '', description: '', icon: '' });
          }} title="Add Badge">
            <Plus className="h-4 w-4 text-[#F9A826]" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-4">
          {badges.map((badge, idx) => (
            editingBadge === idx ? (
              <div key={badge.name} className="flex flex-col md:flex-row items-center gap-2 bg-[#F4F8FB] dark:bg-[#232B43] rounded-lg p-4 border border-[#2B4C7E]/10 w-full max-w-xs">
                <Input value={newBadge.name} onChange={e => setNewBadge({ ...newBadge, name: e.target.value })} className="w-full md:w-24 text-xs" placeholder="Badge Name" />
                <Input value={newBadge.description} onChange={e => setNewBadge({ ...newBadge, description: e.target.value })} className="w-full md:w-32 text-xs" placeholder="Description" />
                <Input value={newBadge.icon} onChange={e => setNewBadge({ ...newBadge, icon: e.target.value })} className="w-full md:w-20 text-xs" placeholder="Icon (Award/BookOpen)" />
                <Button size="icon" variant="ghost" className="ml-1" onClick={() => onSave(idx)} title="Save"><Save className="h-4 w-4" /></Button>
                <Button size="icon" variant="ghost" className="ml-1" onClick={onCancelEdit} title="Cancel"><X className="h-4 w-4" /></Button>
              </div>
            ) : (
              <div key={badge.name} className="flex items-center gap-3 bg-[#F9FAFB] dark:bg-[#1A2236] rounded-lg p-4 border border-slate-200 dark:border-slate-700 shadow-sm w-full max-w-xs">
                {badge.icon && badgeIcons[badge.icon] ? (
                  React.createElement(badgeIcons[badge.icon], { className: 'h-6 w-6 text-[#F9A826]' })
                ) : (
                  <Award className="h-6 w-6 text-[#F9A826]" />
                )}
                <div className="flex-1">
                  <div className="font-medium text-base text-[#2B4C7E]">{badge.name}</div>
                  <div className="text-xs text-muted-foreground">{badge.description}</div>
                </div>
                <Button size="icon" variant="ghost" className="ml-1" onClick={() => onEditClick(idx)} title="Edit"><Edit2 className="h-4 w-4" /></Button>
                <Button size="icon" variant="ghost" className="ml-1" onClick={() => onDelete(idx)} title="Delete"><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            )
          ))}
          {addingBadge && (
            <div className="flex flex-col md:flex-row items-center gap-2 bg-[#F4F8FB] dark:bg-[#232B43] rounded-lg p-4 border border-[#2B4C7E]/10 w-full max-w-xs">
              <Input value={newBadge.name} onChange={e => setNewBadge({ ...newBadge, name: e.target.value })} className="w-full md:w-24 text-xs" placeholder="Badge Name" />
              <Input value={newBadge.description} onChange={e => setNewBadge({ ...newBadge, description: e.target.value })} className="w-full md:w-32 text-xs" placeholder="Description" />
              <Input value={newBadge.icon} onChange={e => setNewBadge({ ...newBadge, icon: e.target.value })} className="w-full md:w-20 text-xs" placeholder="Icon (Award/BookOpen)" />
              <Button size="icon" variant="ghost" className="ml-1" onClick={onAdd} title="Add"><Save className="h-4 w-4" /></Button>
              <Button size="icon" variant="ghost" className="ml-1" onClick={onCancelAdd} title="Cancel"><X className="h-4 w-4" /></Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
} 