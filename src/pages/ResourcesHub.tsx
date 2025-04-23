
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResourceCard } from '@/components/ResourceCard';
import { Search, Filter, BookMarked, Youtube, Github, FileType, Plus, Bookmark, BookmarkPlus, Clock } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { AnimatePresence, motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ResourceSubmissionForm } from '@/components/resources/ResourceSubmissionForm';
import { ResourceRecommendations } from '@/components/resources/ResourceRecommendations';
import { ResourceFilters } from '@/components/resources/ResourceFilters';
import { LearningPathCard } from '@/components/resources/LearningPathCard';
import { resourceData } from '@/data/resourceData';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

// Resource types
export type ResourceType = 'video' | 'pdf' | 'github' | 'article' | 'course' | 'link';
export type ResourceDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';
export type ResourceCategory = 'dsa' | 'webDev' | 'ai' | 'dataScience' | 'computerFundamentals' | 'all';

export interface Resource {
  id: number;
  title: string;
  type: ResourceType;
  url: string;
  tags: string[];
  description?: string;
  duration?: string;
  difficulty?: ResourceDifficulty;
  source?: string;
  rating?: number;
  popularity?: number;
}

const ResourcesHub = () => {
  const [activeTab, setActiveTab] = useState<ResourceCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [resourceType, setResourceType] = useState<string>("all");
  const [difficulty, setDifficulty] = useState<string>("all");
  const [bookmarkedResources, setBookmarkedResources] = useState<number[]>([]);
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const { toast } = useToast();
  
  // Resources from our data file
  const resources = resourceData;

  useEffect(() => {
    // Load bookmarked resources from localStorage
    const savedBookmarks = localStorage.getItem('prepmate-bookmarked-resources');
    if (savedBookmarks) {
      setBookmarkedResources(JSON.parse(savedBookmarks));
    }
  }, []);
  
  // Filter resources based on current filters
  const filteredResources = resources.filter(resource => {
    if (activeTab !== "all" && resource.category !== activeTab) return false;
    if (searchQuery && !resource.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !resource.description?.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))) return false;
    if (resourceType !== "all" && resource.type !== resourceType) return false;
    if (difficulty !== "all" && resource.difficulty !== difficulty) return false;
    return true;
  });

  const toggleBookmark = (resourceId: number) => {
    let newBookmarks: number[];
    if (bookmarkedResources.includes(resourceId)) {
      newBookmarks = bookmarkedResources.filter(id => id !== resourceId);
      toast({
        title: "Bookmark Removed",
        description: "Resource has been removed from your bookmarks",
      });
    } else {
      newBookmarks = [...bookmarkedResources, resourceId];
      toast({
        title: "Bookmark Added",
        description: "Resource has been added to your bookmarks",
      });
    }
    setBookmarkedResources(newBookmarks);
    localStorage.setItem('prepmate-bookmarked-resources', JSON.stringify(newBookmarks));
  };

  const handleOpenResource = (url: string, resource: Resource) => {
    window.open(url, '_blank');
    toast({
      title: "Resource Opened",
      description: `Opening ${resource.title}`,
    });
    
    // Track resource view in history
    const history = JSON.parse(localStorage.getItem('prepmate-resource-history') || '[]');
    const newHistory = [
      { id: resource.id, timestamp: new Date().toISOString() },
      ...history.filter((item: {id: number}) => item.id !== resource.id)
    ].slice(0, 50); // Keep last 50 items
    localStorage.setItem('prepmate-resource-history', JSON.stringify(newHistory));
  };

  const handleResourceSubmit = (newResource: Partial<Resource>) => {
    toast({
      title: "Resource Submitted",
      description: "Your resource has been submitted for review",
    });
    
    setShowSubmissionForm(false);
  };
  
  return (
    <div className="space-y-6 animate-fade-in pb-12 max-w-full overflow-x-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Resources Hub</h1>
          <p className="text-muted-foreground mt-1">Explore curated learning resources for computer science</p>
        </div>
        
        <Dialog open={showSubmissionForm} onOpenChange={setShowSubmissionForm}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-gradient-to-r from-primary to-purple-500">
              <Plus size={16} />
              <span>Submit Resource</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-center text-2xl">Submit a Learning Resource</DialogTitle>
            </DialogHeader>
            <ResourceSubmissionForm onSubmit={handleResourceSubmit} />
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Search and Filters */}
      <div className="flex flex-col gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <Input 
            placeholder="Search resources with natural language... e.g. 'beginner friendly React tutorials'" 
            className="pl-10 bg-background/60 border-primary/20 focus-visible:ring-primary/30" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <ResourceFilters
          resourceType={resourceType}
          setResourceType={setResourceType}
          difficulty={difficulty}
          setDifficulty={setDifficulty}
        />
      </div>
      
      {/* AI-powered recommendations */}
      <ResourceRecommendations />
      
      {/* Resource Categories */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ResourceCategory)}>
        <div className="relative overflow-x-auto pb-2">
          <TabsList className="w-full inline-flex justify-start overflow-x-auto no-scrollbar p-1 bg-background/60">
            <TabsTrigger value="all" className="flex-shrink-0">All Resources</TabsTrigger>
            <TabsTrigger value="dsa" className="flex-shrink-0">DSA</TabsTrigger>
            <TabsTrigger value="webDev" className="flex-shrink-0">Web Dev</TabsTrigger>
            <TabsTrigger value="ai" className="flex-shrink-0">AI & ML</TabsTrigger>
            <TabsTrigger value="dataScience" className="flex-shrink-0">Data Science</TabsTrigger>
            <TabsTrigger value="computerFundamentals" className="flex-shrink-0">Computer Fundamentals</TabsTrigger>
          </TabsList>
          <div className="absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-background to-transparent pointer-events-none"></div>
        </div>
        
        {/* Tabs content */}
        <TabsContent value={activeTab} className="mt-4 w-full">
          <div className="flex items-center gap-2 mb-6">
            <BookMarked size={20} className="text-primary" />
            <h2 className="text-xl font-semibold">
              {activeTab === "all" && "All Learning Resources"}
              {activeTab === "dsa" && "Data Structures & Algorithms"}
              {activeTab === "webDev" && "Web Development"}
              {activeTab === "ai" && "Artificial Intelligence & Machine Learning"}
              {activeTab === "dataScience" && "Data Science"}
              {activeTab === "computerFundamentals" && "Computer Fundamentals"}
            </h2>
            <Badge variant="outline" className="ml-2 bg-primary/10">
              {filteredResources.length} resources
            </Badge>
          </div>
          
          {/* Resources grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
            <AnimatePresence mode="popLayout">
              {filteredResources.length > 0 ? (
                filteredResources.map(resource => (
                  <motion.div 
                    key={resource.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="group"
                  >
                    <div className="relative">
                      <ResourceCard
                        title={resource.title}
                        type={resource.type}
                        url={resource.url}
                        tags={resource.tags}
                        description={resource.description || ""}
                        difficulty={resource.difficulty || "Intermediate"}
                        duration={resource.duration || ""}
                        source={resource.source || ""}
                        rating={resource.rating || 0}
                        onClick={() => handleOpenResource(resource.url, resource)}
                      />
                      <button
                        className={cn(
                          "absolute top-3 right-3 w-8 h-8 rounded-full bg-background/60 backdrop-blur-sm flex items-center justify-center transition-all",
                          bookmarkedResources.includes(resource.id) 
                            ? "text-primary" 
                            : "text-muted-foreground opacity-0 group-hover:opacity-100"
                        )}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleBookmark(resource.id);
                        }}
                      >
                        {bookmarkedResources.includes(resource.id) ? (
                          <Bookmark size={16} className="fill-primary" />
                        ) : (
                          <BookmarkPlus size={16} />
                        )}
                      </button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <Card className="col-span-full p-8 text-center border border-dashed">
                  <CardContent className="flex flex-col items-center gap-3 pt-6">
                    <Search size={40} className="text-muted-foreground/50" />
                    <p className="text-muted-foreground">No resources found matching your criteria.</p>
                    <Button variant="outline" className="mt-2" onClick={() => {
                      setSearchQuery("");
                      setResourceType("all");
                      setDifficulty("all");
                    }}>
                      Clear Filters
                    </Button>
                  </CardContent>
                </Card>
              )}
            </AnimatePresence>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Learning Paths Section */}
      <div className="pt-8 border-t border-border/50 w-full">
        <div className="flex items-center gap-2 mb-6">
          <Clock size={20} className="text-primary" />
          <h2 className="text-xl font-semibold">Learning Paths</h2>
          <Badge variant="outline" className="ml-2 bg-primary/10">AI Generated</Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <LearningPathCard 
            title="Master Data Structures in 30 Days"
            description="A comprehensive learning path covering arrays, linked lists, trees, and graphs with daily exercises."
            duration="30 days"
            difficulty="Intermediate"
            resourceCount={24}
            image="/placeholder.svg"
          />
          <LearningPathCard 
            title="Full Stack Web Development"
            description="From HTML/CSS fundamentals to building complex React and Node.js applications."
            duration="60 days"
            difficulty="Beginner to Advanced"
            resourceCount={42}
            image="/placeholder.svg"
          />
          <LearningPathCard 
            title="Machine Learning Foundations"
            description="Core ML concepts, algorithms, and practical implementations using Python and popular frameworks."
            duration="45 days"
            difficulty="Intermediate"
            resourceCount={36}
            image="/placeholder.svg"
          />
        </div>
      </div>
    </div>
  );
};

export default ResourcesHub;
