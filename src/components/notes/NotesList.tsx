
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { FileTextIcon, PinIcon, Tag } from 'lucide-react';
import { motion } from 'framer-motion';

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  pinned: boolean;
  color?: string;
  createdAt: Date;
  updatedAt: Date;
  folderId?: string;
}

interface NotesListProps {
  notes: Note[];
  selectedNoteId: string | null;
  onSelectNote: (note: Note) => void;
  searchQuery?: string;
  activeTag?: string;
  activeFolder?: string;
}

export default function NotesList({
  notes,
  selectedNoteId,
  onSelectNote,
  searchQuery = '',
  activeTag,
  activeFolder,
}: NotesListProps) {
  // Filter notes based on search query, active tag, and active folder
  const filteredNotes = notes.filter(note => {
    // Filter by search
    const matchesSearch = searchQuery === '' || 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by tag
    const matchesTag = !activeTag || note.tags.includes(activeTag);
    
    // Filter by folder
    const matchesFolder = !activeFolder || note.folderId === activeFolder;
    
    return matchesSearch && matchesTag && matchesFolder;
  });

  // Sort notes: pinned first, then by updatedAt
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return b.updatedAt.getTime() - a.updatedAt.getTime();
  });

  if (sortedNotes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
        <FileTextIcon className="w-12 h-12 mb-2 opacity-20" />
        <p>No notes found</p>
        {searchQuery && <p className="text-sm mt-1">Try a different search term</p>}
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-220px)]">
      <div className="space-y-2 pr-4">
        {sortedNotes.map((note) => (
          <motion.div
            key={note.id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Card 
              className={cn(
                "p-3 cursor-pointer transition-all border-l-4",
                selectedNoteId === note.id 
                  ? "bg-secondary border-primary" 
                  : "hover:bg-secondary/40",
                note.color ? `border-${note.color}-500` : "border-transparent"
              )}
              onClick={() => onSelectNote(note)}
            >
              <div className="flex items-start justify-between">
                <h3 className="font-medium line-clamp-1">{note.title || "Untitled Note"}</h3>
                {note.pinned && <PinIcon className="w-4 h-4 text-muted-foreground" />}
              </div>
              
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                {note.content.replace(/#{1,6}\s|[*_`~]/g, '') || "Empty note"}
              </p>
              
              <div className="flex items-center justify-between mt-2">
                <div className="flex flex-wrap gap-1">
                  {note.tags.slice(0, 2).map(tag => (
                    <span 
                      key={tag} 
                      className="inline-flex items-center text-xs bg-secondary/80 text-muted-foreground rounded-full px-2 py-0.5"
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                  {note.tags.length > 2 && (
                    <span className="text-xs text-muted-foreground">+{note.tags.length - 2}</span>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(note.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </ScrollArea>
  );
}
