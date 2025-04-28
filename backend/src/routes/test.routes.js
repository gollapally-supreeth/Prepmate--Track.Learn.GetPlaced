const express = require('express');
const router = express.Router();
const { generateTestPrompt } = require('../utils/prompt');
const { callGemini } = require('../utils/gemini');
const Test = require('../models/Test');

router.post('/generate', async (req, res) => {
  console.log('Received POST /api/tests/generate', req.body); // Log incoming request
  try {
    let { subject, topics, subtopics, questionType, difficulty, numberOfQuestions, timePerQuestion, includeExplanations, userId } = req.body;

    // Fix: Convert questionType array to string if needed
    if (Array.isArray(questionType)) {
      questionType = questionType.join(',');
    }
    // Fix: Convert topics/subtopics to arrays of strings (if not already)
    if (typeof topics === 'string') topics = [topics];
    if (subtopics && typeof subtopics === 'string') subtopics = [subtopics];
    // Fix: Convert timePerQuestion to integer or null
    if (timePerQuestion === '' || timePerQuestion === undefined) timePerQuestion = null;

    // 1. Build prompt
    const prompt = generateTestPrompt({
      subject, topics, subtopics, questionType, difficulty, numberOfQuestions, timePerQuestion, includeExplanations
    });

    // 2. Call Gemini
    const questions = await callGemini(prompt);

    // 3. Save to DB
    const test = await Test.create({
      subject, topics, subtopics, questionType, difficulty, numberOfQuestions, timePerQuestion, includeExplanations, questions, userId
    });

    res.json(test);
  } catch (err) {
    console.error('Test generation error:', err);
    res.status(500).json({ error: err.message || 'Test generation failed' });
  }
});

router.get('/', async (req, res) => {
  try {
    const tests = await Test.findAll({ order: [['createdAt', 'DESC']] });
    res.json(tests);
  } catch (err) {
    console.error('Fetch tests error:', err);
    res.status(500).json({ error: err.message || 'Failed to fetch tests' });
  }
});

// GET /api/tests/:id - fetch a single test by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const test = await Test.findByPk(id);
    if (!test) {
      return res.status(404).json({ error: 'Test not found' });
    }
    res.json(test);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to fetch test' });
  }
});

// DELETE /api/tests/:id - delete a test by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Test.destroy({ where: { id } });
    if (!deleted) {
      return res.status(404).json({ error: 'Test not found or already deleted' });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to delete test' });
  }
});

module.exports = router; 