import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Save, X, Edit2, Trash2, BookOpen, Zap, Award, Plus } from 'lucide-react';

export default function ProfileProgress({ user, progress, setProgress, onEdit, onSave, onCancel, editingProgress }) {
  // Helper to pick icon based on category
  const getIcon = (category) => {
    if (category?.toLowerCase().includes('learn')) return <BookOpen className="h-5 w-5 text-[#2B4C7E]" />;
    if (category?.toLowerCase().includes('project')) return <Zap className="h-5 w-5 text-[#F9A826]" />;
    if (category?.toLowerCase().includes('cert')) return <Award className="h-5 w-5 text-[#2B4C7E]" />;
    return <BookOpen className="h-5 w-5 text-[#2B4C7E]" />;
  };

  // Local state for adding and editing a progress item
  const [adding, setAdding] = useState(false);
  const [newItem, setNewItem] = useState({ label: '', deadline: '', percent: 0, category: '' });
  const [editItem, setEditItem] = useState(null);

  const handleAdd = () => {
    if (!newItem.label.trim()) return;
    setProgress(Array.isArray(user.progress) ? [...user.progress, { ...newItem }] : [{ ...newItem }]);
    setNewItem({ label: '', deadline: '', percent: 0, category: '' });
    setAdding(false);
  };

  const handleEditChange = (field, value) => {
    setEditItem({ ...editItem, [field]: value });
  };

  const handleEditSave = (idx) => {
    if (!editItem || !editItem.label.trim()) return;
    const updated = Array.isArray(user.progress) ? [...user.progress] : [];
    updated[idx] = { ...editItem };
    setProgress(updated);
    setEditItem(null);
    onSave(idx);
  };

  const handleEditStart = (idx) => {
    setEditItem(user.progress[idx]);
    onEdit(idx);
  };

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <Zap className="h-5 w-5 text-[#F9A826]" />
        <span className="font-semibold text-lg text-[#2B4C7E]">Progress Tracker</span>
        <Button size="icon" variant="ghost" onClick={() => setAdding(true)} title="Add Progress">
          <Plus className="h-4 w-4 text-[#2B4C7E]" />
        </Button>
      </div>
      <div className="flex flex-col gap-3">
        {user.progress.map((item, idx) => (
          editingProgress === idx ? (
            <div key={idx} className="flex flex-col gap-2 bg-[#F4F8FB] dark:bg-[#232B43] rounded-lg p-4 border border-[#2B4C7E]/10">
              <div className="flex flex-row flex-wrap gap-2 items-center">
                <Input value={editItem?.label || ''} onChange={e => handleEditChange('label', e.target.value)} className="w-32 text-xs" placeholder="Label" />
                <Input value={editItem?.deadline || ''} onChange={e => handleEditChange('deadline', e.target.value)} className="w-32 text-xs" placeholder="Deadline" />
                <Input value={editItem?.percent || 0} onChange={e => handleEditChange('percent', Number(e.target.value))} className="w-20 text-xs" placeholder="Progress %" type="number" min={0} max={100} />
                <Input value={editItem?.category || ''} onChange={e => handleEditChange('category', e.target.value)} className="w-32 text-xs" placeholder="Category" />
                <Button size="icon" variant="ghost" onClick={() => handleEditSave(idx)} title="Save"><Save className="h-4 w-4" /></Button>
                <Button size="icon" variant="ghost" onClick={() => { setEditItem(null); onCancel(); }} title="Cancel"><X className="h-4 w-4" /></Button>
              </div>
            </div>
          ) : (
            <div key={idx} className="flex items-center gap-4 bg-white dark:bg-[#232B43] rounded-lg p-4 border border-[#2B4C7E]/10 shadow-sm">
              {getIcon(item.category)}
              <div className="flex-1">
                <div className="font-medium text-base text-[#2B4C7E]">{item.label}</div>
                <div className="text-xs text-muted-foreground">Deadline: {item.deadline}</div>
                <div className="relative w-full h-2 mt-1 bg-[#EAF0F7] rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full rounded-full transition-all"
                    style={{ width: `${item.percent}%`, background: '#F9A826' }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-[#2B4C7E]">{item.percent}%</span>
                <Button size="icon" variant="ghost" onClick={() => handleEditStart(idx)} title="Edit"><Edit2 className="h-4 w-4" /></Button>
                <Button size="icon" variant="ghost" onClick={() => setProgress(Array.isArray(user.progress) ? user.progress.filter((_, i) => i !== idx) : [])} title="Delete"><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            </div>
          )
        ))}
        {progress.length === 0 && (
          <div className="w-full flex flex-col items-center justify-center p-4 bg-muted/30 rounded-lg border border-dashed border-gray-300 mb-2">
            <BookOpen className="h-8 w-8 text-[#2B4C7E] mb-2" />
            <span className="text-gray-500 italic">No progress items added yet.</span>
            <Button size="sm" variant="outline" className="mt-2" onClick={onEdit}>Add Progress</Button>
          </div>
        )}
        {adding && (
          <div className="flex flex-row flex-wrap gap-2 items-center bg-[#F4F8FB] dark:bg-[#232B43] rounded-lg p-4 border border-[#2B4C7E]/10">
            <Input value={newItem.label} onChange={e => setNewItem({ ...newItem, label: e.target.value })} className="w-32 text-xs overflow-x-auto whitespace-nowrap" placeholder="Label (e.g. React Course)" />
            <Input value={newItem.deadline} onChange={e => setNewItem({ ...newItem, deadline: e.target.value })} className="w-32 text-xs overflow-x-auto whitespace-nowrap" placeholder="Deadline (e.g. 2024-12-31)" />
            <Input value={newItem.percent} onChange={e => setNewItem({ ...newItem, percent: Number(e.target.value) })} className="w-20 text-xs overflow-x-auto whitespace-nowrap" placeholder="Progress % (e.g. 50)" type="number" min={0} max={100} />
            <Input value={newItem.category} onChange={e => setNewItem({ ...newItem, category: e.target.value })} className="w-32 text-xs overflow-x-auto whitespace-nowrap" placeholder="Category (e.g. Learning, Project)" />
            <Button size="icon" variant="ghost" onClick={handleAdd} title="Add"><Save className="h-4 w-4" /></Button>
            <Button size="icon" variant="ghost" onClick={() => { setAdding(false); setNewItem({ label: '', deadline: '', percent: 0, category: '' }); }} title="Cancel"><X className="h-4 w-4" /></Button>
          </div>
        )}
      </div>
    </section>
  );
} 