
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Resource, ResourceDifficulty, ResourceType } from '@/pages/ResourcesHub';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X, Loader2 } from 'lucide-react';

interface ResourceSubmissionFormProps {
  onSubmit: (resource: Partial<Resource>) => void;
}

export function ResourceSubmissionForm({ onSubmit }: ResourceSubmissionFormProps) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [type, setType] = useState<ResourceType>('video');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState<ResourceDifficulty>('Intermediate');
  const [source, setSource] = useState('');
  const [duration, setDuration] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

  const handleAddTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const analyzeResource = () => {
    if (!url) return;
    
    setIsAnalyzing(true);
    
    // Simulate AI analysis with a timeout
    setTimeout(() => {
      // These would normally come from the Gemini API
      const suggestedTags = [
        'React', 'JavaScript', 'Frontend', 'Web Development'
      ];
      
      setAiSuggestions(suggestedTags);
      if (!description) {
        setDescription('This resource covers fundamental React concepts with practical examples and best practices for modern web development.');
      }
      setIsAnalyzing(false);
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newResource: Partial<Resource> = {
      title,
      url,
      type,
      description,
      difficulty,
      source,
      duration,
      tags: [...tags, ...aiSuggestions.filter(tag => !tags.includes(tag))],
    };
    
    onSubmit(newResource);
    
    // Reset form
    setTitle('');
    setUrl('');
    setType('video');
    setDescription('');
    setDifficulty('Intermediate');
    setSource('');
    setDuration('');
    setTags([]);
    setAiSuggestions([]);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Resource Title</Label>
        <Input
          id="title"
          placeholder="Enter the title of the resource"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="url">Resource URL</Label>
        <div className="flex gap-2">
          <Input
            id="url"
            placeholder="https://"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
          <Button 
            type="button" 
            variant="outline" 
            onClick={analyzeResource}
            disabled={!url || isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                Analyzing
              </>
            ) : (
              'Analyze'
            )}
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type">Resource Type</Label>
          <Select value={type} onValueChange={(value) => setType(value as ResourceType)}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="video">Video</SelectItem>
              <SelectItem value="article">Article</SelectItem>
              <SelectItem value="course">Course</SelectItem>
              <SelectItem value="github">GitHub</SelectItem>
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="link">Other Link</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="difficulty">Difficulty Level</Label>
          <Select value={difficulty} onValueChange={(value) => setDifficulty(value as ResourceDifficulty)}>
            <SelectTrigger>
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Beginner">Beginner</SelectItem>
              <SelectItem value="Intermediate">Intermediate</SelectItem>
              <SelectItem value="Advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="source">Source</Label>
          <Input
            id="source"
            placeholder="e.g. YouTube, LeetCode, GeeksforGeeks"
            value={source}
            onChange={(e) => setSource(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="duration">Duration</Label>
          <Input
            id="duration"
            placeholder="e.g. 15 min, 1 hour, 4 weeks"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Briefly describe what this resource covers"
          className="h-24"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="tags">Tags</Label>
        <div className="flex gap-2">
          <Input
            id="tags"
            placeholder="Add tags and press Enter"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button 
            type="button" 
            variant="secondary" 
            onClick={handleAddTag}
          >
            Add
          </Button>
        </div>
        
        {/* Tags display */}
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map(tag => (
            <Badge key={tag} variant="outline" className="px-2 py-1 gap-1">
              {tag}
              <button type="button" onClick={() => removeTag(tag)} className="ml-1">
                <X size={14} className="hover:text-destructive" />
              </button>
            </Badge>
          ))}
        </div>
        
        {/* AI Suggested Tags */}
        {aiSuggestions.length > 0 && (
          <div className="mt-4">
            <p className="text-xs text-muted-foreground mb-2">AI-suggested tags:</p>
            <div className="flex flex-wrap gap-2">
              {aiSuggestions.map(tag => (
                <Badge 
                  key={tag} 
                  variant="secondary" 
                  className="px-2 py-1 gap-1 cursor-pointer hover:bg-primary/20"
                  onClick={() => {
                    if (!tags.includes(tag)) {
                      setTags([...tags, tag]);
                    }
                  }}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <Button type="submit" className="w-full bg-gradient-to-r from-primary to-purple-500">
        Submit Resource
      </Button>
    </form>
  );
}
