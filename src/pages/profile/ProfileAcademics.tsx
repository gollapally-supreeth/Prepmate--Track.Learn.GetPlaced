import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Pencil, Save, X } from 'lucide-react';

export default function ProfileAcademics({ user, edit, academics, setAcademics, onSave, onEdit, onCancel }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div className="font-medium text-lg">Academic Information</div>
        {edit.academics ? null : <Button size="icon" variant="ghost" onClick={onEdit}><Pencil className="h-4 w-4" /></Button>}
      </div>
      {edit.academics ? (
        <div className="flex flex-col gap-2">
          <Input value={academics.course} onChange={e => setAcademics({ ...academics, course: e.target.value })} placeholder="Course" />
          <div className="flex gap-2">
            <Input value={academics.semester} onChange={e => setAcademics({ ...academics, semester: Number(e.target.value) })} type="number" min={1} max={academics.totalSemesters} className="w-24" placeholder="Semester" />
            <Input value={academics.totalSemesters} onChange={e => setAcademics({ ...academics, totalSemesters: Number(e.target.value) })} type="number" min={1} className="w-24" placeholder="Total Semesters" />
            <Input value={academics.cgpa} onChange={e => setAcademics({ ...academics, cgpa: Number(e.target.value) })} type="number" step="0.01" min={0} max={10} className="w-24" placeholder="CGPA" />
          </div>
          <div className="flex gap-2 mt-2">
            <Button size="sm" onClick={onSave}><Save className="h-4 w-4 mr-1" />Save</Button>
            <Button size="sm" variant="outline" onClick={onCancel}><X className="h-4 w-4 mr-1" />Cancel</Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">{user.course}</span>
            <span className="text-xs text-muted-foreground">Semester {user.semester} of {user.totalSemesters}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs">CGPA:</span>
            <span className="font-semibold text-sm">{user.cgpa ?? 'Not Provided'}</span>
            <Progress value={user.semester / user.totalSemesters * 100} className="h-1 w-24 ml-2" />
          </div>
        </div>
      )}
    </div>
  );
} 