import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Linkedin, Plus, Save, X, Edit2, Trash2, Building2, User2 } from 'lucide-react';

export default function ProfileExperience({ user, editingExperience, newExperience, setNewExperience, addingExperience, setAddingExperience, responsibilityText, setResponsibilityText, onEdit, onSave, onDelete, onAdd, onEditClick, onCancelEdit, onCancelAdd, onAddResponsibility, onRemoveResponsibility }) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-1">
        <div className="font-medium text-lg">Experience</div>
        <Button size="icon" variant="ghost" onClick={() => {
          setAddingExperience(true);
          setNewExperience({
            role: '',
            company: '',
            duration: '',
            responsibilities: [],
            linkedin: '',
          });
        }}><Plus className="h-4 w-4" /></Button>
      </div>
      <div className="flex flex-col gap-4">
        {user.experience.length === 0 && (
          <div className="w-full flex flex-col items-center justify-center p-4 bg-muted/30 rounded-lg border border-dashed border-gray-300 mb-2">
            <User2 className="h-8 w-8 text-primary mb-2" />
            <span className="text-gray-500 italic">No experience added yet.</span>
            <Button size="sm" variant="outline" className="mt-2" onClick={() => { setAddingExperience(true); setNewExperience({ role: '', company: '', duration: '', responsibilities: [], linkedin: '' }); }}>Add Experience</Button>
          </div>
        )}
        {user.experience.map((exp, idx) => (
          editingExperience === idx ? (
            <div key={exp.role + idx} className="bg-card border border-border shadow-lg p-5 rounded-2xl">
              <div className="flex flex-col gap-3">
                <div className="flex gap-3 items-center">
                  <User2 className="h-5 w-5 text-primary" />
                  <Input
                    value={newExperience.role}
                    onChange={e => setNewExperience({ ...newExperience, role: e.target.value })}
                    placeholder="Role/Position (e.g. Software Engineer)"
                    className="font-semibold flex-1 overflow-x-auto whitespace-nowrap"
                  />
                  <Building2 className="h-5 w-5 text-primary" />
                  <Input
                    value={newExperience.company}
                    onChange={e => setNewExperience({ ...newExperience, company: e.target.value })}
                    placeholder="Company (e.g. Google)"
                    className="flex-1 overflow-x-auto whitespace-nowrap"
                  />
                </div>
                <div className="flex gap-3 items-center">
                  <Input
                    value={newExperience.duration}
                    onChange={e => setNewExperience({ ...newExperience, duration: e.target.value })}
                    placeholder="Duration (e.g. June 2023 - August 2023)"
                    className="text-xs flex-1 overflow-x-auto whitespace-nowrap"
                  />
                  <Linkedin className="h-5 w-5 text-blue-600" />
                  <Input
                    value={newExperience.linkedin}
                    onChange={e => setNewExperience({ ...newExperience, linkedin: e.target.value })}
                    placeholder="LinkedIn URL (e.g. https://linkedin.com/in/yourname)"
                    className="text-xs flex-1 overflow-x-auto whitespace-nowrap"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <div className="text-xs font-medium">Responsibilities</div>
                  <ul className="list-disc ml-5 text-xs">
                    {newExperience.responsibilities.map((r, i) => (
                      <li key={i} className="flex items-center gap-1">
                        <span className="flex-1">{r}</span>
                        <Button size="icon" variant="ghost" className="h-4 w-4 text-destructive" onClick={() => onRemoveResponsibility(i)}>
                          <X className="h-3 w-3" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                  <div className="flex gap-1 mt-1">
                    <Input
                      value={responsibilityText}
                      onChange={e => setResponsibilityText(e.target.value)}
                      placeholder="Add Responsibility"
                      className="text-xs flex-1"
                      onKeyDown={e => e.key === 'Enter' && onAddResponsibility()}
                    />
                    <Button size="sm" className="bg-primary text-white" onClick={onAddResponsibility}><Plus className="h-3 w-3" /></Button>
                  </div>
                </div>
                <div className="flex gap-2 mt-2 justify-end">
                  <Button size="sm" className="bg-primary text-white" onClick={() => onSave(idx)}><Save className="h-4 w-4 mr-1" />Save</Button>
                  <Button size="sm" variant="outline" onClick={onCancelEdit}><X className="h-4 w-4 mr-1" />Cancel</Button>
                </div>
              </div>
            </div>
          ) :
            <div key={exp.role + idx} className="bg-card border border-border shadow-md p-5 rounded-2xl transition hover:shadow-xl">
              <div className="flex flex-col gap-1 mb-2">
                <div className="flex items-center gap-2">
                  <User2 className="h-5 w-5 text-primary" />
                  <span className="font-semibold text-base">{exp.role}</span>
                  <Building2 className="h-5 w-5 text-primary ml-2" />
                  <span className="text-xs text-muted-foreground">@ {exp.company}</span>
                  {exp.linkedin && <a href={exp.linkedin} target="_blank" rel="noopener noreferrer"><Linkedin className="h-4 w-4 ml-2 text-blue-600" /></a>}
                </div>
                <div className="text-xs text-muted-foreground">{exp.duration}</div>
              </div>
              <div className="mb-2">
                <span className="text-xs font-medium">Responsibilities:</span>
                <ul className="list-disc ml-7 text-xs mt-1">
                  {(Array.isArray(exp.responsibilities) ? exp.responsibilities : []).filter(r => r && r.trim() !== '').length > 0 ? (
                    exp.responsibilities.filter(r => r && r.trim() !== '').map((r, i) => <li key={i}>{r}</li>)
                  ) : (
                    <li className="italic text-muted-foreground">No responsibilities listed.</li>
                  )}
                </ul>
              </div>
              <div className="flex gap-1 mt-3">
                <Button size="icon" variant="ghost" className="hover:bg-primary/10" onClick={() => onEditClick(idx)}><Edit2 className="h-4 w-4" /></Button>
                <Button size="icon" variant="ghost" className="hover:bg-destructive/10" onClick={() => onDelete(idx)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            </div>
        ))}
        {addingExperience && (
          <div className="bg-card border border-border shadow-lg p-5 rounded-2xl">
            <div className="flex flex-col gap-3">
              <div className="flex gap-3 items-center">
                <User2 className="h-5 w-5 text-primary" />
                <Input
                  value={newExperience.role}
                  onChange={e => setNewExperience({ ...newExperience, role: e.target.value })}
                  placeholder="Role/Position"
                  className="font-semibold flex-1"
                />
                <Building2 className="h-5 w-5 text-primary" />
                <Input
                  value={newExperience.company}
                  onChange={e => setNewExperience({ ...newExperience, company: e.target.value })}
                  placeholder="Company"
                  className="flex-1"
                />
              </div>
              <div className="flex gap-3 items-center">
                <Input
                  value={newExperience.duration}
                  onChange={e => setNewExperience({ ...newExperience, duration: e.target.value })}
                  placeholder="Duration (e.g. June 2023 - August 2023)"
                  className="text-xs flex-1"
                />
                <Linkedin className="h-5 w-5 text-blue-600" />
                <Input
                  value={newExperience.linkedin}
                  onChange={e => setNewExperience({ ...newExperience, linkedin: e.target.value })}
                  placeholder="LinkedIn URL"
                  className="text-xs flex-1"
                />
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-xs font-medium">Responsibilities</div>
                <ul className="list-disc ml-5 text-xs">
                  {newExperience.responsibilities.map((r, i) => (
                    <li key={i} className="flex items-center gap-1">
                      <span className="flex-1">{r}</span>
                      <Button size="icon" variant="ghost" className="h-4 w-4 text-destructive" onClick={() => onRemoveResponsibility(i)}>
                        <X className="h-3 w-3" />
                      </Button>
                    </li>
                  ))}
                </ul>
                <div className="flex gap-1 mt-1">
                  <Input
                    value={responsibilityText}
                    onChange={e => setResponsibilityText(e.target.value)}
                    placeholder="Add Responsibility"
                    className="text-xs flex-1"
                    onKeyDown={e => e.key === 'Enter' && onAddResponsibility()}
                  />
                  <Button size="sm" className="bg-primary text-white" onClick={onAddResponsibility}><Plus className="h-3 w-3" /></Button>
                </div>
              </div>
              <div className="flex gap-2 mt-2 justify-end">
                <Button size="sm" className="bg-primary text-white" onClick={onAdd}><Save className="h-4 w-4 mr-1" />Save</Button>
                <Button size="sm" variant="outline" onClick={onCancelAdd}><X className="h-4 w-4 mr-1" />Cancel</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
} 