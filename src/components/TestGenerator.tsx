import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, ChevronDown, ChevronUp, Star, Clock, ListChecks, Plus, RefreshCcw, Bookmark, Zap, X, Database, Cpu, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandSeparator } from '@/components/ui/command';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Toggle } from '@/components/ui/toggle';
import { Separator } from '@/components/ui/separator';

interface TestConfig {
  subject: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Very Hard';
  questionCount: number;
  questionTypes: string[];
  timePerQuestion: number;
  totalTime: number;
  difficultyMix: boolean;
}

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface TestGeneratorProps {
  onTestGenerated: (questions: Question[]) => void;
}

const subjects = {
  'DSA': ['Arrays', 'Linked Lists', 'Trees', 'Graphs', 'Sorting', 'Searching'],
  'DBMS': ['SQL', 'Normalization', 'Transactions', 'Indexing', 'ER Model'],
  'OS': ['Processes', 'Memory Management', 'File Systems', 'Scheduling', 'Deadlocks'],
  'CN': ['TCP/IP', 'HTTP', 'DNS', 'Network Security', 'Routing'],
  'Aptitude': ['Quantitative', 'Logical', 'Verbal', 'Data Interpretation']
};

// Sample questions for different topics
const sampleQuestions: Record<string, Record<string, Question[]>> = {
  'DSA': {
    'Arrays': [
      {
        id: '1',
        text: 'What is the time complexity of accessing an element in an array?',
        options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
        correctAnswer: 0,
        explanation: 'Array elements are stored in contiguous memory locations, allowing direct access using index in constant time.'
      },
      {
        id: '2',
        text: 'Which of the following is not a valid array operation?',
        options: ['Insertion at the beginning', 'Deletion from the end', 'Accessing by index', 'Sorting'],
        correctAnswer: 0,
        explanation: 'Insertion at the beginning requires shifting all elements, making it an O(n) operation.'
      }
    ],
    'Linked Lists': [
      {
        id: '1',
        text: 'What is the time complexity of inserting a node at the beginning of a singly linked list?',
        options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
        correctAnswer: 0,
        explanation: 'Inserting at the beginning of a linked list only requires updating the head pointer and the new node\'s next pointer.'
      }
    ]
  },
  'DBMS': {
    'SQL': [
      {
        id: '1',
        text: 'Which SQL command is used to modify existing data in a table?',
        options: ['UPDATE', 'MODIFY', 'CHANGE', 'ALTER'],
        correctAnswer: 0,
        explanation: 'The UPDATE command is used to modify existing records in a table.'
      }
    ]
  }
};

export async function generateTestWithAI(config: TestConfig, toast: any): Promise<Question[] | null> {
  try {
    const prompt = `You are an expert placement test generator. Generate a mock test in strict JSON format.\n\nRequirements:\n- Subject: ${config.subject}\n- Topic: ${config.topic}\n- Difficulty: ${config.difficulty}\n- Number of questions: ${config.questionCount}\n\nReturn ONLY valid JSON in this format (no explanation, no markdown):\n{\n  "questions": [\n    {\n      "question": "Question text",\n      "options": ["Option 1", "Option 2", "Option 3", "Option 4"],\n      "answer": 0,\n      "explanation": "Brief explanation"\n    }\n  ]\n}\n`;
    const response = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=AIzaSyC5aGC2WSXp6SiPS9W8uKyFmLB7WkwKKMU', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });
    if (!response.ok) throw new Error('API error');
    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('No content from AI');
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        try {
          parsed = JSON.parse(match[0]);
        } catch (e2) {
          toast({
            title: 'AI JSON Parse Error',
            description: 'Raw response: ' + text.slice(0, 300),
            variant: 'destructive',
            duration: 10000
          });
          return null;
        }
      } else {
        toast({
          title: 'No JSON found in AI response',
          description: 'Raw response: ' + text.slice(0, 300),
          variant: 'destructive',
          duration: 10000
        });
        return null;
      }
    }
    if (!parsed.questions || !Array.isArray(parsed.questions) || parsed.questions.length === 0) {
      toast({
        title: 'AI did not return any questions',
        description: 'Raw response: ' + text.slice(0, 300),
        variant: 'destructive',
        duration: 10000
      });
      return null;
    }
    // Relaxed: show whatever questions Gemini returns, warn if incomplete
    const questions = parsed.questions.map((q: any, idx: number) => ({
      id: `q${idx + 1}`,
      text: q.question || '',
      options: Array.isArray(q.options) ? q.options.slice(0, 4) : ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
      correctAnswer: typeof q.answer === 'number' ? q.answer : 0,
      explanation: q.explanation || ''
    }));
    if (questions.length !== config.questionCount || !questions.every(q => q.text && q.options.length === 4)) {
      toast({
        title: 'AI returned incomplete or malformed questions',
        description: `Some questions may be missing or incomplete. Showing what was generated.`,
        variant: 'warning',
        duration: 8000
      });
    }
    return questions;
  } catch (error: any) {
    toast({
      title: 'AI Generation Failed',
      description: error.message || 'Could not generate test with AI. Please try again later.',
      variant: 'destructive'
    });
    return null;
  }
}

const questionTypes = [
  { label: 'MCQ', value: 'mcq' },
  { label: 'Coding', value: 'coding' },
  { label: 'Theory', value: 'theory' },
  { label: 'Descriptive', value: 'descriptive' },
];
const difficulties = ['Easy', 'Medium', 'Hard', 'Very Hard'];

const MAX_RECENT = 5;

const subjectIcons: Record<string, JSX.Element> = {
  'DSA': <Zap className="h-4 w-4 text-orange-500 mr-2" />, // Example icons
  'DBMS': <Database className="h-4 w-4 text-blue-500 mr-2" />,
  'OS': <Cpu className="h-4 w-4 text-green-500 mr-2" />,
  'CN': <Globe className="h-4 w-4 text-purple-500 mr-2" />,
  'Aptitude': <ListChecks className="h-4 w-4 text-pink-500 mr-2" />,
};

const TestGeneratorInner: React.FC<TestGeneratorProps & {
  onClose: () => void,
  loading: boolean,
  error: string | null,
  handleGenerateTest: () => Promise<void>,
  setShowPreviewModal: (v: boolean) => void,
  config: TestConfig,
  setConfig: React.Dispatch<React.SetStateAction<TestConfig>>,
  previewQuestions: Question[] | null,
  showPreviewModal: boolean,
  handleStartTest: () => void,
  recentConfigs: TestConfig[],
  setRecentConfigs: React.Dispatch<React.SetStateAction<TestConfig[]>>,
  favoriteConfigs: TestConfig[],
  setFavoriteConfigs: React.Dispatch<React.SetStateAction<TestConfig[]>>,
  toast: any,
}> = ({
  onTestGenerated, onClose, loading, error, handleGenerateTest, setShowPreviewModal, config, setConfig, previewQuestions, showPreviewModal, handleStartTest, recentConfigs, setRecentConfigs, favoriteConfigs, setFavoriteConfigs, toast
}) => {
  // Remove all local state for config, previewQuestions, error, loading, etc.
  // Only use props/state from parent
  // ...
  // All handlers that modify config, recentConfigs, favoriteConfigs use setConfig/setRecentConfigs/setFavoriteConfigs from props
  // ...
  // UI
  return (
    <div className="max-h-[70vh] overflow-y-auto pb-32">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          Create Your Personalized Test
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Collapsible Quick Configs */}
        <details className="mb-2">
          <summary className="cursor-pointer font-medium text-sm mb-1">Quick Configs</summary>
          <div className="flex flex-wrap gap-2 mt-2">
            {/* ...popularTopics, recentConfigs, favoriteConfigs... */}
            {/* Use setConfig, setRecentConfigs, setFavoriteConfigs from props */}
          </div>
        </details>
        <Separator />
        {/* Step 1: Subject Selection (Command Combobox) */}
          <div className="space-y-2">
          <label className="text-sm font-medium">Subject <span className="text-red-500">*</span></label>
          <Command className="rounded-md border bg-background">
            <CommandInput placeholder="Search or select subject..." />
            <CommandList>
              <CommandEmpty>No subjects found.</CommandEmpty>
              <CommandGroup heading="Subjects">
                {Object.keys(subjects).map(subject => (
                  <CommandItem
                    key={subject}
                    value={subject}
                    onSelect={() => setConfig(c => ({ ...c, subject, topic: '' }))}
                    className={config.subject === subject ? 'bg-accent text-accent-foreground' : ''}
                    aria-selected={config.subject === subject}
                  >
                    {subjectIcons[subject] || <Zap className="h-4 w-4 mr-2" />} {subject}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
        {/* Step 2: Topic Selection (Command Combobox) */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Topic <span className="text-red-500">*</span></label>
          <Command className="rounded-md border bg-background">
            <CommandInput placeholder={config.subject ? 'Search topic...' : 'Select subject first'} disabled={!config.subject} />
            <CommandList>
              <CommandEmpty>No topics found.</CommandEmpty>
              {config.subject && (
                <CommandGroup heading={config.subject}>
                  {subjects[config.subject as keyof typeof subjects].map(topic => (
                    <CommandItem
                      key={topic}
                      value={topic}
                      onSelect={() => setConfig(c => ({ ...c, topic }))}
                      className={config.topic === topic ? 'bg-accent text-accent-foreground' : ''}
                      aria-selected={config.topic === topic}
                    >
                      <ListChecks className="h-4 w-4 mr-2 text-muted-foreground" /> {topic}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
          </div>
        <Separator />
        {/* Step 3: Advanced Customization */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Question Types</label>
            <div className="flex gap-2 flex-wrap">
              {questionTypes.map(qt => (
                <Toggle
                  key={qt.value}
                  pressed={config.questionTypes.includes(qt.value)}
                  onPressedChange={pressed => setConfig(c => ({
                    ...c,
                    questionTypes: pressed
                      ? [...c.questionTypes, qt.value]
                      : c.questionTypes.filter(q => q !== qt.value)
                  }))}
                  variant={config.questionTypes.includes(qt.value) ? 'default' : 'outline'}
                  size="sm"
                  className="rounded-full"
                  aria-pressed={config.questionTypes.includes(qt.value)}
                >
                  {qt.label}
                </Toggle>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Difficulty</label>
            <div className="flex gap-2">
              {['Easy', 'Medium', 'Hard'].map(level => (
                <Toggle
                  key={level}
                  pressed={config.difficulty === level}
                  onPressedChange={() => setConfig({ ...config, difficulty: level as 'Easy' | 'Medium' | 'Hard' })}
                  variant={config.difficulty === level ? 'default' : 'outline'}
                  size="sm"
                  className={`rounded-full px-4 ${level === 'Easy' ? 'text-green-600' : level === 'Medium' ? 'text-yellow-600' : 'text-red-600'}`}
                  aria-pressed={config.difficulty === level}
                >
                  {level}
                </Toggle>
              ))}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Switch
                checked={config.difficultyMix}
                onCheckedChange={checked => setConfig({ ...config, difficultyMix: checked })}
                id="difficultyMix"
              />
              <label htmlFor="difficultyMix" className="text-xs">Mix difficulties</label>
            </div>
          </div>
        </div>
        <Separator />
        {/* Step 4: Number of Questions & Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Number of Questions</label>
            <div className="flex items-center gap-4">
              <Slider
                min={5}
                max={20}
                value={[config.questionCount]}
                onValueChange={([val]) => setConfig({ ...config, questionCount: val })}
                className="flex-1"
                aria-valuenow={config.questionCount}
                aria-valuemin={5}
                aria-valuemax={20}
              />
              <span className="inline-block bg-primary text-white rounded px-2 py-1 text-xs font-semibold">{config.questionCount}</span>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Time per Question (seconds)</label>
            <Input
              type="number"
              min={30}
              max={300}
              value={config.timePerQuestion}
              onChange={e => setConfig({ ...config, timePerQuestion: parseInt(e.target.value) })}
              className="w-full"
              aria-label="Time per question"
            />
            <label className="text-xs mt-1">Total Time: <b>{Math.ceil((config.timePerQuestion * config.questionCount) / 60)} min</b></label>
          </div>
        </div>
        <Separator />
        {/* Save/Load Configs */}
        <div className="flex gap-2 mt-2">
          <Button variant="outline" size="sm" onClick={() => {
            setFavoriteConfigs(prev => [config, ...prev.filter(c => JSON.stringify(c) !== JSON.stringify(config))]);
            toast({ title: 'Saved!', description: 'Test configuration saved as favorite.' });
          }} title="Save as favorite">
            <Bookmark className="h-4 w-4 mr-1" /> Save Favorite
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setConfig({ subject: '', topic: '', difficulty: 'Medium', questionCount: 10, questionTypes: ['mcq'], timePerQuestion: 90, totalTime: 15, difficultyMix: false })}>
            <RefreshCcw className="h-4 w-4 mr-1" /> Reset
          </Button>
        </div>
        {/* Live Summary Card */}
        <div className="bg-muted/40 rounded-lg p-4 mt-4 animate-fade-in">
          <div className="flex items-center gap-2 mb-1">
            <ListChecks className="h-5 w-5 text-primary" />
            <span className="font-semibold">Current Test Summary</span>
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <span><b>Subject:</b> {config.subject || <span className="text-red-500">(required)</span>}</span>
            <span><b>Topic:</b> {config.topic || <span className="text-red-500">(required)</span>}</span>
            <span><b>Difficulty:</b> {config.difficultyMix ? 'Mix' : config.difficulty}</span>
            <span><b>Types:</b> {config.questionTypes.map(q => questionTypes.find(t => t.value === q)?.label).join(', ')}</span>
            <span><b>Questions:</b> {config.questionCount}</span>
            <span><b>Total Time:</b> {Math.ceil((config.timePerQuestion * config.questionCount) / 60)} min</span>
          </div>
        </div>
        {/* Error Message */}
        {error && (
          <div className="bg-red-100 text-red-700 rounded p-2 flex items-center gap-2 animate-fade-in">
            <X className="h-4 w-4" /> {error}
            <Button variant="ghost" size="sm" onClick={handleGenerateTest} className="ml-auto">Retry</Button>
          </div>
        )}
        {/* Loading Skeleton */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-8 animate-pulse">
            <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
            <span className="text-muted-foreground">Generating test with AI...</span>
          </div>
        )}
        {/* Preview Modal */}
        <Dialog open={showPreviewModal && !!previewQuestions && previewQuestions.length > 0} onOpenChange={setShowPreviewModal}>
          <DialogContent className="max-w-lg animate-fade-in">
            <DialogHeader>
              <DialogTitle>Test Preview</DialogTitle>
            </DialogHeader>
            {previewQuestions && previewQuestions.length > 0 && (
              <div className="space-y-4">
                <div className="bg-muted/40 rounded-lg p-4 mb-2 flex flex-col gap-2">
                  <div className="flex items-center gap-2 mb-1">
                    <ListChecks className="h-5 w-5 text-primary" />
                    <span className="font-semibold">Test Summary</span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <span><b>Subject:</b> {config.subject}</span>
                    <span><b>Topic:</b> {config.topic}</span>
                    <span><b>Difficulty:</b> {config.difficultyMix ? 'Mix' : config.difficulty}</span>
                    <span><b>Types:</b> {config.questionTypes.map(q => questionTypes.find(t => t.value === q)?.label).join(', ')}</span>
                    <span><b>Questions:</b> {config.questionCount}</span>
                    <span><b>Total Time:</b> {Math.ceil((config.timePerQuestion * config.questionCount) / 60)} min</span>
                  </div>
                </div>
                <div className="bg-white dark:bg-muted rounded-lg p-4 shadow mb-2">
                  <div className="font-semibold mb-2 flex items-center gap-2"><Plus className="h-4 w-4 text-primary" /> Preview First Question</div>
                  <div className="text-base mb-2">{previewQuestions[0].text}</div>
                  <ul className="list-disc ml-6 mb-2">
                    {previewQuestions[0].options.map((opt, i) => (
                      <li key={i} className="text-sm">{opt}</li>
                    ))}
                  </ul>
                  {previewQuestions[0].explanation && <div className="text-xs text-muted-foreground">Explanation: {previewQuestions[0].explanation}</div>}
                </div>
              </div>
            )}
            <DialogFooter className="flex gap-2 mt-2">
              <Button className="w-full" onClick={() => { handleStartTest(); setShowPreviewModal(false); }}>
                Start Test
              </Button>
              <Button variant="outline" className="w-full" onClick={() => setShowPreviewModal(false)}>
                Cancel
        </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </div>
  );
};

const TestGeneratorDialog: React.FC<TestGeneratorProps> = ({ onTestGenerated }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [topics, setTopics] = useState<string[]>([]); // fetched from Gemini
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [fetchingTopics, setFetchingTopics] = useState(false);
  const [questionType, setQuestionType] = useState<string[]>(['mcq']);
  const [difficulty, setDifficulty] = useState('Medium');
  const [questionCount, setQuestionCount] = useState(10);
  const [timePerQuestion, setTimePerQuestion] = useState<number | ''>('');
  const [includeExplanations, setIncludeExplanations] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [previewConfig, setPreviewConfig] = useState<any>(null);
  const { toast } = useToast();

  // Hardcoded subjects for now
  const subjectOptions = [
    'DSA', 'DBMS', 'OS', 'CN', 'Aptitude', 'Web Development', 'OOP', 'Maths'
  ];

  // Fetch topics from Gemini API
  // const fetchTopics = useCallback(async (subject: string) => {
  //   setFetchingTopics(true);
  //   setTopics([]);
  //   setSelectedTopics([]);
  //   try {
  //     // Replace with your Gemini API call
  //     const response = await fetch('/api/gemini/topics', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ subject, limit: 100 })
  //     });
  //     const data = await response.json();
  //     setTopics(data.topics || []);
  //   } catch (e) {
  //     setTopics([]);
  //     toast({ title: 'Failed to fetch topics', description: 'Try again or select another subject', variant: 'destructive' });
  //   }
  //   setFetchingTopics(false);
  // }, [toast]);

  // Handle subject change
  const handleSubjectChange = (value: string) => {
    setSubject(value);
    setSelectedTopics([]);
    // fetchTopics(value); // Commented out to avoid 404
  };

  // Generate test handler (now POST to /api/tests/generate with all fields)
  const handleGenerateTest = async () => {
    setError(null);
    setLoading(true);
    const config = {
      title,
      subject,
      topics: selectedTopics,
      questionType,
      difficulty,
      numberOfQuestions: questionCount,
      timePerQuestion,
      includeExplanations
    };
    try {
      const response = await fetch('/api/tests/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      const data = await response.json();
      if (!data.questions) throw new Error('No questions returned');
      onTestGenerated(data);
      setOpen(false);
    } catch (e: any) {
      setError(e.message || 'Failed to generate test');
      toast({ title: 'Test Generation Failed', description: e.message, variant: 'destructive' });
    }
    setLoading(false);
  };

  // Live preview config
  useEffect(() => {
    setPreviewConfig({
      subject,
      topics: selectedTopics,
      questionType,
      difficulty,
      numberOfQuestions: questionCount,
      timePerQuestion,
      includeExplanations
    });
  }, [subject, selectedTopics, questionType, difficulty, questionCount, timePerQuestion, includeExplanations]);

  // Tag suggestions (hardcoded for demo)
  const tagSuggestions = [
    'Trees', 'Graphs', 'DP', 'SQL', 'OS Concepts', 'TCP/IP', 'Sorting', 'Searching'
  ];

  // UI
  return (
    <>
      <Button onClick={() => setOpen(true)} className="mb-4">
        <Zap className="h-5 w-5 mr-2 text-primary" /> Create Your Personalized Test
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl w-full p-0 overflow-hidden">
          <DialogTitle></DialogTitle>
          <div className="p-6 pb-0 max-h-[80vh] overflow-y-auto pb-28">
            <h2 className="text-2xl font-bold mb-6">Create Your Personalized Test</h2>
            {/* Test Title Field */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Test Title <span className="text-red-500">*</span></label>
              <Input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. My DSA Mock Test"
                maxLength={60}
                required
                className="w-full"
              />
            </div>
            {/* Section 1: Subject */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Subject <span className="text-red-500">*</span></label>
              <Command className="rounded-md border bg-background">
                <CommandInput placeholder="Search or select subject..." />
                <CommandList>
                  <CommandEmpty>No subjects found.</CommandEmpty>
                  <CommandGroup heading="Subjects">
                    {subjectOptions.map(subj => (
                      <CommandItem
                        key={subj}
                        value={subj}
                        onSelect={() => handleSubjectChange(subj)}
                        className={subject === subj ? 'bg-accent text-accent-foreground' : ''}
                        aria-selected={subject === subj}
                      >
                        {subj}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </div>
            {/* Section 2: Topics */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Topics <span className="text-red-500">*</span></label>
              {/* If /api/gemini/topics is not implemented, show a placeholder */}
              {fetchingTopics ? (
                <div className="animate-pulse h-12 bg-muted rounded flex items-center justify-center">Loading topics...</div>
              ) : (
                <div className="rounded-md border bg-background p-4 text-muted-foreground text-sm">
                  Dynamic topic search is not available. Please enter topics manually or select from suggestions below.
                </div>
              )}
              {/* Tag suggestions */}
              <div className="flex flex-wrap gap-2 mt-2">
                {tagSuggestions.map(tag => (
                  <Button key={tag} variant="outline" size="sm" className="rounded-full" onClick={() => setSelectedTopics(prev => prev.includes(tag) ? prev : [...prev, tag])}>
                    {tag}
                  </Button>
                ))}
              </div>
            </div>
            {/* Section 3: Test Settings */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Question Type</label>
                <div className="flex gap-2 flex-wrap">
                  {questionTypes.map(qt => (
                    <Toggle
                      key={qt.value}
                      pressed={questionType.includes(qt.value)}
                      onPressedChange={pressed => setQuestionType(prev => pressed ? [...prev, qt.value] : prev.filter(q => q !== qt.value))}
                      variant={questionType.includes(qt.value) ? 'default' : 'outline'}
                      size="sm"
                      className="rounded-full"
                      aria-pressed={questionType.includes(qt.value)}
                    >
                      {qt.label}
                    </Toggle>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Difficulty</label>
                <div className="flex gap-2">
                  {difficulties.map(level => (
                    <Toggle
                      key={level}
                      pressed={difficulty === level}
                      onPressedChange={() => setDifficulty(level)}
                      variant={difficulty === level ? 'default' : 'outline'}
                      size="sm"
                      className="rounded-full px-4"
                      aria-pressed={difficulty === level}
                    >
                      {level}
                    </Toggle>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Number of Questions</label>
                <div className="flex items-center gap-4">
                  <Slider
                    min={5}
                    max={50}
                    value={[questionCount]}
                    onValueChange={([val]) => setQuestionCount(val)}
                    className="flex-1"
                    aria-valuenow={questionCount}
                    aria-valuemin={5}
                    aria-valuemax={50}
                  />
                  <Input
                    type="number"
                    min={5}
                    max={50}
                    value={questionCount}
                    onChange={e => setQuestionCount(Number(e.target.value))}
                    className="w-20"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Time per Question (seconds) <span className="text-xs text-muted-foreground">(optional)</span></label>
                <Input
                  type="number"
                  min={10}
                  max={600}
                  value={timePerQuestion}
                  onChange={e => setTimePerQuestion(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full"
                  aria-label="Time per question"
                />
              </div>
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  checked={includeExplanations}
                  onChange={e => setIncludeExplanations(e.target.checked)}
                  id="includeExplanations"
                />
                <label htmlFor="includeExplanations" className="text-xs">Include Explanations</label>
              </div>
            </div>
            {/* Section 4: Live Preview */}
            <div className="bg-muted/40 rounded-lg p-4 mb-6 animate-fade-in">
              <div className="flex items-center gap-2 mb-1">
                <ListChecks className="h-5 w-5 text-primary" />
                <span className="font-semibold">Test Preview Summary</span>
                <Button variant="ghost" size="sm" className="ml-auto" onClick={() => setShowPreview(true)}>Regenerate Preview</Button>
              </div>
              <div className="flex flex-wrap gap-4 text-sm">
                <span><b>Subject:</b> {previewConfig?.subject || <span className="text-red-500">(required)</span>}</span>
                <span><b>Topics:</b> {previewConfig?.topics?.join(', ') || <span className="text-red-500">(required)</span>}</span>
                <span><b>Difficulty:</b> {previewConfig?.difficulty}</span>
                <span><b>Types:</b> {previewConfig?.questionType?.map((q: string) => questionTypes.find(t => t.value === q)?.label).join(', ')}</span>
                <span><b>Questions:</b> {previewConfig?.numberOfQuestions}</span>
                <span><b>Total Time:</b> {previewConfig?.timePerQuestion && previewConfig?.numberOfQuestions ? Math.ceil((Number(previewConfig.timePerQuestion) * previewConfig.numberOfQuestions) / 60) + ' min' : 'N/A'}</span>
                <span><b>Explanations:</b> {previewConfig?.includeExplanations ? 'Yes' : 'No'}</span>
              </div>
            </div>
            {/* Error Message */}
            {error && (
              <div className="bg-red-100 text-red-700 rounded p-2 flex items-center gap-2 animate-fade-in">
                <X className="h-4 w-4" /> {error}
              </div>
            )}
            {/* Loading Skeleton */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-8 animate-pulse">
                <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
                <span className="text-muted-foreground">Generating test with AI...</span>
              </div>
            )}
          </div>
          {/* Sticky Generate Button at the bottom of the dialog */}
          <div className="fixed left-1/2 -translate-x-1/2 bottom-8 z-50 max-w-2xl w-full px-6">
            <Button
              className="w-full text-lg py-2 px-8 shadow-2xl font-bold text-white border-0 bg-gradient-to-r from-purple-700 via-fuchsia-700 to-indigo-900 hover:brightness-110 transition"
              onClick={handleGenerateTest}
              disabled={!title.trim() || !subject || selectedTopics.length === 0 || questionType.length === 0 || !difficulty || !questionCount || loading}
              aria-disabled={!title.trim() || !subject || selectedTopics.length === 0 || questionType.length === 0 || !difficulty || !questionCount || loading}
            >
              Generate My Test 🚀
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TestGeneratorDialog; 