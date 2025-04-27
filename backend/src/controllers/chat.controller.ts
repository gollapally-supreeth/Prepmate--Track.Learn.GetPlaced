import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { geminiService } from '../services/gemini.service';

const prisma = new PrismaClient();

export const chatController = {
  // Send a message and get AI response
  async sendMessage(req: Request, res: Response) {
    try {
      const { content, sessionId } = req.body;
      const userId = req.user?.id; // Assuming you have auth middleware that adds user to req

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Get or create chat session
      let chatSession: any = sessionId
        ? await prisma.chatSession.findUnique({ 
            where: { id: sessionId },
            include: { messages: true }
          })
        : await prisma.chatSession.create({
            data: {
              userId,
              title: content.slice(0, 50) + '...' // Use first 50 chars as title
            }
          });

      // If we just created the session, fetch it again with messages
      if (!sessionId && chatSession) {
        chatSession = await prisma.chatSession.findUnique({
          where: { id: chatSession.id },
          include: { messages: true }
        });
      }

      if (!chatSession) {
        return res.status(404).json({ error: 'Chat session not found' });
      }

      // Save user message
      const userMessage = await prisma.message.create({
        data: {
          chatSessionId: chatSession.id,
          content,
          sender: 'user'
        }
      });

      // Get chat history for context
      const messages = chatSession.messages || [];
      const history = messages.map((msg: any) => ({
        role: msg.sender,
        content: msg.content
      }));

      // Generate AI response
      const aiResponse = await geminiService.generateChatResponse(history, content);

      // Save AI response
      const assistantMessage = await prisma.message.create({
        data: {
          chatSessionId: chatSession.id,
          content: aiResponse,
          sender: 'assistant'
        }
      });

      // Update session
      await prisma.chatSession.update({
        where: { id: chatSession.id },
        data: { updatedAt: new Date() }
      });

      res.json({
        userMessage,
        assistantMessage,
        sessionId: chatSession.id
      });
    } catch (error) {
      console.error('Error in sendMessage:', error);
      res.status(500).json({ error: 'Failed to process message' });
    }
  },

  // Get chat sessions for a user
  async getSessions(req: Request, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const sessions = await prisma.chatSession.findMany({
        where: { userId },
        include: {
          messages: {
            orderBy: { timestamp: 'asc' }
          }
        },
        orderBy: { updatedAt: 'desc' }
      });

      res.json(sessions);
    } catch (error) {
      console.error('Error in getSessions:', error);
      res.status(500).json({ error: 'Failed to fetch sessions' });
    }
  },

  // Delete a chat session
  async deleteSession(req: Request, res: Response) {
    try {
      const { sessionId } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Verify ownership
      const session = await prisma.chatSession.findFirst({
        where: { id: sessionId, userId }
      });

      if (!session) {
        return res.status(404).json({ error: 'Session not found' });
      }

      // Delete session and its messages
      await prisma.chatSession.delete({
        where: { id: sessionId }
      });

      res.json({ message: 'Session deleted successfully' });
    } catch (error) {
      console.error('Error in deleteSession:', error);
      res.status(500).json({ error: 'Failed to delete session' });
    }
  },

  // Update message feedback
  async updateFeedback(req: Request, res: Response) {
    try {
      const { messageId } = req.params;
      const { feedback } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const message = await prisma.message.findUnique({
        where: { id: messageId },
        include: { chatSession: true }
      });

      if (!message || message.chatSession.userId !== userId) {
        return res.status(404).json({ error: 'Message not found' });
      }

      const updatedMessage = await prisma.message.update({
        where: { id: messageId },
        data: { feedback }
      });

      res.json(updatedMessage);
    } catch (error) {
      console.error('Error in updateFeedback:', error);
      res.status(500).json({ error: 'Failed to update feedback' });
    }
  }
}; 