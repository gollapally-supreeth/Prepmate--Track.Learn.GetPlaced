import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, Edit2, Save, X } from 'lucide-react';

export default function ProfileBasicInfo({ user, edit, basicInfo, setBasicInfo, onSave, onEdit, onCancel, onStatusSave, onStatusEdit, onStatusCancel }) {
  return (
    <div className="flex flex-col items-center mt-2 w-full">
      {edit.basic ? (
        <div className="flex flex-col gap-2 w-full items-center">
          <Input value={basicInfo.fullName} onChange={e => setBasicInfo({ ...basicInfo, fullName: e.target.value })} className="text-lg font-bold text-center" />
          <Input value={basicInfo.username} onChange={e => setBasicInfo({ ...basicInfo, username: e.target.value })} className="text-base text-center" />
          <Input value={basicInfo.contact} onChange={e => setBasicInfo({ ...basicInfo, contact: e.target.value })} className="text-xs text-center" placeholder="Contact Number" />
          <Input value={basicInfo.dob} onChange={e => setBasicInfo({ ...basicInfo, dob: e.target.value })} className="text-xs text-center" type="date" placeholder="Date of Birth" />
          <div className="flex gap-2 mt-2">
            <Button size="sm" onClick={onSave}><Save className="h-4 w-4 mr-1" />Save</Button>
            <Button size="sm" variant="outline" onClick={onCancel}><X className="h-4 w-4 mr-1" />Cancel</Button>
          </div>
        </div>
      ) : (
        <>
          <div className="font-bold text-2xl">{user.fullName}</div>
          <div className="text-muted-foreground text-base">@{user.username}</div>
          {user.contact && <div className="text-xs text-muted-foreground">{user.contact}</div>}
          {user.dob && <div className="text-xs text-muted-foreground">Born: {new Date(user.dob).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>}
          <Button size="icon" variant="ghost" className="mt-1" onClick={onEdit}><Pencil className="h-4 w-4" /></Button>
        </>
      )}
      <div className="flex gap-2 mt-2">
        <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">{user.status}</Badge>
        {edit.status ? (
          <>
            <Input value={basicInfo.status} onChange={e => setBasicInfo({ ...basicInfo, status: e.target.value })} className="text-xs" />
            <Button size="sm" onClick={onStatusSave}><Save className="h-4 w-4" /></Button>
            <Button size="sm" variant="outline" onClick={onStatusCancel}><X className="h-4 w-4" /></Button>
          </>
        ) : (
          <Button size="icon" variant="ghost" onClick={onStatusEdit}><Edit2 className="h-4 w-4" /></Button>
        )}
      </div>
    </div>
  );
} 