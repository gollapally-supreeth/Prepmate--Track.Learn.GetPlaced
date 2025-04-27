import express, { Request, Response } from 'express';
import cors from 'cors';
import chatRoutes from './routes/chat.routes';
import { config } from './config';
import path from 'path';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Remove or relax CSP for development
app.use((req, res, next) => {
  res.removeHeader('Content-Security-Policy');
  // Or, to set a permissive policy for dev:
  // res.setHeader('Content-Security-Policy', "default-src *; font-src * data:; style-src * 'unsafe-inline'; script-src * 'unsafe-inline' 'unsafe-eval';");
  next();
});

// Serve static assets (fonts, etc.) if needed
app.use('/assets', express.static(path.join(__dirname, '../public/assets')));

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', env: config.NODE_ENV });
});

// Test route to verify server is running
app.get('/test', (req: Request, res: Response) => res.json({ ok: true }));

// Chat API routes
app.use('/api/ai', chatRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err: any, req: Request, res: Response, next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

export default app; 