
import React, { useState, useEffect, useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bold, 
  Italic, 
  List, 
  Heading, 
  Code, 
  Save,
  Pin, 
  Tag as TagIcon,
  Clipboard,
  FileText as FileTextIcon
} from 'lucide-react';
import { Note } from './NotesList';
import ReactMarkdown from 'react-markdown';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface NoteEditorProps {
  note: Note | null;
  onSave: (note: Note) => void;
  onAddTag: (tag: string) => void;
  availableTags: string[];
  folders: { id: string; name: string }[];
}

export default function NoteEditor({ 
  note, 
  onSave,
  onAddTag,
  availableTags,
  folders
}: NoteEditorProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isEdited, setIsEdited] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [activeTab, setActiveTab] = useState('write');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load note data when note changes
  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setIsPinned(note.pinned);
      setSelectedTags(note.tags);
      setIsEdited(false);
    } else {
      setTitle('');
      setContent('');
      setIsPinned(false);
      setSelectedTags([]);
      setIsEdited(false);
    }
  }, [note]);

  // Auto-save functionality with debounce
  useEffect(() => {
    if (isEdited && note) {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      
      debounceTimerRef.current = setTimeout(() => {
        handleSave();
        // Don't reset isEdited here - it will reset when the note changes
      }, 2000); // 2 seconds debounce
    }
    
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [title, content, isPinned, selectedTags, isEdited]);

  if (!note) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] text-muted-foreground">
        <FileTextIcon className="w-16 h-16 mb-3 opacity-20" />
        <p className="text-lg">Select or create a note</p>
        <p className="text-sm mt-1">Your notes will appear here</p>
      </div>
    );
  }
  
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setIsEdited(true);
  };
  
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setIsEdited(true);
  };
  
  const handleSave = () => {
    if (!note) return;
    
    const updatedNote: Note = {
      ...note,
      title,
      content,
      pinned: isPinned,
      tags: selectedTags,
      updatedAt: new Date()
    };
    
    onSave(updatedNote);
    toast({
      title: "Note saved",
      description: "Your changes have been saved.",
    });
    setIsEdited(false);
  };
  
  const handleAddTag = () => {
    if (newTag.trim() && !selectedTags.includes(newTag.trim())) {
      const tag = newTag.trim();
      setSelectedTags([...selectedTags, tag]);
      onAddTag(tag);
      setNewTag('');
      setIsEdited(true);
    }
  };
  
  const removeTag = (tag: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tag));
    setIsEdited(true);
  };
  
  const togglePin = () => {
    setIsPinned(!isPinned);
    setIsEdited(true);
  };
  
  const insertMarkdown = (markdownSymbol: string) => {
    if (!textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    let newContent = '';
    
    switch (markdownSymbol) {
      case 'bold':
        newContent = content.substring(0, start) + `**${selectedText}**` + content.substring(end);
        break;
      case 'italic':
        newContent = content.substring(0, start) + `*${selectedText}*` + content.substring(end);
        break;
      case 'heading':
        newContent = content.substring(0, start) + `\n# ${selectedText}\n` + content.substring(end);
        break;
      case 'list':
        newContent = content.substring(0, start) + `\n- ${selectedText}` + content.substring(end);
        break;
      case 'code':
        newContent = content.substring(0, start) + `\`\`\`\n${selectedText}\n\`\`\`` + content.substring(end);
        break;
      default:
        return;
    }
    
    setContent(newContent);
    setIsEdited(true);
    
    // Focus and select the right position
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = end + (newContent.length - content.length);
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(content).then(() => {
      toast({
        title: "Copied to clipboard",
        description: "Note content copied to clipboard.",
      });
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4">
        <Input
          type="text"
          placeholder="Note title"
          value={title}
          onChange={handleTitleChange}
          className="text-lg font-medium"
        />
        <Button 
          variant="outline" 
          size="icon"
          onClick={togglePin}
          className={isPinned ? "bg-primary/10" : ""}
        >
          <Pin className={cn("h-5 w-5", isPinned ? "text-primary" : "text-muted-foreground")} />
        </Button>
        <Button 
          variant="outline" 
          size="icon"
          onClick={copyToClipboard}
        >
          <Clipboard className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {selectedTags.map(tag => (
          <Badge 
            key={tag} 
            variant="secondary" 
            onClick={() => removeTag(tag)}
            className="cursor-pointer hover:bg-primary/20"
          >
            <TagIcon className="w-3 h-3 mr-1" />
            {tag}
            <span className="ml-1 text-muted-foreground">×</span>
          </Badge>
        ))}
        
        <div className="flex gap-2 items-center">
          <Input
            type="text"
            placeholder="Add tag..."
            value={newTag}
            onChange={e => setNewTag(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAddTag()}
            className="w-24 h-7 text-sm flex-grow"
          />
          <Button size="sm" variant="outline" onClick={handleAddTag} className="h-7 px-2">
            <TagIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="mb-2">
          <TabsTrigger value="write">Write</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        
        <div className="flex-1 overflow-hidden">
          <TabsContent value="write" className="h-full flex flex-col">
            <div className="mb-2 flex gap-2">
              <Button variant="outline" size="sm" onClick={() => insertMarkdown('bold')}>
                <Bold className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => insertMarkdown('italic')}>
                <Italic className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => insertMarkdown('heading')}>
                <Heading className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => insertMarkdown('list')}>
                <List className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => insertMarkdown('code')}>
                <Code className="h-4 w-4" />
              </Button>
            </div>
            
            <Textarea
              ref={textareaRef}
              value={content}
              onChange={handleContentChange}
              placeholder="Start writing your note here..."
              className="flex-1 resize-none min-h-[300px]"
            />
          </TabsContent>
          
          <TabsContent value="preview" className="h-full border rounded-md">
            <ScrollArea className="h-full p-4">
              {content ? (
                <ReactMarkdown className="prose dark:prose-invert prose-headings:mb-2">
                  {content}
                </ReactMarkdown>
              ) : (
                <div className="text-muted-foreground italic">No content to preview</div>
              )}
            </ScrollArea>
          </TabsContent>
        </div>
      </Tabs>
      
      <div className="flex justify-end mt-4">
        <Button onClick={handleSave} disabled={!isEdited}>
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>
      </div>
    </div>
  );
}

function cn(...args: any[]) {
  return args.filter(Boolean).join(" ");
}
