
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { v4 as uuidv4 } from 'uuid';
import { motion } from "framer-motion";
import { Edit, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"

interface Note {
  id: string;
  title: string;
  content: string;
}

export default function NotesSection() {
  const [notes, setNotes] = useState<Note[]>([]); // Initialize as empty array
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Dialog state for delete confirmation
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
  // Track the note to delete
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);

  // Fetch notes from API
  const { isLoading, error } = useQuery({
    queryKey: ['notes'],
    queryFn: async () => {
      try {
        // Simulate API call with mock data for now
        // In a production app, replace this with your actual API call
        const mockNotes = [
          { id: '1', title: 'Data Structures', content: 'Arrays, linked lists, trees, and graphs are fundamental data structures.' },
          { id: '2', title: 'Algorithms', content: 'Sorting, searching, and graph algorithms are essential computer science concepts.' },
          { id: '3', title: 'Interview Tips', content: 'Practice problem-solving and communication skills before interviews.' }
        ];
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setNotes(mockNotes);
        return mockNotes;
      } catch (error) {
        console.error("Failed to fetch notes:", error);
        // Return empty array to prevent map errors
        setNotes([]);
        return [];
      }
    }
  });

  // Mutation for creating a new note
  const createNoteMutation = useMutation({
    mutationFn: async (newNote: Omit<Note, 'id'>) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      const noteWithId = { ...newNote, id: uuidv4() };
      return noteWithId;
    },
    onSuccess: (data) => {
      setNotes(prev => [...prev, data]);
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      setTitle('');
      setContent('');
      toast({
        title: "Note created",
        description: "Your note has been created.",
      })
    },
  });

  // Mutation for updating a note
  const updateNoteMutation = useMutation({
    mutationFn: async (updatedNote: Note) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return updatedNote;
    },
    onSuccess: (updatedNote) => {
      setNotes(prev => 
        prev.map(note => note.id === updatedNote.id ? updatedNote : note)
      );
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      setSelectedNote(null);
      setIsEditing(false);
      toast({
        title: "Note updated",
        description: "Your note has been updated.",
      })
    },
  });

  // Mutation for deleting a note
  const deleteNoteMutation = useMutation({
    mutationFn: async (id: string) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return id;
    },
    onSuccess: (deletedId) => {
      setNotes(prev => prev.filter(note => note.id !== deletedId));
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      setSelectedNote(null);
      setIsEditing(false);
      setConfirmDeleteDialogOpen(false);  // Close dialog after deleting
      toast({
        title: "Note deleted",
        description: "Your note has been deleted.",
      })
    },
  });

  const handleCreateNote = async () => {
    if (title.trim() === '' || content.trim() === '') {
      toast({
        title: "Required fields",
        description: "Title or Content should not be empty.",
      })
      return;
    }

    const newNote: Omit<Note, 'id'> = {
      title: title,
      content: content,
    };

    createNoteMutation.mutate(newNote);
  };

  const handleUpdateNote = async () => {
    if (!selectedNote) return;

    const updatedNote = { ...selectedNote, title, content };
    updateNoteMutation.mutate(updatedNote);
  };

  const handleDeleteClick = (id: string) => {
    setNoteToDelete(id);
    setConfirmDeleteDialogOpen(true);
  };

  const handleDeleteNote = () => {
    if (noteToDelete) {
      deleteNoteMutation.mutate(noteToDelete);
    }
  };

  const handleNoteClick = (note: Note) => {
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
  };

  useEffect(() => {
    if (selectedNote) {
      setTitle(selectedNote.title);
      setContent(selectedNote.content);
    }
  }, [selectedNote]);

  // Safety check to ensure notes is always an array before rendering
  const safeNotes = Array.isArray(notes) ? notes : [];

  if (isLoading) return <div>Loading notes...</div>;
  if (error) return <div>Error fetching notes</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Notes List */}
      <div className="md:col-span-1">
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Your Notes</CardTitle>
            <CardDescription>Click to view and edit</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[400px]">
              <div className="divide-y divide-border">
                {safeNotes.map((note) => (
                  <motion.div
                    key={note.id}
                    className={`p-4 cursor-pointer hover:bg-secondary/70 ${selectedNote?.id === note.id ? 'bg-secondary/80' : ''}`}
                    onClick={() => handleNoteClick(note)}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h3 className="text-sm font-medium line-clamp-1">{note.title}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                      {note.content}
                    </p>
                  </motion.div>
                ))}
                {safeNotes.length === 0 && (
                  <div className="p-4 text-center text-muted-foreground">
                    No notes yet. Create your first note!
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Note Editor */}
      <div className="md:col-span-2">
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>{selectedNote ? 'Edit Note' : 'Create Note'}</CardTitle>
            <CardDescription>
              {selectedNote ? 'Update your note details' : 'Capture your thoughts and ideas'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="focus-visible:ring-primary"
            />
            <Textarea
              placeholder="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[150px] focus-visible:ring-primary"
            />
            <div className="flex justify-end gap-2">
              {selectedNote && (
                <>
                  <Button
                    variant="outline"
                    className="btn-hover"
                    onClick={() => {
                      setTitle(selectedNote.title);
                      setContent(selectedNote.content);
                      setIsEditing(false);
                    }}
                  >
                    Cancel
                  </Button>
                  
                  <Dialog open={confirmDeleteDialogOpen} onOpenChange={setConfirmDeleteDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="destructive" className="btn-hover">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Are you absolutely sure?</DialogTitle>
                        <DialogDescription>
                          This action cannot be undone. This will permanently delete your note from our servers.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex justify-end space-x-2">
                        <Button 
                          type="button" 
                          variant="secondary" 
                          onClick={() => setConfirmDeleteDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          variant="destructive"
                          onClick={handleDeleteNote}
                        >
                          Delete
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <Button className="btn-hover" onClick={handleUpdateNote}>
                    <Edit className="w-4 h-4 mr-2" />
                    Update Note
                  </Button>
                </>
              )}
              {!selectedNote && (
                <Button className="btn-hover" onClick={handleCreateNote} disabled={createNoteMutation.isPending}>
                  Create Note
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
