import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { BookOpen, Plus, Save, X, Edit2, Trash2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function ProfileLearningPath({ user, learningPaths, setLearningPaths, editingPath, newPath, setNewPath, addingPath, setAddingPath, onEdit, onSave, onDelete, onAdd, onEditClick, onCancelEdit, onCancelAdd }) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="h-5 w-5 text-[#2B4C7E]" />
        <span className="font-semibold text-lg text-[#2B4C7E]">Learning Path</span>
        <Button size="icon" variant="ghost" onClick={() => { setAddingPath(true); setNewPath({ course: '', percent: 0, deadline: '' }); }} title="Add Course">
          <Plus className="h-4 w-4 text-[#F9A826]" />
        </Button>
      </div>
      {learningPaths.length === 0 && (
        <div className="w-full flex flex-col items-center justify-center p-4 bg-muted/30 rounded-lg border border-dashed border-gray-300 mb-2">
          <BookOpen className="h-8 w-8 text-[#2B4C7E] mb-2" />
          <span className="text-gray-500 italic">No learning paths added yet.</span>
          <Button size="sm" variant="outline" className="mt-2" onClick={() => { setAddingPath(true); setNewPath({ course: '', percent: 0, deadline: '' }); }}>Add Course</Button>
        </div>
      )}
      <div className="flex flex-col gap-3">
        {learningPaths.map((path, idx) => (
          editingPath === idx ? (
            <div key={idx} className="flex flex-row flex-wrap gap-2 items-center bg-[#F4F8FB] dark:bg-[#232B43] rounded-lg p-4 border border-[#2B4C7E]/10">
              <Input value={newPath.course} onChange={e => setNewPath({ ...newPath, course: e.target.value })} className="w-32 text-xs overflow-x-auto whitespace-nowrap" placeholder="Course Name (e.g. React Bootcamp)" />
              <Input value={newPath.deadline} onChange={e => setNewPath({ ...newPath, deadline: e.target.value })} className="w-32 text-xs overflow-x-auto whitespace-nowrap" placeholder="Deadline (e.g. 2024-12-31)" />
              <Input value={newPath.percent} onChange={e => setNewPath({ ...newPath, percent: Number(e.target.value) })} className="w-20 text-xs overflow-x-auto whitespace-nowrap" placeholder="Progress % (e.g. 50)" type="number" min={0} max={100} />
              <Button size="icon" variant="ghost" onClick={() => onSave(idx)} title="Save"><Save className="h-4 w-4" /></Button>
              <Button size="icon" variant="ghost" onClick={onCancelEdit} title="Cancel"><X className="h-4 w-4" /></Button>
            </div>
          ) : (
            <div key={idx} className="flex items-center gap-4 bg-white dark:bg-[#232B43] rounded-lg p-4 border border-[#2B4C7E]/10 shadow-sm">
              <BookOpen className="h-5 w-5 text-[#F9A826]" />
              <div className="flex-1">
                <div className="font-medium text-base text-[#2B4C7E]">{path.course}</div>
                <div className="text-xs text-muted-foreground">Deadline: {path.deadline}</div>
                <div className="relative w-full h-2 mt-1 bg-[#EAF0F7] rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full rounded-full transition-all"
                    style={{ width: `${path.percent}%`, background: '#F9A826' }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-[#2B4C7E]">{path.percent}%</span>
                <Button size="icon" variant="ghost" onClick={() => onEditClick(idx)} title="Edit"><Edit2 className="h-4 w-4" /></Button>
                <Button size="icon" variant="ghost" onClick={() => onDelete(idx)} title="Delete"><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            </div>
          )
        ))}
        {addingPath && (
          <div className="flex flex-row flex-wrap gap-2 items-center bg-[#F4F8FB] dark:bg-[#232B43] rounded-lg p-4 border border-[#2B4C7E]/10">
            <Input value={newPath.course} onChange={e => setNewPath({ ...newPath, course: e.target.value })} className="w-32 text-xs overflow-x-auto whitespace-nowrap" placeholder="Course Name (e.g. React Bootcamp)" />
            <Input value={newPath.deadline} onChange={e => setNewPath({ ...newPath, deadline: e.target.value })} className="w-32 text-xs overflow-x-auto whitespace-nowrap" placeholder="Deadline (e.g. 2024-12-31)" />
            <Input value={newPath.percent} onChange={e => setNewPath({ ...newPath, percent: Number(e.target.value) })} className="w-20 text-xs overflow-x-auto whitespace-nowrap" placeholder="Progress % (e.g. 50)" type="number" min={0} max={100} />
            <Button size="icon" variant="ghost" onClick={onAdd} title="Add"><Save className="h-4 w-4" /></Button>
            <Button size="icon" variant="ghost" onClick={onCancelAdd} title="Cancel"><X className="h-4 w-4" /></Button>
          </div>
        )}
      </div>
    </section>
  );
} 