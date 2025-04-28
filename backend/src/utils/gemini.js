const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const geminiModel = genAI.getGenerativeModel({ model: 'gemini-1.5-pro-latest' });

async function callGemini(prompt) {
  try {
    const result = await geminiModel.generateContent(prompt);
    const text = result.response.text();
    console.log('Gemini raw response:', text); // Debug log
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      const match = text.match(/```json\s*([\s\S]*?)```/i) || text.match(/\{[\s\S]*\}/);
      if (match) {
        try {
          parsed = JSON.parse(match[1] || match[0]);
        } catch (e2) {
          throw new Error('Gemini returned invalid JSON: ' + text.slice(0, 200));
        }
      } else {
        throw new Error('No JSON found in Gemini response: ' + text.slice(0, 200));
      }
    }
    if (!parsed.questions || !Array.isArray(parsed.questions)) throw new Error('No questions in Gemini response');
    return parsed.questions;
  } catch (err) {
    console.error('Gemini SDK error:', err);
    throw new Error('Gemini SDK error: ' + (err.message || err));
  }
}

module.exports = { callGemini }; 