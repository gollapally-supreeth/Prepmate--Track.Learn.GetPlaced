import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Save, X, Edit2, Plus, Trash2, Zap } from 'lucide-react';

export default function ProfileQuickActions({ user, quickActions, setQuickActions, onEdit, onSave, onCancel, editingQuickActions }) {
  const [adding, setAdding] = useState(false);
  const [newAction, setNewAction] = useState('');
  const [editingIdx, setEditingIdx] = useState(null);
  const [editValue, setEditValue] = useState('');

  const handleAdd = () => {
    if (!newAction.trim()) return;
    setQuickActions([...quickActions, newAction]);
    setNewAction('');
    setAdding(false);
  };
  const handleEdit = (idx) => {
    setEditingIdx(idx);
    setEditValue(quickActions[idx]);
  };
  const handleEditSave = (idx) => {
    const updated = [...quickActions];
    updated[idx] = editValue;
    setQuickActions(updated);
    setEditingIdx(null);
    setEditValue('');
  };
  const handleDelete = (idx) => {
    setQuickActions(quickActions.filter((_, i) => i !== idx));
  };
  const handleActionClick = (action) => {
    // Example: scroll to section or alert
    alert(`Action: ${action}`);
  };

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <Zap className="h-5 w-5 text-[#F9A826]" />
        <span className="font-semibold text-lg text-[#2B4C7E]">Quick Actions</span>
        <Button size="icon" variant="ghost" onClick={() => setAdding(true)} title="Add Action">
          <Plus className="h-4 w-4 text-[#2B4C7E]" />
        </Button>
      </div>
      {quickActions.length === 0 && (
        <div className="w-full flex flex-col items-center justify-center p-4 bg-muted/30 rounded-lg border border-dashed border-gray-300 mb-2">
          <Zap className="h-8 w-8 text-[#F9A826] mb-2" />
          <span className="text-gray-500 italic">No quick actions added yet.</span>
          <Button size="sm" variant="outline" className="mt-2" onClick={() => setAdding(true)}>Add Quick Action</Button>
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        {quickActions.map((action, idx) => (
          editingIdx === idx ? (
            <div key={idx} className="flex items-center gap-1 bg-[#F4F8FB] dark:bg-[#232B43] rounded px-2 py-1 border border-[#2B4C7E]/10">
              <Input value={editValue} onChange={e => setEditValue(e.target.value)} className="w-32 text-xs" />
              <Button size="icon" variant="ghost" onClick={() => handleEditSave(idx)} title="Save"><Save className="h-4 w-4" /></Button>
              <Button size="icon" variant="ghost" onClick={() => setEditingIdx(null)} title="Cancel"><X className="h-4 w-4" /></Button>
            </div>
          ) : (
            <div key={idx} className="flex items-center gap-1 bg-[#F9A826]/10 rounded px-3 py-1 cursor-pointer hover:bg-[#F9A826]/20 transition" onClick={() => handleActionClick(action)}>
              <span className="text-xs font-medium text-[#2B4C7E]">{action}</span>
              <Button size="icon" variant="ghost" onClick={e => { e.stopPropagation(); handleEdit(idx); }} title="Edit"><Edit2 className="h-4 w-4" /></Button>
              <Button size="icon" variant="ghost" onClick={e => { e.stopPropagation(); handleDelete(idx); }} title="Delete"><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          )
        ))}
        {adding && (
          <div className="flex items-center gap-1 bg-[#F4F8FB] dark:bg-[#232B43] rounded px-2 py-1 border border-[#2B4C7E]/10">
            <Input value={newAction} onChange={e => setNewAction(e.target.value)} className="w-32 text-xs overflow-x-auto whitespace-nowrap" placeholder="Action (e.g. Go to Dashboard)" />
            <Button size="icon" variant="ghost" onClick={handleAdd} title="Add"><Save className="h-4 w-4" /></Button>
            <Button size="icon" variant="ghost" onClick={() => { setAdding(false); setNewAction(''); }} title="Cancel"><X className="h-4 w-4" /></Button>
          </div>
        )}
      </div>
    </section>
  );
} 