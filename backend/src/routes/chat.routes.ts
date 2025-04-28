console.log('Chat routes loaded');
import { Router, RequestHandler, Request, Response } from 'express';
import { chatController } from '../controllers/chat.controller';
import { authenticateToken } from '../middleware/auth';
import { rateLimit } from 'express-rate-limit';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

// Test route to verify chatRoutes is loaded
router.get('/test', (req: Request, res: Response) => res.json({ ai: true }));

// Rate limiting for AI endpoints
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50 // limit each IP to 50 requests per windowMs
});

// Apply authentication middleware to all routes
router.use(authenticateToken as RequestHandler);

// Helper to get type from request (default to 'interview')
function getSessionType(req: Request) {
  return req.body.type || req.query.type || 'interview';
}

// Apply rate limiting to message endpoint
router.post('/message', aiLimiter, (req, res, next) => {
  req.body.type = getSessionType(req);
  next();
}, asyncHandler(chatController.sendMessage));

// Chat session management
router.get('/sessions', (req, res, next) => {
  req.query.type = getSessionType(req);
  next();
}, asyncHandler(chatController.getSessions));
router.delete('/sessions/:sessionId', (req, res, next) => {
  req.query.type = getSessionType(req);
  next();
}, asyncHandler(chatController.deleteSession));

// Feedback
router.patch('/messages/:messageId/feedback', asyncHandler(chatController.updateFeedback));

export default router; 