
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import Sidebar from '@/components/notes/Sidebar';
import NotesList, { Note } from '@/components/notes/NotesList';
import NoteEditor from '@/components/notes/NoteEditor';
import { useToast } from '@/hooks/use-toast';

// Mock data - in a real app this would come from an API
const mockNotes: Note[] = [
  {
    id: '1',
    title: 'Data Structures',
    content: '# Data Structures\n\nArrays, linked lists, trees, and graphs are fundamental data structures.\n\n## Arrays\n\nArrays store elements in contiguous memory locations.\n\n## Linked Lists\n\nLinked lists store elements in nodes with pointers.',
    tags: ['DSA', 'Technical'],
    pinned: true,
    color: 'blue',
    createdAt: new Date('2023-04-10'),
    updatedAt: new Date('2023-04-15'),
    folderId: '1'
  },
  {
    id: '2',
    title: 'Algorithms',
    content: '# Sorting Algorithms\n\n- **Bubble Sort**: O(n²) - Simple comparison-based algorithm\n- **Quick Sort**: O(n log n) - Divide and conquer algorithm\n- **Merge Sort**: O(n log n) - Stable sorting algorithm',
    tags: ['DSA', 'Technical'],
    pinned: false,
    createdAt: new Date('2023-04-12'),
    updatedAt: new Date('2023-04-14'),
    folderId: '1'
  },
  {
    id: '3',
    title: 'HR Interview Questions',
    content: '# Common HR Questions\n\n1. Tell me about yourself\n2. Why do you want to work for our company?\n3. What are your strengths and weaknesses?\n4. Where do you see yourself in 5 years?',
    tags: ['HR', 'Interview'],
    pinned: false,
    createdAt: new Date('2023-04-15'),
    updatedAt: new Date('2023-04-15'),
    folderId: '2'
  },
  {
    id: '4',
    title: 'Operating Systems Concepts',
    content: '# OS Concepts\n\n## Process Management\nProcesses, threads, scheduling\n\n## Memory Management\nVirtual memory, paging, segmentation\n\n## File Systems\nFile allocation, directory structure',
    tags: ['OS', 'Technical'],
    pinned: false,
    createdAt: new Date('2023-04-18'),
    updatedAt: new Date('2023-04-20'),
    folderId: '3'
  },
];

const mockFolders = [
  { id: '1', name: 'DSA Notes' },
  { id: '2', name: 'Interview Prep' },
  { id: '3', name: 'Core Subjects' },
];

const Notes = () => {
  const [notes, setNotes] = useState<Note[]>(mockNotes);
  const [folders, setFolders] = useState(mockFolders);
  const [tags, setTags] = useState<string[]>(['DSA', 'Technical', 'HR', 'Interview', 'OS']);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFolder, setActiveFolder] = useState<string | null>(null);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Set the first note as selected by default
    if (notes.length > 0 && !selectedNote) {
      setSelectedNote(notes[0]);
    }
  }, [notes, selectedNote]);

  const handleSelectNote = (note: Note) => {
    setSelectedNote(note);
  };

  const handleCreateNote = () => {
    const newNote: Note = {
      id: uuidv4(),
      title: 'Untitled Note',
      content: '',
      tags: [],
      pinned: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      folderId: activeFolder
    };
    
    setNotes([newNote, ...notes]);
    setSelectedNote(newNote);
    toast({
      title: "Note created",
      description: "New note created successfully.",
    });
  };

  const handleSaveNote = (updatedNote: Note) => {
    setNotes(notes.map(note => (note.id === updatedNote.id ? updatedNote : note)));
    setSelectedNote(updatedNote);
  };

  const handleAddTag = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
  };

  const handleCreateFolder = (name: string) => {
    const newFolder = {
      id: uuidv4(),
      name
    };
    setFolders([...folders, newFolder]);
    toast({
      title: "Folder created",
      description: `Folder "${name}" created successfully.`,
    });
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes(notes.filter(note => note.id !== noteId));
    if (selectedNote?.id === noteId) {
      setSelectedNote(notes.length > 1 ? notes.find(note => note.id !== noteId) || null : null);
    }
    toast({
      title: "Note deleted",
      description: "Note has been deleted.",
    });
  };

  return (
    <motion.div 
      className="flex h-[calc(100vh-80px)]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Notes Sidebar */}
      <div className="w-64 flex-shrink-0">
        <Sidebar
          folders={folders}
          tags={tags}
          onCreateNote={handleCreateNote}
          onSearchChange={setSearchQuery}
          onSelectFolder={setActiveFolder}
          onSelectTag={setActiveTag}
          activeFolder={activeFolder}
          activeTag={activeTag}
          onCreateFolder={handleCreateFolder}
        />
      </div>
      
      {/* Notes List */}
      <div className="w-72 border-r overflow-hidden flex-shrink-0">
        <div className="h-full flex flex-col">
          <div className="p-4 border-b">
            <h2 className="text-lg font-medium">
              {activeFolder ? folders.find(f => f.id === activeFolder)?.name : 
               activeTag ? `#${activeTag}` : 'All Notes'}
            </h2>
            <p className="text-sm text-muted-foreground">
              {notes.length} {notes.length === 1 ? 'note' : 'notes'}
            </p>
          </div>
          <NotesList
            notes={notes}
            selectedNoteId={selectedNote?.id || null}
            onSelectNote={handleSelectNote}
            searchQuery={searchQuery}
            activeTag={activeTag}
            activeFolder={activeFolder}
          />
        </div>
      </div>
      
      {/* Note Editor */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full p-6">
          <NoteEditor
            note={selectedNote}
            onSave={handleSaveNote}
            onAddTag={handleAddTag}
            availableTags={tags}
            folders={folders}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default Notes;
