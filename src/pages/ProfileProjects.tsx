import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Save, X, Github, Link2, Edit2, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function ProfileProjects({ user, editingProject, newProject, setNewProject, onSave, onCancelEdit, onEditClick, onDelete }) {
  return (
    <section>
      {user.projects.map((project, idx) => (
        editingProject === idx ? (
          <div key={project.title || idx} className="bg-muted p-3 rounded-lg">
            <Input
              value={newProject.title}
              onChange={e => setNewProject({ ...newProject, title: e.target.value })}
              placeholder="Project Title (e.g. Portfolio Website)"
              className="font-semibold overflow-x-auto whitespace-nowrap"
            />
            <Textarea
              value={newProject.description}
              onChange={e => setNewProject({ ...newProject, description: e.target.value })}
              placeholder="Project Description (What did you build? What tech did you use?)"
              className="text-xs overflow-x-auto"
              rows={2}
            />
            <div className="flex gap-2 text-xs">
              <Input
                value={newProject.github}
                onChange={e => setNewProject({ ...newProject, github: e.target.value })}
                placeholder="GitHub URL (e.g. https://github.com/yourname/project)"
                className="flex-1 overflow-x-auto whitespace-nowrap"
              />
              <Input
                value={newProject.demo}
                onChange={e => setNewProject({ ...newProject, demo: e.target.value })}
                placeholder="Demo URL (e.g. https://yourproject.com)"
                className="flex-1 overflow-x-auto whitespace-nowrap"
              />
            </div>
            {/* ...other fields... */}
            <Button size="icon" variant="ghost" onClick={() => onSave(idx)} title="Save"><Save className="h-4 w-4" /></Button>
            <Button size="icon" variant="ghost" onClick={onCancelEdit} title="Cancel"><X className="h-4 w-4" /></Button>
          </div>
        ) : (
          <div key={project.title || idx} className="flex items-start gap-2 p-2 rounded-lg hover:bg-muted transition">
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
                {project.tech && project.tech.map(tech => (
                  <Badge key={tech} className="bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200 px-2 py-0.5 text-[10px]">{tech}</Badge>
                ))}
              </div>
            </div>
            <Button size="icon" variant="ghost" onClick={() => onEditClick(idx)} title="Edit"><Edit2 className="h-4 w-4" /></Button>
            <Button size="icon" variant="ghost" onClick={() => onDelete(idx)} title="Delete"><Trash2 className="h-4 w-4 text-destructive" /></Button>
          </div>
        )
      ))}
    </section>
  );
} 