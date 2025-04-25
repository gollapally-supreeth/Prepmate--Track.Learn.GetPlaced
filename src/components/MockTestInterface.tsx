import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Clock, CheckCircle, XCircle, ArrowLeft, ArrowRight, Bookmark } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

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
  questions: Question[];
  duration: number;
}

interface MockTestInterfaceProps {
  test: MockTest;
  onComplete: (score: number) => void;
  onExit: () => void;
  markedQuestions: Set<string>;
  onMarkQuestion: (questionId: string) => void;
}

const MockTestInterface: React.FC<MockTestInterfaceProps> = ({ 
  test, 
  onComplete, 
  onExit,
  markedQuestions,
  onMarkQuestion
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(test.duration * 60);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Initialize selected answers array
    setSelectedAnswers(new Array(test.questions.length).fill(-1));
  }, [test.questions.length]);

  useEffect(() => {
    // Timer logic
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      handleSubmit();
    }
  }, [timeLeft]);

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < test.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    const score = calculateScore();
    onComplete(score);
    setShowSubmitDialog(false);
  };

  const calculateScore = () => {
    let correctAnswers = 0;
    selectedAnswers.forEach((answer, index) => {
      if (answer === test.questions[index].correctAnswer) {
        correctAnswers++;
      }
    });
    return (correctAnswers / test.questions.length) * 100;
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Defensive: check test and questions
  if (!test || !Array.isArray(test.questions) || test.questions.length === 0) {
    return (
      <div className="p-8 text-center text-destructive">
        <h2 className="text-xl font-bold mb-2">Test Data Error</h2>
        <p>Sorry, this test has no questions or is malformed. Please try generating a new test or contact support.</p>
        <Button className="mt-4" onClick={onExit}>Exit</Button>
      </div>
    );
  }
  const currentQuestion = test.questions[currentQuestionIndex];
  if (!currentQuestion || !Array.isArray(currentQuestion.options)) {
    return (
      <div className="p-8 text-center text-destructive">
        <h2 className="text-xl font-bold mb-2">Question Data Error</h2>
        <p>Sorry, this question is missing or malformed. Please try another test.</p>
        <Button className="mt-4" onClick={onExit}>Exit</Button>
      </div>
    );
  }
  const progress = ((currentQuestionIndex + 1) / test.questions.length) * 100;

  return (
    <div className="space-y-6">
      {/* Test Header */}
      <Card className="card-enhanced">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold">{test.title}</CardTitle>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{formatTime(timeLeft)}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span>Question {currentQuestionIndex + 1} of {test.questions.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
        </CardContent>
      </Card>

      {/* Question Card */}
      <Card className="card-enhanced">
        <CardContent className="p-6 space-y-6">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Question {currentQuestionIndex + 1}</h3>
              <p className="text-muted-foreground">{currentQuestion.text}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onMarkQuestion(currentQuestion.id)}
              className={markedQuestions.has(currentQuestion.id) ? "text-primary" : ""}
            >
              <Bookmark className="h-5 w-5" />
            </Button>
          </div>

          <RadioGroup
            value={selectedAnswers[currentQuestionIndex] !== undefined ? selectedAnswers[currentQuestionIndex].toString() : ''}
            onValueChange={(value) => handleAnswerSelect(parseInt(value))}
            className="space-y-3"
          >
            {currentQuestion.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="button-animated"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        <div className="flex gap-2">
          {currentQuestionIndex < test.questions.length - 1 ? (
            <Button
              onClick={handleNext}
              className="button-animated"
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={() => setShowSubmitDialog(true)}
              className="button-animated bg-primary hover:bg-primary/90"
            >
              Submit Test
            </Button>
          )}
        </div>
      </div>

      {/* Submit Dialog */}
      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Test</DialogTitle>
            <DialogDescription>
              Are you sure you want to submit your test? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowSubmitDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              Submit
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MockTestInterface; 