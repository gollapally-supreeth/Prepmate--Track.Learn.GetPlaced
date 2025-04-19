
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, FolderPlus, Search, Tag, Clock, Download, Upload, Plus } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// Mock data for notes
const mockNotes: Note[] = [
  {
    id: '1',
    title: 'Arrays and Dynamic Programming',
    content: '# Arrays\n\nArrays are contiguous memory allocations...\n\n```java\nint[] array = new int[10];\n```\n\n## Dynamic Programming\n\nDP is an algorithmic technique for solving problems by breaking them down...',
    category: 'DSA',
    tags: ['arrays', 'dynamic-programming', 'algorithms'],
    createdAt: '2025-04-15',
    updatedAt: '2025-04-17'
  },
  {
    id: '2',
    title: 'React Hooks Overview',
    content: '# React Hooks\n\nHooks were introduced in React 16.8...\n\n```jsx\nimport { useState, useEffect } from "react";\n\nfunction Example() {\n  const [count, setCount] = useState(0);\n\n  useEffect(() => {\n    document.title = `You clicked ${count} times`;\n  });\n\n  return (\n    <div>\n      <p>You clicked {count} times</p>\n      <button onClick={() => setCount(count + 1)}>\n        Click me\n      </button>\n    </div>\n  );\n}\n```',
    category: 'Web Development',
    tags: ['react', 'hooks', 'frontend'],
    createdAt: '2025-04-10',
    updatedAt: '2025-04-18'
  },
  {
    id: '3',
    title: 'Neural Networks Basics',
    content: '# Neural Networks\n\nArtificial neural networks are computing systems inspired by biological neural networks...\n\n```python\nimport tensorflow as tf\n\nmodel = tf.keras.Sequential([\n  tf.keras.layers.Dense(128, activation="relu"),\n  tf.keras.layers.Dense(10, activation="softmax")\n])\n```',
    category: 'AI/ML',
    tags: ['neural-networks', 'deep-learning', 'tensorflow'],
    createdAt: '2025-04-08',
    updatedAt: '2025-04-12'
  },
  {
    id: '4',
    title: 'Probability and Statistics',
    content: '# Probability\n\nProbability is the measure of the likelihood of an event occurring...\n\n## Statistics\n\n### Mean, Median, Mode\n\n- Mean: The average of all values\n- Median: The middle value\n- Mode: The most frequent value',
    category: 'Aptitude',
    tags: ['probability', 'statistics', 'quantitative'],
    createdAt: '2025-04-05',
    updatedAt: '2025-04-09'
  }
];

const categories = ['All', 'DSA', 'Web Development', 'AI/ML', 'Aptitude', 'HR Questions', 'System Design'];

const NotesSection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  // Filter notes based on search term and category
  const filteredNotes = mockNotes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All' || note.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="notes-section">
      <div className="flex flex-col md:flex-row gap-6">
        <Card className="w-full md:w-1/3">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Notes
              </CardTitle>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" />
                New Note
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Search notes..."
                className="flex-1"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                prefix={<Search className="h-4 w-4 text-muted-foreground" />}
              />
            </div>

            <Tabs defaultValue="All" onValueChange={setSelectedCategory} className="w-full">
              <TabsList className="w-full flex overflow-x-auto hide-scrollbar">
                {categories.map(category => (
                  <TabsTrigger key={category} value={category} className="flex-1 whitespace-nowrap text-xs">
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {filteredNotes.length > 0 ? (
                filteredNotes.map(note => (
                  <div 
                    key={note.id} 
                    className={`p-3 border rounded-md cursor-pointer transition-colors ${selectedNote?.id === note.id ? 'bg-primary/10 border-primary' : 'hover:bg-muted'}`}
                    onClick={() => setSelectedNote(note)}
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium line-clamp-1">{note.title}</h4>
                    </div>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      <Badge variant="outline" className="text-xs">{note.category}</Badge>
                      {note.tags.slice(0, 2).map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                      {note.tags.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{note.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1 mt-2">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Updated {note.updatedAt}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground">No notes found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="w-full md:w-2/3">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold">
                {selectedNote ? selectedNote.title : 'Note Editor'}
              </CardTitle>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
                <Button size="sm" variant="outline">
                  <Upload className="h-4 w-4 mr-1" />
                  Import
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {selectedNote ? (
              <div className="note-content">
                <div className="flex gap-2 mb-4 flex-wrap">
                  <Badge>{selectedNote.category}</Badge>
                  {selectedNote.tags.map(tag => (
                    <Badge key={tag} variant="secondary">#{tag}</Badge>
                  ))}
                </div>
                
                <div className="border rounded-md p-4 bg-muted/50 min-h-[400px] font-mono whitespace-pre-wrap">
                  {selectedNote.content}
                </div>
                
                <div className="flex justify-between mt-4 text-sm text-muted-foreground">
                  <span>Created: {selectedNote.createdAt}</span>
                  <span>Last modified: {selectedNote.updatedAt}</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <FileText className="h-16 w-16 text-muted-foreground/40 mb-4" />
                <h3 className="text-xl font-medium mb-2">No note selected</h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                  Select a note from the sidebar or create a new one to start editing
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-1" />
                  Create New Note
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotesSection;
