
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Filter, ChevronDown, ChevronUp } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface ResourceFiltersProps {
  resourceType: string;
  setResourceType: (value: string) => void;
  difficulty: string;
  setDifficulty: (value: string) => void;
}

export function ResourceFilters({
  resourceType,
  setResourceType,
  difficulty,
  setDifficulty,
}: ResourceFiltersProps) {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState(0);
  const [duration, setDuration] = useState([0, 60]);
  const [onlyBookmarks, setOnlyBookmarks] = useState(false);
  
  return (
    <>
      {/* Desktop filters */}
      <div className="hidden md:flex flex-wrap gap-3">
        <Select value={resourceType} onValueChange={setResourceType}>
          <SelectTrigger className="w-[150px] bg-background/60 border-primary/20">
            <SelectValue placeholder="Resource Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="video">Videos</SelectItem>
            <SelectItem value="article">Articles</SelectItem>
            <SelectItem value="github">GitHub</SelectItem>
            <SelectItem value="pdf">PDFs</SelectItem>
            <SelectItem value="course">Courses</SelectItem>
            <SelectItem value="link">Links</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={difficulty} onValueChange={setDifficulty}>
          <SelectTrigger className="w-[150px] bg-background/60 border-primary/20">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="Beginner">Beginner</SelectItem>
            <SelectItem value="Intermediate">Intermediate</SelectItem>
            <SelectItem value="Advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>
        
        <Button 
          variant="outline" 
          className="gap-2 bg-background/60 border-primary/20"
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
        >
          <Filter size={16} />
          <span>More Filters</span>
          {showAdvancedFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          {activeFilters > 0 && (
            <Badge variant="default" className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full">
              {activeFilters}
            </Badge>
          )}
        </Button>
      </div>
      
      {/* Mobile filters */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full gap-2">
              <Filter size={16} />
              <span>Filters</span>
              {activeFilters > 0 && (
                <Badge variant="default" className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full">
                  {activeFilters}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[300px] sm:w-[400px]">
            <SheetHeader>
              <SheetTitle>Filter Resources</SheetTitle>
            </SheetHeader>
            <div className="py-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="mobileResourceType">Resource Type</Label>
                <Select value={resourceType} onValueChange={setResourceType}>
                  <SelectTrigger id="mobileResourceType">
                    <SelectValue placeholder="Resource Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="video">Videos</SelectItem>
                    <SelectItem value="article">Articles</SelectItem>
                    <SelectItem value="github">GitHub</SelectItem>
                    <SelectItem value="pdf">PDFs</SelectItem>
                    <SelectItem value="course">Courses</SelectItem>
                    <SelectItem value="link">Links</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="mobileDifficulty">Difficulty</Label>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger id="mobileDifficulty">
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Duration (minutes)</Label>
                <div className="px-2">
                  <Slider 
                    defaultValue={[0, 60]} 
                    max={60} 
                    step={5} 
                    value={duration}
                    onValueChange={setDuration}
                  />
                  <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                    <span>{duration[0]} min</span>
                    <span>{duration[1] === 60 ? '60+ min' : `${duration[1]} min`}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="mobileBookmarks">Show only bookmarks</Label>
                <Switch 
                  id="mobileBookmarks"
                  checked={onlyBookmarks}
                  onCheckedChange={setOnlyBookmarks}
                />
              </div>
              
              <Button className="w-full bg-gradient-to-r from-primary to-purple-500" onClick={() => {
                setActiveFilters((duration[0] > 0 || duration[1] < 60) ? activeFilters + 1 : activeFilters);
              }}>
                Apply Filters
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
      
      {/* Advanced filters panel (desktop) */}
      {showAdvancedFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="w-full bg-background/60 rounded-lg border border-primary/20 p-4 mt-2"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Duration</Label>
              <Slider 
                defaultValue={[0, 60]} 
                max={60} 
                step={5} 
                value={duration}
                onValueChange={setDuration}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{duration[0]} min</span>
                <span>{duration[1] === 60 ? '60+ min' : `${duration[1]} min`}</span>
              </div>
            </div>
            
            <div>
              <Accordion type="single" collapsible>
                <AccordionItem value="source">
                  <AccordionTrigger className="text-sm">Source</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 pt-2">
                      <div className="flex items-center gap-2">
                        <Switch id="youtube" />
                        <Label htmlFor="youtube">YouTube</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch id="leetcode" />
                        <Label htmlFor="leetcode">LeetCode</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch id="gfg" />
                        <Label htmlFor="gfg">GeeksforGeeks</Label>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="bookmarks"
                  checked={onlyBookmarks}
                  onCheckedChange={setOnlyBookmarks}
                />
                <Label htmlFor="bookmarks">Show only bookmarks</Label>
              </div>
            </div>
            
            <div className="flex items-center justify-end">
              <Button onClick={() => {
                setActiveFilters((duration[0] > 0 || duration[1] < 60 || onlyBookmarks) ? 1 : 0);
                setShowAdvancedFilters(false);
              }}>
                Apply Filters
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}
