
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResourceCard } from '@/components/ResourceCard';
import { Search, Filter, BookMarked, Youtube, Github, FileType } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

// Sample resource data
const sampleResources = {
  dsa: [
    {
      id: 1,
      title: "Data Structures Easy to Advanced Course",
      type: "video" as const,
      url: "https://www.youtube.com/playlist?list=PLEJXowNB4kPzByLnnFYNSCoqtFz0VKLk5",
      tags: ["Arrays", "Linked Lists", "Trees", "Graphs"]
    },
    {
      id: 2,
      title: "Complete DSA for Placements",
      type: "video" as const,
      url: "https://www.youtube.com/playlist?list=PLDzeHZWIZsTryvtXdMr6rPh4IDexB5NIA",
      tags: ["Algorithms", "Sorting", "Dynamic Programming"]
    },
    {
      id: 3,
      title: "DSA Visualization Tools",
      type: "github" as const,
      url: "https://github.com/algorithm-visualizer/algorithm-visualizer",
      tags: ["Visualization", "Interactive", "Educational"]
    },
    {
      id: 4,
      title: "Introduction to Algorithms - MIT OCW",
      type: "pdf" as const,
      url: "https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/6-006-introduction-to-algorithms-fall-2011/lecture-notes/",
      tags: ["MIT", "Lecture Notes", "Academic"]
    }
  ],
  webDev: [
    {
      id: 5,
      title: "Full Stack Web Development Course",
      type: "video" as const,
      url: "https://www.youtube.com/playlist?list=PLZlA0Gpn_vH_uZs4vJMIhcinABSTUH2bY",
      tags: ["HTML", "CSS", "JavaScript", "React"]
    },
    {
      id: 6,
      title: "Web Dev Roadmap 2023",
      type: "link" as const,
      url: "https://roadmap.sh/frontend",
      tags: ["Roadmap", "Guide", "Career Path"]
    },
    {
      id: 7,
      title: "Modern React with TypeScript",
      type: "video" as const,
      url: "https://www.youtube.com/playlist?list=PLC3y8-rFHvwi1AXijGTKM0BKtHzVC-LSK",
      tags: ["React", "TypeScript", "Hooks", "State Management"]
    },
    {
      id: 8,
      title: "Backend Development with Node.js",
      type: "github" as const,
      url: "https://github.com/goldbergyoni/nodebestpractices",
      tags: ["Node.js", "Express", "API", "Best Practices"]
    }
  ],
  ai: [
    {
      id: 9,
      title: "Machine Learning Course - Andrew Ng",
      type: "video" as const,
      url: "https://www.youtube.com/playlist?list=PLLssT5z_DsK-h9vYZkQkYNWcItqhlRJLN",
      tags: ["Machine Learning", "Stanford", "Fundamental"]
    },
    {
      id: 10,
      title: "Deep Learning Specialization",
      type: "video" as const,
      url: "https://www.youtube.com/playlist?list=PLkDaE6sCZn6Ec-XTbcX1uRg2_u4xOEky0",
      tags: ["Neural Networks", "Computer Vision", "NLP"]
    },
    {
      id: 11,
      title: "Hands-On Machine Learning Projects",
      type: "github" as const,
      url: "https://github.com/ageron/handson-ml2",
      tags: ["Projects", "Scikit-Learn", "TensorFlow"]
    },
    {
      id: 12,
      title: "AI Ethics and Governance",
      type: "pdf" as const,
      url: "https://www.partnershiponai.org/paper/ai-ethics-governance/",
      tags: ["Ethics", "Policy", "Responsible AI"]
    }
  ],
  dataScience: [
    {
      id: 13,
      title: "Data Science Full Course",
      type: "video" as const,
      url: "https://www.youtube.com/watch?v=ua-CiDNNj30",
      tags: ["Python", "Statistics", "Data Analysis"]
    },
    {
      id: 14,
      title: "Data Visualization Techniques",
      type: "video" as const,
      url: "https://www.youtube.com/playlist?list=PLQVvvaa0QuDfhTF3Zfyzc_yD-Mq9iTp4G",
      tags: ["Matplotlib", "Seaborn", "D3.js"]
    },
    {
      id: 15,
      title: "Data Science from Scratch",
      type: "github" as const,
      url: "https://github.com/joelgrus/data-science-from-scratch",
      tags: ["Python", "Algorithms", "Statistics"]
    },
    {
      id: 16,
      title: "Advanced SQL for Data Science",
      type: "pdf" as const,
      url: "https://mode.com/sql-tutorial/",
      tags: ["SQL", "Database", "Query Optimization"]
    }
  ],
  computerFundamentals: [
    {
      id: 17,
      title: "Computer Science Crash Course",
      type: "video" as const,
      url: "https://www.youtube.com/playlist?list=PL8dPuuaLjXtNlUrzyH5r6jN9ulIgZBpdo",
      tags: ["Computer Architecture", "Operating Systems", "Networks"]
    },
    {
      id: 18,
      title: "Operating Systems - Gate Lectures",
      type: "video" as const,
      url: "https://www.youtube.com/playlist?list=PLEbnTDJUr_IeHYw_sfBOJ6gk5pie0yP-0",
      tags: ["OS", "Process Management", "Memory Management"]
    },
    {
      id: 19,
      title: "Computer Networks - Stanford",
      type: "pdf" as const,
      url: "https://cs144.github.io/",
      tags: ["Networks", "TCP/IP", "Protocols"]
    },
    {
      id: 20,
      title: "DBMS Complete Course",
      type: "video" as const,
      url: "https://www.youtube.com/playlist?list=PLxCzCOWd7aiFAN6I8CuViBuCdJgiOkT2Y",
      tags: ["Database", "SQL", "Normalization", "Transactions"]
    }
  ]
};

const ResourcesHub = () => {
  const [activeTab, setActiveTab] = useState("dsa");
  const [searchQuery, setSearchQuery] = useState("");
  const [resourceType, setResourceType] = useState("all");
  const { toast } = useToast();
  
  // Filter resources based on current filters
  const filteredResources = sampleResources[activeTab as keyof typeof sampleResources].filter(resource => {
    if (searchQuery && !resource.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (resourceType !== "all" && resource.type !== resourceType) return false;
    return true;
  });

  const handleOpenResource = (url: string) => {
    window.open(url, '_blank');
    toast({
      title: "Resource Opened",
      description: "The resource has been opened in a new tab.",
    });
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Resources Hub</h1>
        <p className="text-muted-foreground mt-1">Explore curated learning resources for computer science</p>
      </div>
      
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <Input 
            placeholder="Search resources..." 
            className="pl-10" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-3">
          <Select value={resourceType} onValueChange={setResourceType}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Resource Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="video">Videos</SelectItem>
              <SelectItem value="pdf">PDFs</SelectItem>
              <SelectItem value="github">GitHub</SelectItem>
              <SelectItem value="link">Links</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" className="gap-2">
            <Filter size={16} />
            <span className="hidden sm:inline">More Filters</span>
          </Button>
        </div>
      </div>
      
      {/* Resource Categories */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full sm:w-auto flex justify-between sm:inline-flex">
          <TabsTrigger value="dsa" className="flex-1 sm:flex-initial">DSA</TabsTrigger>
          <TabsTrigger value="webDev" className="flex-1 sm:flex-initial">Web Dev</TabsTrigger>
          <TabsTrigger value="ai" className="flex-1 sm:flex-initial">AI</TabsTrigger>
          <TabsTrigger value="dataScience" className="flex-1 sm:flex-initial">Data Science</TabsTrigger>
          <TabsTrigger value="computerFundamentals" className="flex-1 sm:flex-initial">Comp. Fundamentals</TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <BookMarked size={20} className="text-focus-blue" />
            {activeTab === "dsa" && "Data Structures & Algorithms"}
            {activeTab === "webDev" && "Web Development"}
            {activeTab === "ai" && "Artificial Intelligence"}
            {activeTab === "dataScience" && "Data Science"}
            {activeTab === "computerFundamentals" && "Computer Fundamentals"}
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredResources.length > 0 ? (
              filteredResources.map(resource => (
                <div 
                  key={resource.id} 
                  onClick={() => handleOpenResource(resource.url)}
                  className="cursor-pointer"
                >
                  <ResourceCard
                    title={resource.title}
                    type={resource.type}
                    url={resource.url}
                    tags={resource.tags}
                  />
                </div>
              ))
            ) : (
              <Card className="col-span-full p-8 text-center">
                <CardContent>
                  <p className="text-muted-foreground">No resources found matching your criteria.</p>
                  <Button variant="outline" className="mt-4" onClick={() => {
                    setSearchQuery("");
                    setResourceType("all");
                  }}>
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </Tabs>
      
      {/* Submit Resource Button */}
      <div className="flex justify-center mt-8">
        <Button 
          className="gap-2"
          onClick={() => {
            toast({
              title: "Coming Soon!",
              description: "Resource submission is coming soon. Stay tuned!",
            });
          }}
        >
          <Github size={16} />
          <span>Submit a Resource</span>
        </Button>
      </div>
    </div>
  );
};

export default ResourcesHub;
