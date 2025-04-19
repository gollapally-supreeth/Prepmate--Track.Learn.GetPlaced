
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TestTube, Clock, Star, Award, Search, CheckCircle, XCircle, LineChart } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface MockTest {
  id: string;
  title: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  duration: number; // in minutes
  questionCount: number;
  attempted?: boolean;
  score?: number;
  completedDate?: string;
}

const mockTests: MockTest[] = [
  {
    id: '1',
    title: 'DSA Array Fundamentals',
    category: 'DSA',
    difficulty: 'Easy',
    duration: 30,
    questionCount: 15,
    attempted: true,
    score: 85,
    completedDate: '2025-04-15'
  },
  {
    id: '2',
    title: 'Advanced Graph Algorithms',
    category: 'DSA',
    difficulty: 'Hard',
    duration: 60,
    questionCount: 10
  },
  {
    id: '3',
    title: 'React Hooks & State Management',
    category: 'Web Dev',
    difficulty: 'Medium',
    duration: 45,
    questionCount: 20,
    attempted: true,
    score: 70,
    completedDate: '2025-04-10'
  },
  {
    id: '4',
    title: 'Neural Networks & Deep Learning',
    category: 'AI/ML',
    difficulty: 'Hard',
    duration: 90,
    questionCount: 25
  },
  {
    id: '5',
    title: 'Quantitative Aptitude - Time & Work',
    category: 'Aptitude',
    difficulty: 'Medium',
    duration: 40,
    questionCount: 20,
    attempted: true,
    score: 90,
    completedDate: '2025-04-18'
  },
  {
    id: '6',
    title: 'Database Design & SQL',
    category: 'CS Fundamentals',
    difficulty: 'Medium',
    duration: 60,
    questionCount: 30
  },
  {
    id: '7',
    title: 'Operating Systems Concepts',
    category: 'CS Fundamentals',
    difficulty: 'Hard',
    duration: 75,
    questionCount: 35
  },
  {
    id: '8',
    title: 'Google SDE Interview Prep',
    category: 'Company',
    difficulty: 'Hard',
    duration: 120,
    questionCount: 40
  }
];

const categories = ['All', 'DSA', 'Web Dev', 'AI/ML', 'Aptitude', 'CS Fundamentals', 'Company'];
const difficultyColors = {
  Easy: 'bg-green-500',
  Medium: 'bg-yellow-500',
  Hard: 'bg-red-500'
};

const MockTestsSection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filter, setFilter] = useState<'all' | 'attempted' | 'not-attempted'>('all');

  // Filter tests based on search term, category and attempted status
  const filteredTests = mockTests.filter(test => {
    const matchesSearch = test.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || test.category === selectedCategory;
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'attempted' && test.attempted) || 
      (filter === 'not-attempted' && !test.attempted);
    
    return matchesSearch && matchesCategory && matchesFilter;
  });

  // Stats for the user
  const completedTests = mockTests.filter(test => test.attempted).length;
  const totalTests = mockTests.length;
  const averageScore = mockTests
    .filter(test => test.score !== undefined)
    .reduce((sum, test) => sum + (test.score || 0), 0) / completedTests || 0;

  return (
    <div className="mock-tests-section space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <TestTube className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tests Completed</p>
              <p className="text-2xl font-bold">{completedTests}/{totalTests}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Star className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Average Score</p>
              <p className="text-2xl font-bold">{averageScore.toFixed(1)}%</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Award className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Top Category</p>
              <p className="text-2xl font-bold">Aptitude</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <TestTube className="h-5 w-5 text-primary" />
              Mock Tests
            </CardTitle>
            <Button>Create Custom Test</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              placeholder="Search tests..."
              className="flex-1"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              prefix={<Search className="h-4 w-4 text-muted-foreground" />}
            />
            
            <div className="flex gap-2">
              <Button 
                variant={filter === 'all' ? 'default' : 'outline'}
                onClick={() => setFilter('all')}
                className="flex-1"
              >
                All
              </Button>
              <Button 
                variant={filter === 'attempted' ? 'default' : 'outline'}
                onClick={() => setFilter('attempted')}
                className="flex-1"
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Completed
              </Button>
              <Button 
                variant={filter === 'not-attempted' ? 'default' : 'outline'}
                onClick={() => setFilter('not-attempted')}
                className="flex-1"
              >
                <XCircle className="h-4 w-4 mr-1" />
                New
              </Button>
            </div>
          </div>

          <Tabs defaultValue="All" onValueChange={setSelectedCategory}>
            <TabsList className="w-full flex overflow-x-auto hide-scrollbar">
              {categories.map(category => (
                <TabsTrigger key={category} value={category} className="flex-1 whitespace-nowrap">
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {filteredTests.length > 0 ? (
              filteredTests.map(test => (
                <Card key={test.id} className="overflow-hidden">
                  <div className={`h-1 w-full ${difficultyColors[test.difficulty]}`}></div>
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{test.title}</h3>
                      {test.attempted && <Badge className="bg-green-500">Completed</Badge>}
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge variant="outline">{test.category}</Badge>
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {test.duration} min
                      </Badge>
                      <Badge 
                        variant="secondary"
                        className={`
                          ${test.difficulty === 'Easy' && 'bg-green-500/20 text-green-700'} 
                          ${test.difficulty === 'Medium' && 'bg-yellow-500/20 text-yellow-700'} 
                          ${test.difficulty === 'Hard' && 'bg-red-500/20 text-red-700'}
                        `}
                      >
                        {test.difficulty}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center text-sm mb-3">
                      <span>{test.questionCount} Questions</span>
                    </div>
                    
                    {test.attempted && (
                      <>
                        <div className="mb-1 flex justify-between items-center">
                          <span className="text-sm">Your Score</span>
                          <span className="text-sm font-medium">{test.score}%</span>
                        </div>
                        <Progress value={test.score} className="h-1.5" />
                      </>
                    )}
                    
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <Button variant={test.attempted ? "outline" : "default"}>
                        {test.attempted ? 'Retake' : 'Start'} Test
                      </Button>
                      <Button variant="outline">View Details</Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full py-12 text-center">
                <p className="text-muted-foreground">No tests found matching your criteria</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Performance Analytics */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <LineChart className="h-5 w-5 text-primary" />
            Performance Analytics
          </CardTitle>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center">
          <p className="text-muted-foreground">Performance charts will be displayed here</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MockTestsSection;
