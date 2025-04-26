import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Save, X, Edit2, Trash2, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ProfileSkills({ user, skills = [], setSkills, editingSkill, setEditingSkill, newSkill, setNewSkill, addingSkill, setAddingSkill, onEdit, onSave, onDelete, onAdd, onEditClick, onCancelEdit, onCancelAdd }) {
  // Ensure newSkill is an object with name, level, and rating
  const safeNewSkill = typeof newSkill === 'object' && newSkill !== null ? newSkill : { name: '', level: 'Beginner', rating: 1 };

  // Handlers that update the parent state directly
  const handleEditClick = (idx) => {
    setEditingSkill(idx);
    setNewSkill({ ...skills[idx] });
  };
  const handleSave = (idx) => {
    const updatedSkills = [...skills];
    updatedSkills[idx] = { ...safeNewSkill };
    setSkills(updatedSkills);
    setEditingSkill(null);
    setNewSkill({ name: '', level: 'Beginner', rating: 1 });
  };
  const handleDelete = (idx) => {
    const updatedSkills = skills.filter((_, i) => i !== idx);
    setSkills(updatedSkills);
  };
  const handleAdd = () => {
    setSkills([...skills, { ...safeNewSkill }]);
    setNewSkill({ name: '', level: 'Beginner', rating: 1 });
    setAddingSkill(false);
  };

  return (
    <section className="mb-6">
      <div className="bg-white dark:bg-[#232B43] rounded-xl shadow-md border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="font-semibold text-lg text-[#2B4C7E]">Skills</span>
          <Button size="icon" variant="ghost" onClick={() => {
            setAddingSkill(true);
            setNewSkill({ name: '', level: 'Beginner', rating: 1 });
          }} title="Add Skill">
            <Plus className="h-4 w-4 text-[#F9A826]" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {skills.length === 0 && (
            <div className="w-full flex flex-col items-center justify-center p-4 bg-muted/30 rounded-lg border border-dashed border-gray-300 mb-2">
              <Star className="h-8 w-8 text-yellow-400 mb-2" />
              <span className="text-gray-500 italic">No skills added yet.</span>
              <Button size="sm" variant="outline" className="mt-2" onClick={() => { setAddingSkill(true); setNewSkill({ name: '', level: 'Beginner', rating: 1 }); }}>Add Skill</Button>
            </div>
          )}
          {skills.map((skill, idx) => (
            editingSkill === idx ? (
              <div key={skill.name || idx} className="flex flex-col md:flex-row items-center gap-2 bg-[#F4F8FB] dark:bg-[#232B43] rounded-lg p-2 border border-[#2B4C7E]/10">
                <Input value={safeNewSkill.name} onChange={e => setNewSkill({ ...safeNewSkill, name: e.target.value })} className="w-full md:w-32 text-xs overflow-x-auto whitespace-nowrap" placeholder="Skill Name (e.g. JavaScript)" />
                <select value={safeNewSkill.level} onChange={e => setNewSkill({ ...safeNewSkill, level: e.target.value })} className="text-xs rounded px-1 py-0.5">
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
                <span className="flex gap-0.5 ml-1">
                  {[1,2,3,4,5].map((n) => (
                    <Star key={n} className={cn('h-4 w-4 cursor-pointer', n <= safeNewSkill.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300')} onClick={() => setNewSkill({ ...safeNewSkill, rating: n })} />
                  ))}
                </span>
                <Button size="icon" variant="ghost" className="ml-1" onClick={() => handleSave(idx)} title="Save"><Save className="h-4 w-4" /></Button>
                <Button size="icon" variant="ghost" className="ml-1" onClick={onCancelEdit} title="Cancel"><X className="h-4 w-4" /></Button>
              </div>
            ) : (
              <div key={skill.name || idx} className="flex items-center gap-2 bg-[#F9FAFB] dark:bg-[#1A2236] border border-slate-200 dark:border-slate-700 shadow-sm rounded-lg px-4 py-2">
                <span className="font-medium text-sm text-[#2B4C7E]">{skill.name}</span>
                <Badge className={cn('ml-1', skill.level === 'Advanced' && 'bg-emerald-500', skill.level === 'Intermediate' && 'bg-amber-500', skill.level === 'Beginner' && 'bg-slate-400')}>{skill.level}</Badge>
                <span className="flex gap-0.5 ml-1">
                  {[...Array(skill.rating)].map((_, i) => <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />)}
                </span>
                <Button size="icon" variant="ghost" className="ml-1" onClick={() => handleEditClick(idx)} title="Edit"><Edit2 className="h-4 w-4" /></Button>
                <Button size="icon" variant="ghost" className="ml-1" onClick={() => handleDelete(idx)} title="Delete"><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            )
          ))}
          {addingSkill && (
            <div className="flex flex-col md:flex-row items-center gap-2 bg-[#F4F8FB] dark:bg-[#232B43] rounded-lg p-2 border border-[#2B4C7E]/10">
              <Input value={safeNewSkill.name} onChange={e => setNewSkill({ ...safeNewSkill, name: e.target.value })} className="w-full md:w-32 text-xs overflow-x-auto whitespace-nowrap" placeholder="Skill Name (e.g. JavaScript)" />
              <select value={safeNewSkill.level} onChange={e => setNewSkill({ ...safeNewSkill, level: e.target.value })} className="text-xs rounded px-1 py-0.5">
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
              <span className="flex gap-0.5 ml-1">
                {[1,2,3,4,5].map((n) => (
                  <Star key={n} className={cn('h-4 w-4 cursor-pointer', n <= safeNewSkill.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300')} onClick={() => setNewSkill({ ...safeNewSkill, rating: n })} />
                ))}
              </span>
              <Button size="icon" variant="ghost" className="ml-1" onClick={handleAdd} title="Add"><Save className="h-4 w-4" /></Button>
              <Button size="icon" variant="ghost" className="ml-1" onClick={onCancelAdd} title="Cancel"><X className="h-4 w-4" /></Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
