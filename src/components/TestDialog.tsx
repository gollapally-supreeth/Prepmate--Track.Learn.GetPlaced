import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function TestDialog({ open, test, onClose }) {
  if (!test) return null;
  if (!Array.isArray(test.questions) || test.questions.length === 0) {
    return (
      <Dialog open={open} onOpenChange={() => {}}>
        <DialogContent>
          <DialogTitle>Test Unavailable</DialogTitle>
          <div className="p-4">No questions found for this test.</div>
          <DialogFooter>
            <Button onClick={onClose}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState(Array(test.questions.length).fill(null));
  const [timeLeft, setTimeLeft] = useState(test.timePerQuestion ? test.timePerQuestion * test.questions.length : 0);
  const [submitted, setSubmitted] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | undefined>();

  // Reset state when test changes
  useEffect(() => {
    if (test) {
      setCurrent(0);
      setAnswers(Array(test.questions.length).fill(null));
      setTimeLeft(test.timePerQuestion ? test.timePerQuestion * test.questions.length : 0);
      setSubmitted(false);
    }
  }, [test]);

  // Timer logic
  useEffect(() => {
    if (!open || submitted) return;
    if (timeLeft <= 0 && test) {
      handleSubmit();
      return;
    }
    if (timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerRef.current);
    }
  }, [open, timeLeft, submitted, test]);

  function handleAnswer(idx: number) {
    setAnswers(a => {
      const copy = [...a];
      copy[current] = idx;
      return copy;
    });
  }

  function handleSubmit() {
    setSubmitted(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    // Optionally, send results to backend here
  }

  function handleQuit() {
    if (window.confirm('Are you sure you want to quit? Your progress will be lost.')) {
      setSubmitted(true);
      onClose();
    }
  }

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-2xl w-full">
        <DialogTitle>
          {test.title || `${test.subject} Test`}
          <span className="float-right text-sm text-muted-foreground">
            {timeLeft > 0 && !submitted ? `Time left: ${Math.floor(timeLeft/60)}:${(timeLeft%60).toString().padStart(2, '0')}` : ''}
          </span>
        </DialogTitle>
        {!submitted ? (
          <>
            <div className="mb-4">
              <div className="font-semibold mb-2">Q{current + 1}: {test.questions[current].question}</div>
              <ul>
                {test.questions[current].options.map((opt: string, idx: number) => (
                  <li key={idx}>
                    <Button
                      variant={answers[current] === idx ? 'default' : 'outline'}
                      onClick={() => handleAnswer(idx)}
                      className="my-1 w-full text-left"
                    >
                      {opt}
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex justify-between">
              <Button onClick={() => setCurrent(c => Math.max(0, c - 1))} disabled={current === 0}>Previous</Button>
              <Button onClick={handleQuit} variant="destructive">Quit</Button>
              <Button onClick={() => setCurrent(c => Math.min(test.questions.length - 1, c + 1))} disabled={current === test.questions.length - 1}>Next</Button>
            </div>
            <DialogFooter>
              <Button onClick={handleSubmit} className="w-full mt-4" disabled={answers.includes(null)}>Submit Test</Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <div className="mb-4">
              <h3 className="font-bold mb-2">Test Complete!</h3>
              <div>
                {/* Show score and explanations */}
                {test.questions.map((q: any, idx: number) => (
                  <div key={idx} className="mb-2">
                    <div>
                      <b>Q{idx + 1}:</b> {q.question}
                    </div>
                    <div>
                      <span>Your answer: {answers[idx] !== null ? q.options[answers[idx]] : 'Not answered'}</span>
                      <span className="ml-2">
                        {answers[idx] === q.answer ? '✅' : '❌'}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">Explanation: {q.explanation}</div>
                  </div>
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button onClick={onClose} className="w-full">Close</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
} 