import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TestConfig {
  subject: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  questionCount: number;
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

const TestGenerator: React.FC<TestGeneratorProps> = ({ onTestGenerated }) => {
  const [config, setConfig] = useState<TestConfig>({
    subject: '',
    topic: '',
    difficulty: 'Medium',
    questionCount: 10
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerateTest = async () => {
    if (!config.subject || !config.topic) {
      toast({
        title: "Missing Information",
        description: "Please select both subject and topic",
        variant: "destructive"
      });
      return;
    }
    setLoading(true);
    let questions: Question[] | null = null;
    // Try AI first
    questions = await generateTestWithAI(config, toast);
    // Fallback to local sample questions
    if (!questions || questions.length === 0) {
      const topicQuestions = sampleQuestions[config.subject]?.[config.topic] || [];
      if (topicQuestions.length === 0) {
        toast({
          title: "No Questions Available",
          description: "Sample questions for this topic are not available yet.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }
      questions = topicQuestions.slice(0, Math.min(config.questionCount, topicQuestions.length)).map((q, idx) => ({ ...q, id: `q${idx + 1}` }));
    }
    onTestGenerated(questions);
    toast({
      title: "Test Generated",
      description: "Your test is ready to begin!",
    });
    setLoading(false);
  };

  return (
    <Card className="card-enhanced">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          Generate New Test
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Subject</label>
            <Select
              value={config.subject}
              onValueChange={(value) => setConfig({ ...config, subject: value, topic: '' })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(subjects).map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Topic</label>
            <Select
              value={config.topic}
              onValueChange={(value) => setConfig({ ...config, topic: value })}
              disabled={!config.subject}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select topic" />
              </SelectTrigger>
              <SelectContent>
                {config.subject && subjects[config.subject as keyof typeof subjects].map((topic) => (
                  <SelectItem key={topic} value={topic}>
                    {topic}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Difficulty</label>
            <Select
              value={config.difficulty}
              onValueChange={(value) => setConfig({ ...config, difficulty: value as 'Easy' | 'Medium' | 'Hard' })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Easy">Easy</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Number of Questions</label>
            <Input
              type="number"
              min="5"
              max="20"
              value={config.questionCount}
              onChange={(e) => setConfig({ ...config, questionCount: parseInt(e.target.value) })}
            />
          </div>
        </div>

        <Button
          className="w-full button-animated"
          onClick={handleGenerateTest}
          disabled={loading || !config.subject || !config.topic}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Test...
            </>
          ) : (
            'Generate Test'
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default TestGenerator; 