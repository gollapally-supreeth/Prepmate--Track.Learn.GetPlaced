import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Clock, Save, X, Edit2, Plus, Trash2 } from 'lucide-react';

export default function ProfileActivityFeed({ user, activity, setActivity, onEdit, onSave, onCancel, editingActivity }) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-1">
        <div className="font-medium text-lg">Activity Feed</div>
        {!editingActivity && <Button size="icon" variant="ghost" onClick={onEdit}><Edit2 className="h-4 w-4" /></Button>}
      </div>
      <div className="flex flex-col gap-2">
        {editingActivity ? (
          <div className="flex flex-col gap-2">
            {activity.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1">
                <Input
                  value={item.text}
                  onChange={e => {
                    const updated = [...activity];
                    updated[idx] = { ...item, text: e.target.value };
                    setActivity(updated);
                  }}
                  className="w-64 text-xs"
                  placeholder="Activity"
                />
                <Button size="icon" variant="ghost" onClick={() => {
                  const updated = activity.filter((_, i) => i !== idx);
                  setActivity(updated);
                }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            ))}
            <Button size="sm" variant="outline" onClick={() => setActivity([...activity, { type: '', text: '', time: '', link: '' }])}><Plus className="h-4 w-4 mr-1" />Add</Button>
            <div className="flex gap-2 mt-2">
              <Button size="sm" onClick={onSave}><Save className="h-4 w-4 mr-1" />Save</Button>
              <Button size="sm" variant="outline" onClick={onCancel}><X className="h-4 w-4 mr-1" />Cancel</Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {activity.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs">
                <Clock className="h-3 w-3 text-muted-foreground" />
                <span>{item.text}</span>
                {item.time && <span className="text-muted-foreground ml-2">{item.time}</span>}
                {item.link && <a href={item.link} className="text-blue-500 underline ml-2" target="_blank" rel="noopener noreferrer">View</a>}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
} 