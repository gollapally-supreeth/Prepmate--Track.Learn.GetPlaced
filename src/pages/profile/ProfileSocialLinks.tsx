import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Linkedin, Github, Link2, Edit2, Save, X } from 'lucide-react';
import { FaLinkedin, FaGithub, FaTwitter, FaGlobe } from 'react-icons/fa';

export default function ProfileSocialLinks({ user, edit, social, setSocial, onSave, onEdit, onCancel }) {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {edit.social ? (
        <div className="flex flex-col gap-2 w-full max-w-xs">
          <Input value={social.linkedin} onChange={e => setSocial({ ...social, linkedin: e.target.value })} placeholder="Paste your LinkedIn profile URL (e.g. https://linkedin.com/in/yourname)" />
          <Input value={social.github} onChange={e => setSocial({ ...social, github: e.target.value })} placeholder="Paste your GitHub profile URL (e.g. https://github.com/yourname)" />
          <Input value={social.twitter} onChange={e => setSocial({ ...social, twitter: e.target.value })} placeholder="Paste your Twitter profile URL (e.g. https://twitter.com/yourname)" />
          <Input value={social.website} onChange={e => setSocial({ ...social, website: e.target.value })} placeholder="Paste your personal website URL (e.g. https://yourwebsite.com)" />
          <div className="flex gap-2 mt-2">
            <Button size="sm" onClick={onSave}><Save className="h-4 w-4 mr-1" />Save</Button>
            <Button size="sm" variant="outline" onClick={onCancel}><X className="h-4 w-4 mr-1" />Cancel</Button>
          </div>
        </div>
      ) : (
        <>
          {!(social.linkedin || social.github || social.twitter || social.website) && (
            <div className="w-full flex flex-col items-center justify-center p-4 bg-muted/30 rounded-lg border border-dashed border-gray-300 mb-2">
              <Link2 className="h-8 w-8 text-gray-400 mb-2" />
              <span className="text-gray-500 italic">No social links added yet.</span>
              <Button size="sm" variant="outline" className="mt-2" onClick={onEdit}>Add Social Links</Button>
            </div>
          )}
          {social.linkedin && (
            <a href={social.linkedin} target="_blank" rel="noopener noreferrer" title="LinkedIn">
              <FaLinkedin className="text-blue-700 hover:text-blue-900" size={24} />
            </a>
          )}
          {social.github && (
            <a href={social.github} target="_blank" rel="noopener noreferrer" title="GitHub">
              <FaGithub className="text-gray-800 hover:text-black" size={24} />
            </a>
          )}
          {social.twitter && (
            <a href={social.twitter} target="_blank" rel="noopener noreferrer" title="Twitter">
              <FaTwitter className="text-blue-400 hover:text-blue-600" size={24} />
            </a>
          )}
          {social.website && (
            <a href={social.website} target="_blank" rel="noopener noreferrer" title="Website">
              <FaGlobe className="text-green-700 hover:text-green-900" size={24} />
            </a>
          )}
          <Button size="icon" variant="ghost" onClick={onEdit}><Edit2 className="h-4 w-4" /></Button>
        </>
      )}
    </div>
  );
} 