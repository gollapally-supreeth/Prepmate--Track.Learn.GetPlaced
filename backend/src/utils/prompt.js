function generateTestPrompt({ subject, topics, subtopics, questionType, difficulty, numberOfQuestions, timePerQuestion, includeExplanations }) {
  return `
You are an expert test generator. Generate a mock test in strict JSON format.

Requirements:
- Subject: ${subject}
- Topics: ${topics.join(', ')}
- Subtopics: ${subtopics && subtopics.length ? subtopics.join(', ') : 'N/A'}
- Question Type: ${questionType}
- Difficulty: ${difficulty}
- Number of questions: ${numberOfQuestions}
- Time per question: ${timePerQuestion || 'N/A'} seconds
- Include explanations: ${includeExplanations ? 'Yes' : 'No'}

Return ONLY valid JSON in this format (no explanation, no markdown):
{
  "questions": [
    {
      "question": "Question text",
      "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
      "answer": 0,
      "explanation": "Brief explanation"
    }
  ]
}
If any field is missing, make a best guess. Questions should be original, clear, and relevant to the selected topics and subtopics.
`.trim();
}
module.exports = { generateTestPrompt }; 