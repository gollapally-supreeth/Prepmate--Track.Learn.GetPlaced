import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

interface Config {
  PORT: number;
  GEMINI_API_KEY: string;
  DATABASE_URL: string;
  NODE_ENV: string;
  JWT_SECRET: string;
}

export const config: Config = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  DATABASE_URL: process.env.DATABASE_URL || '',
  NODE_ENV: process.env.NODE_ENV || 'development',
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key'
}; 