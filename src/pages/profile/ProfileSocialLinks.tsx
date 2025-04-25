import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Linkedin, Github, Link2, Edit2, Save, X } from 'lucide-react';

export default function ProfileSocialLinks({ user, edit, social, setSocial, onSave, onEdit, onCancel }) {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {edit.social ? (
        <div className="flex flex-col gap-2 w-full max-w-xs">
          <Input value={social.linkedin} onChange={e => setSocial({ ...social, linkedin: e.target.value })} placeholder="LinkedIn URL" />
          <Input value={social.github} onChange={e => setSocial({ ...social, github: e.target.value })} placeholder="GitHub URL" />
          <Input value={social.twitter} onChange={e => setSocial({ ...social, twitter: e.target.value })} placeholder="Twitter URL" />
          <Input value={social.website} onChange={e => setSocial({ ...social, website: e.target.value })} placeholder="Website URL" />
          <div className="flex gap-2 mt-2">
            <Button size="sm" onClick={onSave}><Save className="h-4 w-4 mr-1" />Save</Button>
            <Button size="sm" variant="outline" onClick={onCancel}><X className="h-4 w-4 mr-1" />Cancel</Button>
          </div>
        </div>
      ) : (
        <>
          {user.social.linkedin && <a href={user.social.linkedin} target="_blank" rel="noopener noreferrer"><Button size="icon" variant="outline"><Linkedin className="h-5 w-5" /></Button></a>}
          {user.social.github && <a href={user.social.github} target="_blank" rel="noopener noreferrer"><Button size="icon" variant="outline"><Github className="h-5 w-5" /></Button></a>}
          {user.social.twitter && <a href={user.social.twitter} target="_blank" rel="noopener noreferrer"><Button size="icon" variant="outline"><Link2 className="h-5 w-5" /></Button></a>}
          {user.social.website && <a href={user.social.website} target="_blank" rel="noopener noreferrer"><Button size="icon" variant="outline"><Link2 className="h-5 w-5" /></Button></a>}
          <Button size="icon" variant="ghost" onClick={onEdit}><Edit2 className="h-4 w-4" /></Button>
        </>
      )}
    </div>
  );
} 