require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
  try {
    const models = await genAI.listModels();
    for (const model of models) {
      console.log(model.name, model.supportedGenerationMethods);
    }
  } catch (err) {
    console.error('Error listing models:', err);
  }
}

listModels(); 