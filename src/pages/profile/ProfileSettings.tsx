import React from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Sun, Moon, Bell, Eye, EyeOff, Save, X, Edit2 } from 'lucide-react';

export default function ProfileSettings({ user, settings, setSettings, onEdit, onSave, onCancel, editingSettings }) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <Sun className="h-5 w-5 text-[#F9A826]" />
        <span className="font-semibold text-lg text-[#2B4C7E]">Settings</span>
        {!editingSettings && (
          <Button size="icon" variant="ghost" onClick={onEdit} title="Edit Settings">
            <Edit2 className="h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex flex-col gap-4">
        {/* Dark/Light Mode Toggle */}
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-sm font-medium text-[#2B4C7E]">
            {settings.darkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            Dark Mode
          </span>
          <Switch
            checked={settings.darkMode}
            onCheckedChange={v => setSettings({ ...settings, darkMode: v })}
            disabled={!editingSettings}
            className="ml-2"
          />
        </div>
        {/* Notifications Toggle */}
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-sm font-medium text-[#2B4C7E]">
            <Bell className="h-4 w-4" />
            Notifications
          </span>
          <Switch
            checked={settings.notifications}
            onCheckedChange={v => setSettings({ ...settings, notifications: v })}
            disabled={!editingSettings}
            className="ml-2"
          />
        </div>
        {/* Profile Visibility Toggle */}
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-sm font-medium text-[#2B4C7E]">
            {settings.profileVisibility === 'Public' ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            Profile Visibility
          </span>
          <Switch
            checked={settings.profileVisibility === 'Public'}
            onCheckedChange={v => setSettings({ ...settings, profileVisibility: v ? 'Public' : 'Private' })}
            disabled={!editingSettings}
            className="ml-2"
          />
          <span className="text-xs text-muted-foreground ml-2">{settings.profileVisibility}</span>
        </div>
        {/* Save/Cancel Buttons */}
        {editingSettings && (
          <div className="flex gap-2 mt-2">
            <Button size="sm" onClick={onSave} className="bg-[#2B4C7E] text-white hover:bg-[#1A2233]">
              <Save className="h-4 w-4 mr-1" />Save
            </Button>
            <Button size="sm" variant="outline" onClick={onCancel}>
              <X className="h-4 w-4 mr-1" />Cancel
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

