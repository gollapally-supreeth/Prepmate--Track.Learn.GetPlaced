
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { PorterStemmer } from "natural";

interface Resource {
  title: string;
  description: string;
  category?: string;
}

const calculateKeywordOverlap = (resource1: Resource, resource2: Resource): number => {
  const stemTitle1 = resource1.title
    .toLowerCase()
    .split(/\s+/)
    .map((word) => PorterStemmer.stem(word))
    .filter(word => word.trim() !== "");
  const stemDescription1 = resource1.description
    .toLowerCase()
    .split(/\s+/)
    .map((word) => PorterStemmer.stem(word))
    .filter(word => word.trim() !== "");
  
  const stemTitle2 = resource2.title
    .toLowerCase()
    .split(/\s+/)
    .map((word) => PorterStemmer.stem(word))
    .filter(word => word.trim() !== "");
  const stemDescription2 = resource2.description
    .toLowerCase()
    .split(/\s+/)
    .map((word) => PorterStemmer.stem(word))
    .filter(word => word.trim() !== "");

  const stemmedWords1 = [...stemTitle1, ...stemDescription1];
  const stemmedWords2 = [...stemTitle2, ...stemDescription2];
  const commonWords = new Set(stemmedWords1.filter(word => stemmedWords2.includes(word)));
  return commonWords.size;
};

const ResourceHub: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [recommendations, setRecommendations] = useState<Resource[]>([]);
  
  const resources: Resource[] = [
    {
      title: "Introduction to Data Structures",
      description: "A beginner's guide to understanding data structures.",
      category: "dsa"
    },
    {
      title: "Advanced Web Development Techniques",
      description: "Explore modern web development concepts and practices.",
      category: "webDev"
    },
    {
      title: "Running with Algorithms",
      description: "Learn about various algorithms and their applications.",
      category: "dsa"
    },
    {
      title: "Studying Database Systems",
      description: "A comprehensive study on database systems and management.",
      category: "computerFundamentals"
    },
  ];

  const generateRecommendations = (
    resources: Resource[],
    currentResource?: Resource
  ): Resource[] => {
    const current = currentResource || resources[Math.floor(Math.random() * resources.length)];
    const similarityScores = resources.map((resource) => ({
      resource,
      score: calculateKeywordOverlap(current, resource),
    }));
    similarityScores.sort((a, b) => b.score - a.score);
    return similarityScores
      .filter((item) => item.resource !== current)
      .slice(0, 3)
      .map((item) => item.resource);
  };

  useEffect(() => {
    const generatedRecommendations = generateRecommendations(resources);
    setRecommendations(generatedRecommendations);
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value);
  };

  const filteredResources = resources.filter((resource) => {
    // Apply text search filter
    const stemmedSearchTerm = searchTerm ? PorterStemmer.stem(searchTerm.toLowerCase()) : '';
    const stemmedTitle = resource.title ? PorterStemmer.stem(resource.title.toLowerCase()) : '';
    const stemmedDescription = resource.description ? PorterStemmer.stem(resource.description.toLowerCase()) : '';
    
    const matchesSearch = !searchTerm || 
      stemmedTitle.includes(stemmedSearchTerm) ||
      stemmedDescription.includes(stemmedSearchTerm);
    
    // Apply category filter
    const matchesCategory = categoryFilter === 'all' || resource.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <Card className="p-6 overflow-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Explore Resources</h3>
        <Button size="sm">Add Resource</Button>
      </div>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Input
          type="search"
          placeholder="Search resources..."
          className="flex-1"
          onChange={handleSearchChange}
          value={searchTerm}
        />
        <Select value={categoryFilter} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subjects</SelectItem>
            <SelectItem value="dsa">DSA</SelectItem>
            <SelectItem value="webDev">Web Dev</SelectItem>
            <SelectItem value="computerFundamentals">Computer Fundamentals</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Resource List */}
      <div className="mb-6">
        <h4 className="text-md font-medium mb-3">Resources</h4>
        {filteredResources.length > 0 ? (
          <ul className="space-y-2">
            {filteredResources.map((resource, index) => (
              <li key={index} className="p-3 border rounded-md hover:bg-muted/50">
                <h5 className="font-medium">{resource.title}</h5>
                <p className="text-sm text-muted-foreground">{resource.description}</p>
                <div className="mt-1">
                  <Badge variant="outline" className="text-xs">
                    {resource.category === 'dsa' ? 'DSA' : 
                     resource.category === 'webDev' ? 'Web Dev' : 
                     resource.category === 'computerFundamentals' ? 'Computer Fundamentals' : 
                     'Other'}
                  </Badge>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">No matching resources found.</p>
        )}
      </div>
      
      {/* Recommendations Section */}
      <div className="mt-6">
        <h4 className="text-md font-medium mb-2">Recommended Resources</h4>
        {recommendations.length > 0 ? (
          <ul className="space-y-2">
            {recommendations.map((resource, index) => (
              <li key={index} className="p-2 border rounded-md hover:bg-muted/50">
                <p className="font-medium">{resource.title}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">No recommendations found.</p>
        )}
      </div>
    </Card>
  );
};

export default ResourceHub;
