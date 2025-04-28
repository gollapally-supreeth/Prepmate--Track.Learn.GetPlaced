import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TestTube, Clock, Star, Award, Search, CheckCircle, XCircle, LineChart, Loader2, Trash2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import MockTestInterface from './MockTestInterface';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import TestGenerator, { generateTestWithAI } from './TestGenerator';
import { Bookmark, Flag } from 'lucide-react';
import TestDialog from '@/components/TestDialog';

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface MockTest {
  id: string;
  title: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  duration: number;
  questionCount: number;
  attempted?: boolean;
  score?: number;
  completedDate?: string;
  questions?: Question[];
}

interface TestConfig {
  subject: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  questionCount: number;
}

// Sample questions for DSA Array Fundamentals test
const dsaArrayQuestions: Question[] = [
  {
    id: '1',
    text: 'What is the time complexity of accessing an element in an array?',
    options: [
      'O(1)',
      'O(n)',
      'O(log n)',
      'O(n²)'
    ],
    correctAnswer: 0,
    explanation: 'Array elements are stored in contiguous memory locations, allowing direct access using index in constant time.'
  },
  {
    id: '2',
    text: 'Which of the following is not a valid array operation?',
    options: [
      'Insertion at the beginning',
      'Deletion from the end',
      'Accessing by index',
      'Sorting'
    ],
    correctAnswer: 0,
    explanation: 'Insertion at the beginning requires shifting all elements, making it an O(n) operation.'
  },
  // Add more questions...
];

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
    completedDate: '2025-04-15',
    questions: dsaArrayQuestions
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
  Easy: 'bg-emerald-500 dark:bg-emerald-600',
  Medium: 'bg-amber-500 dark:bg-amber-600',
  Hard: 'bg-rose-500 dark:bg-rose-600'
};

const MockTestsSection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filter, setFilter] = useState<'all' | 'attempted' | 'not-attempted'>('all');
  const [selectedTest, setSelectedTest] = useState<MockTest | null>(null);
  const [showTestInterface, setShowTestInterface] = useState(false);
  const [showTestGenerator, setShowTestGenerator] = useState(false);
  const [generatedTest, setGeneratedTest] = useState<MockTest | null>(null);
  const [markedQuestions, setMarkedQuestions] = useState<Set<string>>(new Set());
  const [config, setConfig] = useState<TestConfig>({
    subject: '',
    topic: '',
    difficulty: 'Medium',
    questionCount: 10
  });
  const { toast } = useToast();
  const [loadingTest, setLoadingTest] = useState(false);
  const [completedTestsList, setCompletedTestsList] = useState<MockTest[]>([]);
  const [tests, setTests] = useState([]);
  const [activeTest, setActiveTest] = useState(null);
  const [testDialogOpen, setTestDialogOpen] = useState(false);
  const [deletingTestId, setDeletingTestId] = useState<string | null>(null);

  // Merge completedTests with mockTests for display (avoid duplicates by id)
  const allTests = [
    ...completedTestsList,
    ...mockTests.filter(t => !completedTestsList.some(ct => ct.id === t.id))
  ];

  // Filter tests based on search term, category and attempted status
  const filteredTests = allTests.filter(test => {
    const matchesSearch = (test.title || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || test.category === selectedCategory;
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'attempted' && test.attempted) || 
      (filter === 'not-attempted' && !test.attempted);
    
    return matchesSearch && matchesCategory && matchesFilter;
  });

  // Stats for the user
  const completedTestsCount = completedTestsList.length;
  const totalTests = mockTests.length;
  const averageScore = mockTests
    .filter(test => test.score !== undefined)
    .reduce((sum, test) => sum + (test.score || 0), 0) / completedTestsCount || 0;

  // Fetch all tests on mount
  useEffect(() => {
    fetch('/api/tests')
      .then(res => res.json())
      .then(setTests);
  }, []);

  // Helper to fetch a test by id (with questions)
  const fetchTestById = async (id: string) => {
    try {
      const res = await fetch(`/api/tests/${id}`);
      if (!res.ok) throw new Error('Failed to fetch test');
      return await res.json();
    } catch (e) {
      // fallback to local state if fetch fails
      const found = tests.find((t: any) => t.id === id);
      return found;
    }
  };

  const handleStartTest = async (test: MockTest) => {
    if (test.questions && test.questions.length > 0) {
      setSelectedTest(test);
      setShowTestInterface(true);
      return;
    }
    setLoadingTest(true);
    // Provide all required TestConfig properties for generateTestWithAI
    const config = {
      subject: test.category,
      topic: test.title.replace(`${test.category} - `, ''),
      difficulty: test.difficulty,
      questionCount: test.questionCount || 10,
      questionTypes: ['mcq'], // default to MCQ
      timePerQuestion: 90, // default 90 seconds
      totalTime: (test.questionCount || 10) * 90, // total time in seconds
      difficultyMix: false // default
    };
    let questions = await generateTestWithAI(config, toast);
    // Fallback to local sample questions
    if (!questions || questions.length === 0) {
      questions = [{
        id: '1',
        text: 'No questions available for this test.',
        options: ['N/A'],
        correctAnswer: 0,
        explanation: ''
      }];
    }
    setSelectedTest({ ...test, questions });
    setShowTestInterface(true);
    setLoadingTest(false);
  };

  const handleTestComplete = (score: number) => {
    if (selectedTest) {
      // Add completed test to local state
      const completedTest: MockTest = {
        ...selectedTest,
        attempted: true,
        score,
        completedDate: new Date().toISOString(),
      };
      setCompletedTestsList(prev => [completedTest, ...prev]);
      toast({
        title: "Test Completed!",
        description: `Your score: ${score.toFixed(1)}%`,
      });
    }
    setShowTestInterface(false);
    setSelectedTest(null);
  };

  const handleTestGenerated = async (test: any) => {
    let testId = test.id;
    // If backend does not return id, fallback to last inserted
    if (!testId && test && test.length > 0) testId = test[test.length - 1].id;
    if (!testId) {
      toast({ title: 'Error', description: 'Could not get test ID after creation', variant: 'destructive' });
      return;
    }
    // Fetch the full test from backend
    const fullTest = await fetchTestById(testId);
    if (!fullTest || !fullTest.title) {
      toast({ title: 'Error', description: 'Could not fetch test after creation. Please try again.', variant: 'destructive' });
      // Optionally, refetch all tests to update UI
      fetch('/api/tests')
        .then(res => res.json())
        .then(setTests);
      return;
    }
    // Remove all empty/incomplete cards (no title) before adding the new one
    setTests((prev: any) => [fullTest, ...prev.filter((t: any) => t && t.title)]);
    setGeneratedTest(fullTest);
    setShowTestGenerator(false);
    setSelectedTest(fullTest);
    setShowTestInterface(true);
  };

  const handleMarkQuestion = (questionId: string) => {
    setMarkedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  // Delete test handler (removes from backend and UI)
  const handleDeleteTest = async (testId: string) => {
    if (!window.confirm('Are you sure you want to delete this test? This action cannot be undone.')) return;
    setDeletingTestId(testId);
    try {
      const res = await fetch(`/api/tests/${testId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete test');
      setTests((prev: any) => prev.filter((t: any) => t.id !== testId));
      setCompletedTestsList((prev) => prev.filter((t) => t.id !== testId));
      toast({ title: 'Test deleted', description: 'The test was deleted successfully.' });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Failed to delete test', variant: 'destructive' });
    } finally {
      setDeletingTestId(null);
    }
  };

  // Retake always fetches latest test data and opens test interface
  const handleTestGeneratedOrRetake = async (test: MockTest) => {
    const testWithQuestions = await fetchTestById(test.id);
    setActiveTest(testWithQuestions);
    setTestDialogOpen(true);
  };

  // View Details always fetches latest test data and opens dialog
  const handleViewDetails = async (test: MockTest) => {
    const testWithQuestions = await fetchTestById(test.id);
    setActiveTest(testWithQuestions);
    setTestDialogOpen(true);
  };

  return (
    <div className="mock-tests-section space-y-6">
      {/* Test Generator */}
      {showTestGenerator && (
        <TestGenerator onTestGenerated={handleTestGenerated} />
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="card-enhanced hover-card">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="bg-primary/15 p-3 rounded-full">
              <TestTube className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tests Completed</p>
              <p className="text-2xl font-bold">{completedTestsCount}/{totalTests}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-enhanced hover-card">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="bg-primary/15 p-3 rounded-full">
              <Star className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Average Score</p>
              <p className="text-2xl font-bold">{averageScore.toFixed(1)}%</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-enhanced hover-card">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="bg-primary/15 p-3 rounded-full">
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
      <Card className="card-enhanced">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <TestTube className="h-5 w-5 text-primary" />
              Mock Tests
            </CardTitle>
            <Button 
              className="button-animated"
              onClick={() => setShowTestGenerator(true)}
            >
              Generate New Test
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tests..."
                className="pl-9 input-enhanced"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant={filter === 'all' ? 'default' : 'outline'}
                onClick={() => setFilter('all')}
                className="flex-1 button-animated"
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                All
              </Button>
              <Button 
                variant={filter === 'attempted' ? 'default' : 'outline'}
                onClick={() => setFilter('attempted')}
                className="flex-1 button-animated"
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Completed
              </Button>
              <Button 
                variant={filter === 'not-attempted' ? 'default' : 'outline'}
                onClick={() => setFilter('not-attempted')}
                className="flex-1 button-animated"
              >
                <XCircle className="h-4 w-4 mr-1" />
                New
              </Button>
            </div>
          </div>

          <Tabs defaultValue="All" onValueChange={setSelectedCategory} className="w-full">
            <TabsList className="w-full flex overflow-x-auto hide-scrollbar">
              {categories.map(category => (
                <TabsTrigger key={category} value={category} className="flex-1 whitespace-nowrap">
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* Test Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loadingTest && (
          <div className="col-span-full py-12 text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary mb-2" />
            <p className="text-muted-foreground">Generating test questions...</p>
          </div>
        )}
        {!loadingTest && (filteredTests.length > 0 ? (
          filteredTests.map(test => (
            <Card key={test.id} className="overflow-hidden hover-card">
              <div className={`h-1 w-full ${difficultyColors[test.difficulty]}`}></div>
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">{test.title}</h3>
                  <div className="flex gap-2 items-center">
                    {test.attempted && <Badge className="bg-emerald-500 dark:bg-emerald-600">Completed</Badge>}
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label="Delete test"
                      onClick={() => handleDeleteTest(test.id)}
                      disabled={deletingTestId === test.id}
                      className="text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-900"
                    >
                      {deletingTestId === test.id ? <Loader2 className="animate-spin h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
                    </Button>
                  </div>
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
                      ${test.difficulty === 'Easy' && 'bg-emerald-500/20 text-emerald-700 dark:bg-emerald-500/30 dark:text-emerald-300'} 
                      ${test.difficulty === 'Medium' && 'bg-amber-500/20 text-amber-700 dark:bg-amber-500/30 dark:text-amber-300'} 
                      ${test.difficulty === 'Hard' && 'bg-rose-500/20 text-rose-700 dark:bg-rose-500/30 dark:text-rose-300'}
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
                    <Progress value={test.score} className="h-1.5 progress-bar" />
                  </>
                )}
                
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <Button 
                    variant={test.attempted ? "outline" : "default"} 
                    className="button-animated"
                    onClick={() => handleTestGeneratedOrRetake(test)}
                  >
                    {test.attempted ? 'Retake' : 'Start'} Test
                  </Button>
                  <Button variant="outline" className="button-animated" onClick={() => handleViewDetails(test)}>
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-12 text-center">
            <p className="text-muted-foreground">No tests found matching your criteria</p>
          </div>
        ))}
      </div>

      {/* Performance Analytics */}
      <Card className="card-enhanced">
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

      {/* Test Interface Dialog */}
      <Dialog open={showTestInterface} onOpenChange={setShowTestInterface}>
        <DialogContent className="max-w-4xl h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Mock Test</DialogTitle>
            <DialogDescription>
              Answer all questions and submit to see your score. You can mark questions for review.
            </DialogDescription>
          </DialogHeader>
          {selectedTest && (
            <MockTestInterface
              test={{
                id: selectedTest.id,
                title: selectedTest.title,
                questions: selectedTest.questions || [],
                duration: selectedTest.duration
              }}
              onComplete={handleTestComplete}
              onExit={() => setShowTestInterface(false)}
              markedQuestions={markedQuestions}
              onMarkQuestion={handleMarkQuestion}
            />
          )}
        </DialogContent>
      </Dialog>

      <TestDialog
        open={testDialogOpen}
        test={activeTest}
        onClose={() => setTestDialogOpen(false)}
      />
    </div>
  );
};

export default MockTestsSection;
