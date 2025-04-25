import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Github, Link2, Plus, Save, X, Edit2, Trash2 } from 'lucide-react';

export default function ProfileProjects({ user, editingProject, newProject, setNewProject, addingProject, setAddingProject, newTech, setNewTech, onEdit, onSave, onDelete, onAdd, onEditClick, onCancelEdit, onCancelAdd, onAddTech, onRemoveTech }) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-1">
        <div className="font-medium text-lg">Projects</div>
        <Button size="icon" variant="ghost" onClick={() => {
          setAddingProject(true);
          setNewProject({
            title: '',
            description: '',
            github: '',
            demo: '',
            tech: [],
            thumbnail: '',
          });
        }}><Plus className="h-4 w-4" /></Button>
      </div>
      <div className="flex flex-col gap-2">
        {user.projects.map((project, idx) => (
          editingProject === idx ? (
            <div key={project.title} className="bg-muted p-3 rounded-lg">
              <div className="flex flex-col gap-2">
                <Input
                  value={newProject.title}
                  onChange={e => setNewProject({ ...newProject, title: e.target.value })}
                  placeholder="Project Title"
                  className="font-semibold"
                />
                <Textarea
                  value={newProject.description}
                  onChange={e => setNewProject({ ...newProject, description: e.target.value })}
                  placeholder="Project Description"
                  className="text-xs"
                  rows={2}
                />
                <div className="flex gap-2 text-xs">
                  <Input
                    value={newProject.github}
                    onChange={e => setNewProject({ ...newProject, github: e.target.value })}
                    placeholder="GitHub URL"
                    className="flex-1"
                  />
                  <Input
                    value={newProject.demo}
                    onChange={e => setNewProject({ ...newProject, demo: e.target.value })}
                    placeholder="Demo URL"
                    className="flex-1"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <div className="text-xs font-medium">Technologies</div>
                  <div className="flex flex-wrap gap-1">
                    {newProject.tech.map(tech => (
                      <Badge key={tech} className="flex gap-1 items-center bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                        {tech}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => onRemoveTech(tech)} />
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-1 mt-1">
                    <Input
                      value={newTech}
                      onChange={e => setNewTech(e.target.value)}
                      placeholder="Add Technology"
                      className="text-xs flex-1"
                      onKeyDown={e => e.key === 'Enter' && onAddTech()}
                    />
                    <Button size="sm" onClick={onAddTech}><Plus className="h-3 w-3" /></Button>
                  </div>
                </div>
                <div className="flex gap-2 mt-2 justify-end">
                  <Button size="sm" onClick={() => onSave(idx)}><Save className="h-4 w-4 mr-1" />Save</Button>
                  <Button size="sm" variant="outline" onClick={onCancelEdit}><X className="h-4 w-4 mr-1" />Cancel</Button>
                </div>
              </div>
            </div>
          ) : (
            <div key={project.title} className="flex items-start gap-2 p-2 rounded-lg hover:bg-muted transition">
              <div className="h-10 w-10 bg-muted rounded-md flex items-center justify-center">
                <span className="text-xs font-bold">{project.title[0]}</span>
              </div>
              <div className="flex-1">
                <div className="font-semibold text-base flex items-center gap-1">
                  <a href={project.github} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {project.title}
                  </a>
                  {project.github && <a href={project.github} target="_blank" rel="noopener noreferrer"><Github className="h-4 w-4 ml-1 text-muted-foreground" /></a>}
                  {project.demo && <a href={project.demo} target="_blank" rel="noopener noreferrer"><Link2 className="h-4 w-4 ml-1 text-muted-foreground" /></a>}
                </div>
                <div className="text-xs text-muted-foreground">{project.description}</div>
                <div className="flex gap-1 mt-1 flex-wrap">
                  {project.tech.map(tech => (
                    <Badge key={tech} className="bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200 px-2 py-0.5 text-[10px]">{tech}</Badge>
                  ))}
                </div>
              </div>
              <Button size="icon" variant="ghost" onClick={() => onEditClick(idx)}><Edit2 className="h-4 w-4" /></Button>
              <Button size="icon" variant="ghost" onClick={() => onDelete(idx)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          )
        ))}
        {addingProject && (
          <div className="bg-muted p-3 rounded-lg">
            <div className="flex flex-col gap-2">
              <Input
                value={newProject.title}
                onChange={e => setNewProject({ ...newProject, title: e.target.value })}
                placeholder="Project Title"
                className="font-semibold"
              />
              <Textarea
                value={newProject.description}
                onChange={e => setNewProject({ ...newProject, description: e.target.value })}
                placeholder="Project Description"
                className="text-xs"
                rows={2}
              />
              <div className="flex gap-2 text-xs">
                <Input
                  value={newProject.github}
                  onChange={e => setNewProject({ ...newProject, github: e.target.value })}
                  placeholder="GitHub URL"
                  className="flex-1"
                />
                <Input
                  value={newProject.demo}
                  onChange={e => setNewProject({ ...newProject, demo: e.target.value })}
                  placeholder="Demo URL"
                  className="flex-1"
                />
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-xs font-medium">Technologies</div>
                <div className="flex flex-wrap gap-1">
                  {newProject.tech.map(tech => (
                    <Badge key={tech} className="flex gap-1 items-center bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                      {tech}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => onRemoveTech(tech)} />
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-1 mt-1">
                  <Input
                    value={newTech}
                    onChange={e => setNewTech(e.target.value)}
                    placeholder="Add Technology"
                    className="text-xs flex-1"
                    onKeyDown={e => e.key === 'Enter' && onAddTech()}
                  />
                  <Button size="sm" onClick={onAddTech}><Plus className="h-3 w-3" /></Button>
                </div>
              </div>
              <div className="flex gap-2 mt-2 justify-end">
                <Button size="sm" onClick={onAdd}><Save className="h-4 w-4 mr-1" />Save</Button>
                <Button size="sm" variant="outline" onClick={onCancelAdd}><X className="h-4 w-4 mr-1" />Cancel</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
} 