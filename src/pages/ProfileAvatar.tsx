import React, { useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Upload, Save } from 'lucide-react';

export default function ProfileAvatar({ avatarUrl, userFullName, onAvatarChange, onAvatarSave, showSaveButton }) {
  const avatarInputRef = useRef(null);

  const handleAvatarUpload = () => {
    avatarInputRef.current?.click();
  };

  return (
    <div className="relative group">
      <Avatar className="h-28 w-28 border-4 border-primary shadow-lg">
        <AvatarImage src={avatarUrl || '/avatar-placeholder.png'} alt={userFullName} />
        <AvatarFallback>{userFullName[0]}</AvatarFallback>
      </Avatar>
      <label className="absolute bottom-0 right-0 bg-primary rounded-full p-2 cursor-pointer shadow group-hover:scale-110 transition-transform" onClick={handleAvatarUpload}>
        <Upload className="h-5 w-5 text-white" />
        <input type="file" accept="image/*" className="hidden" ref={avatarInputRef} onChange={onAvatarChange} />
      </label>
      {showSaveButton && (
        <Button 
          size="sm" 
          className="absolute -bottom-8 left-1/2 transform -translate-x-1/2"
          onClick={onAvatarSave}
        >
          <Save className="h-3 w-3 mr-1" />Save Avatar
        </Button>
      )}
    </div>
  );
} 