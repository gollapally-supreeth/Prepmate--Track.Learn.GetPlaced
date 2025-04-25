import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Pencil, Save, X } from 'lucide-react';

export default function ProfileBio({ user, edit, bio, setBio, onSave, onEdit, onCancel }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div className="font-medium text-lg">Bio</div>
        {edit.bio ? null : <Button size="icon" variant="ghost" onClick={onEdit}><Pencil className="h-4 w-4" /></Button>}
      </div>
      {edit.bio ? (
        <div className="flex flex-col gap-2">
          <Textarea value={bio} onChange={e => setBio(e.target.value)} maxLength={180} className="resize-none" rows={2} />
          <div className="flex gap-2">
            <Button size="sm" onClick={onSave}><Save className="h-4 w-4 mr-1" />Save</Button>
            <Button size="sm" variant="outline" onClick={onCancel}><X className="h-4 w-4 mr-1" />Cancel</Button>
          </div>
        </div>
      ) : (
        <div className="text-muted-foreground text-base">{user.bio || <span className="italic">No bio yet.</span>}</div>
      )}
    </div>
  );
} 