import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Pencil, Save, X, Plus, BookOpen } from 'lucide-react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog';

export default function ProfileAcademics({ user, edit, educations, setAcademics, onSave, onEdit, onCancel, editingEducation, setEditingEducation, newEducation, setNewEducation, addingEducation, setAddingEducation, handleEducationEdit, handleEducationSave, handleEducationDelete, handleEducationAdd }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 mb-1">
        <div className="font-medium text-lg">Academic Information</div>
        <Button size="icon" variant="ghost" onClick={onEdit} disabled={edit.academics}><Pencil className="h-4 w-4" /></Button>
        <Button size="icon" variant="ghost" onClick={() => setAddingEducation(true)}><Plus className="h-4 w-4" /></Button>
      </div>
      <div className="flex flex-col gap-2">
        {educations && educations.length > 0 ? (
          educations.map((edu, idx) => (
            <div key={idx} className="flex items-start gap-2 p-3 rounded-xl hover:bg-muted transition bg-white dark:bg-[#1A2233] border border-[#2B4C7E]/20 shadow-md">
              <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center">
                <span className="text-lg font-bold text-[#2B4C7E] dark:text-[#F9A826]">{edu.school ? edu.school[0] : '?'}</span>
              </div>
              <div className="flex-1">
                <div className="font-semibold text-lg flex items-center gap-1">
                  {edu.degree}
                  {edu.fieldOfStudy && <span className="ml-1 text-sm font-normal text-muted-foreground">in {edu.fieldOfStudy}</span>}
                </div>
                <div className="text-sm text-muted-foreground">{edu.school} {edu.startYear && edu.endYear && <>({edu.startYear} - {edu.endYear})</>}</div>
                {edu.grade && <div className="text-sm text-muted-foreground">CGPA/Grade: <span className="font-semibold text-[#2B4C7E] dark:text-[#F9A826]">{edu.grade}</span></div>}
                {edu.description && <div className="text-xs text-muted-foreground mt-1">{edu.description}</div>}
              </div>
              <Button size="icon" variant="ghost" onClick={() => handleEducationEdit(idx)}><Pencil className="h-4 w-4" /></Button>
              <Button size="icon" variant="ghost" onClick={() => handleEducationDelete(idx)}><X className="h-4 w-4 text-destructive" /></Button>
            </div>
          ))
        ) : (
          <div className="w-full flex flex-col items-center justify-center p-4 bg-muted/30 rounded-lg border border-dashed border-gray-300 mb-2">
            <BookOpen className="h-8 w-8 text-[#2B4C7E] mb-2" />
            <span className="text-gray-500 italic">No education added yet.</span>
            <Button size="sm" variant="outline" className="mt-2" onClick={() => setAddingEducation(true)}>Add Education</Button>
          </div>
        )}
      </div>
      <Dialog open={addingEducation} onOpenChange={setAddingEducation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Education</DialogTitle>
            <DialogDescription>Fill in your education details below.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <Input value={newEducation.school} onChange={e => setNewEducation({ ...newEducation, school: e.target.value })} placeholder="School/College (e.g. MIT)" className="overflow-x-auto whitespace-nowrap" />
            <Input value={newEducation.degree} onChange={e => setNewEducation({ ...newEducation, degree: e.target.value })} placeholder="Degree (e.g. B.Tech)" className="overflow-x-auto whitespace-nowrap" />
            <Input value={newEducation.fieldOfStudy} onChange={e => setNewEducation({ ...newEducation, fieldOfStudy: e.target.value })} placeholder="Field of Study (e.g. Computer Science)" className="overflow-x-auto whitespace-nowrap" />
            <div className="flex gap-2">
              <Input value={newEducation.startYear} onChange={e => setNewEducation({ ...newEducation, startYear: e.target.value })} placeholder="Start Year (e.g. 2020)" type="number" className="w-1/2 overflow-x-auto whitespace-nowrap" />
              <Input value={newEducation.endYear} onChange={e => setNewEducation({ ...newEducation, endYear: e.target.value })} placeholder="End Year (e.g. 2024)" type="number" className="w-1/2 overflow-x-auto whitespace-nowrap" />
            </div>
            <Input value={newEducation.grade} onChange={e => setNewEducation({ ...newEducation, grade: e.target.value })} placeholder="Grade/CGPA (e.g. 9.2)" className="overflow-x-auto whitespace-nowrap" />
            <Input value={newEducation.description} onChange={e => setNewEducation({ ...newEducation, description: e.target.value })} placeholder="Description (optional)" className="overflow-x-auto whitespace-nowrap" />
          </div>
          <DialogFooter>
            <Button size="sm" onClick={handleEducationAdd}><Save className="h-4 w-4 mr-1" />Add</Button>
            <Button size="sm" variant="outline" onClick={() => setAddingEducation(false)}><X className="h-4 w-4 mr-1" />Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={editingEducation !== null} onOpenChange={v => { if (!v) setEditingEducation(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Education</DialogTitle>
            <DialogDescription>Update your education details below.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <Input value={newEducation.school} onChange={e => setNewEducation({ ...newEducation, school: e.target.value })} placeholder="School/College" />
            <Input value={newEducation.degree} onChange={e => setNewEducation({ ...newEducation, degree: e.target.value })} placeholder="Degree" />
            <Input value={newEducation.fieldOfStudy} onChange={e => setNewEducation({ ...newEducation, fieldOfStudy: e.target.value })} placeholder="Field of Study" />
            <div className="flex gap-2">
              <Input value={newEducation.startYear} onChange={e => setNewEducation({ ...newEducation, startYear: e.target.value })} placeholder="Start Year" type="number" className="w-1/2" />
              <Input value={newEducation.endYear} onChange={e => setNewEducation({ ...newEducation, endYear: e.target.value })} placeholder="End Year" type="number" className="w-1/2" />
            </div>
            <Input value={newEducation.grade} onChange={e => setNewEducation({ ...newEducation, grade: e.target.value })} placeholder="Grade/CGPA" />
            <Input value={newEducation.description} onChange={e => setNewEducation({ ...newEducation, description: e.target.value })} placeholder="Description (optional)" />
          </div>
          <DialogFooter>
            <Button size="sm" onClick={() => handleEducationSave(editingEducation)}><Save className="h-4 w-4 mr-1" />Save</Button>
            <Button size="sm" variant="outline" onClick={() => setEditingEducation(null)}><X className="h-4 w-4 mr-1" />Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 