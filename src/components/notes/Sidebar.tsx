
import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  Plus,
  Folder,
  Search,
  Tag as TagIcon,
  ChevronDown,
  ChevronRight,
  FileText as FileTextIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface SidebarProps {
  folders: { id: string; name: string }[];
  tags: string[];
  onCreateNote: () => void;
  onSearchChange: (search: string) => void;
  onSelectFolder: (folderId: string | null) => void;
  onSelectTag: (tag: string | null) => void;
  activeFolder: string | null;
  activeTag: string | null;
  onCreateFolder: (name: string) => void;
}

export default function Sidebar({
  folders,
  tags,
  onCreateNote,
  onSearchChange,
  onSelectFolder,
  onSelectTag,
  activeFolder,
  activeTag,
  onCreateFolder
}: SidebarProps) {
  const [folderOpen, setFolderOpen] = useState(true);
  const [tagOpen, setTagOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [newFolderName, setNewFolderName] = useState('');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearchChange(value);
  };
  
  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      onCreateFolder(newFolderName);
      setNewFolderName('');
      setIsCreatingFolder(false);
    }
  };
  
  return (
    <div className="h-full flex flex-col border-r">
      <div className="p-4">
        <Button onClick={onCreateNote} className="w-full mb-4">
          <Plus className="mr-2 h-4 w-4" />
          New Note
        </Button>
        
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search notes..."
            className="pl-9"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="px-3 py-2">
          <Collapsible open={folderOpen} onOpenChange={setFolderOpen}>
            <CollapsibleTrigger asChild>
              <div className="flex items-center justify-between py-2 px-1 hover:bg-muted/50 rounded cursor-pointer">
                <div className="flex items-center">
                  <Folder className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm font-medium">Folders</span>
                </div>
                {folderOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="ml-2 mt-1 space-y-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "w-full justify-start px-2 font-normal",
                    activeFolder === null && "bg-secondary"
                  )}
                  onClick={() => onSelectFolder(null)}
                >
                  <FileTextIcon className="mr-2 h-4 w-4" />
                  All Notes
                </Button>
                
                {folders.map(folder => (
                  <Button
                    key={folder.id}
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "w-full justify-start px-2 font-normal",
                      activeFolder === folder.id && "bg-secondary"
                    )}
                    onClick={() => onSelectFolder(folder.id)}
                  >
                    <Folder className="mr-2 h-4 w-4" />
                    {folder.name}
                  </Button>
                ))}
                
                {!isCreatingFolder ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start px-2 font-normal text-muted-foreground"
                    onClick={() => setIsCreatingFolder(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    New Folder
                  </Button>
                ) : (
                  <div className="flex items-center space-x-2 p-2">
                    <Input
                      size={1}
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      placeholder="Folder name"
                      className="h-8"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleCreateFolder();
                        if (e.key === 'Escape') setIsCreatingFolder(false);
                      }}
                      autoFocus
                    />
                    <Button size="sm" onClick={handleCreateFolder}>
                      Create
                    </Button>
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>
          
          <Separator className="my-2" />
          
          <Collapsible open={tagOpen} onOpenChange={setTagOpen}>
            <CollapsibleTrigger asChild>
              <div className="flex items-center justify-between py-2 px-1 hover:bg-muted/50 rounded cursor-pointer">
                <div className="flex items-center">
                  <TagIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm font-medium">Tags</span>
                </div>
                {tagOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="ml-2 mt-1 space-y-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "w-full justify-start px-2 font-normal",
                    activeTag === null && activeFolder === null && "bg-secondary"
                  )}
                  onClick={() => onSelectTag(null)}
                >
                  All Tags
                </Button>
                
                {tags.sort().map(tag => (
                  <Button
                    key={tag}
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "w-full justify-start px-2 font-normal",
                      activeTag === tag && "bg-secondary"
                    )}
                    onClick={() => onSelectTag(tag)}
                  >
                    <TagIcon className="mr-2 h-4 w-4" />
                    {tag}
                    <span className="ml-auto text-muted-foreground text-xs">
                      {/* We could add count here */}
                    </span>
                  </Button>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </ScrollArea>
    </div>
  );
}
