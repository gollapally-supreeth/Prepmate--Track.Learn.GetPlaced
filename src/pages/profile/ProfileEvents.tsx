import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar, Plus, Save, X, Edit2, Trash2 } from 'lucide-react';

export default function ProfileEvents({ user, events, setEvents, editingEvent, newEvent, setNewEvent, addingEvent, setAddingEvent, onEdit, onSave, onDelete, onAdd, onEditClick, onCancelEdit, onCancelAdd }) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-1">
        <div className="font-medium text-lg">Events</div>
        <Button size="icon" variant="ghost" onClick={() => {
          setAddingEvent(true);
          setNewEvent({ name: '', date: '', description: '' });
        }}><Plus className="h-4 w-4" /></Button>
      </div>
      <div className="flex flex-col gap-2">
        {events.length === 0 && (
          <div className="w-full flex flex-col items-center justify-center p-4 bg-muted/30 rounded-lg border border-dashed border-gray-300 mb-2">
            <Calendar className="h-8 w-8 text-muted-foreground mb-2" />
            <span className="text-gray-500 italic">No events or reminders yet.</span>
            <Button size="sm" variant="outline" className="mt-2" onClick={() => { setAddingEvent(true); setNewEvent({ name: '', date: '', description: '' }); }}>Add Event</Button>
          </div>
        )}
        {events.map((event, idx) => (
          editingEvent === idx ? (
            <div key={event.name} className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2">
              <Input value={newEvent.name} onChange={e => setNewEvent({ ...newEvent, name: e.target.value })} className="w-24 text-xs overflow-x-auto whitespace-nowrap" placeholder="Event Name (e.g. Hackathon)" />
              <Input value={newEvent.date} onChange={e => setNewEvent({ ...newEvent, date: e.target.value })} className="w-24 text-xs overflow-x-auto whitespace-nowrap" placeholder="Date (e.g. 2024-12-31)" type="date" />
              <Input value={newEvent.description} onChange={e => setNewEvent({ ...newEvent, description: e.target.value })} className="w-40 text-xs overflow-x-auto whitespace-nowrap" placeholder="Description (e.g. Coding event)" />
              <Button size="icon" variant="ghost" className="ml-1" onClick={() => onSave(idx)}><Save className="h-3 w-3" /></Button>
              <Button size="icon" variant="ghost" className="ml-1" onClick={onCancelEdit}><X className="h-3 w-3" /></Button>
            </div>
          ) : (
            <div key={event.name} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium text-xs">{event.name}</span>
              <span className="text-xs text-muted-foreground">{event.date}</span>
              <span className="text-xs">{event.description}</span>
              <Button size="icon" variant="ghost" className="ml-1" onClick={() => onEditClick(idx)}><Edit2 className="h-3 w-3" /></Button>
              <Button size="icon" variant="ghost" className="ml-1" onClick={() => onDelete(idx)}><Trash2 className="h-3 w-3 text-destructive" /></Button>
            </div>
          )
        ))}
        {addingEvent && (
          <div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2">
            <Input value={newEvent.name} onChange={e => setNewEvent({ ...newEvent, name: e.target.value })} className="w-24 text-xs overflow-x-auto whitespace-nowrap" placeholder="Event Name (e.g. Hackathon)" />
            <Input value={newEvent.date} onChange={e => setNewEvent({ ...newEvent, date: e.target.value })} className="w-24 text-xs overflow-x-auto whitespace-nowrap" placeholder="Date (e.g. 2024-12-31)" type="date" />
            <Input value={newEvent.description} onChange={e => setNewEvent({ ...newEvent, description: e.target.value })} className="w-40 text-xs overflow-x-auto whitespace-nowrap" placeholder="Description (e.g. Coding event)" />
            <Button size="icon" variant="ghost" className="ml-1" onClick={onAdd}><Save className="h-3 w-3" /></Button>
            <Button size="icon" variant="ghost" className="ml-1" onClick={onCancelAdd}><X className="h-3 w-3" /></Button>
          </div>
        )}
      </div>
    </section>
  );
} 