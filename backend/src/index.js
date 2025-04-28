require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const sequelize = require('../db');
const testRoutes = require('./routes/test.routes');

const app = express();
const prisma = new PrismaClient();

app.use(cors({
  origin: 'http://localhost:8080', // Change to your frontend port if different
  credentials: true
}));
app.use(express.json());

// Session middleware (required for Passport)
app.use(session({
  secret: 'your-session-secret', // Change this to a strong secret in production!
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// Passport user serialization
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

// Google OAuth strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
  // Here you would find or create the user in your DB
  // For now, just return the Google profile
  return done(null, profile);
}));

// Routes
app.get('/', (req, res) => {
  res.send('Backend server is running!');
});

// Start Google OAuth flow
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google OAuth callback
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  async (req, res) => {
    // Extract info from Google profile
    const google_id = req.user.id;
    const name = req.user.displayName;
    const email = req.user.emails && req.user.emails[0]?.value;
    const avatar_url = req.user.photos && req.user.photos[0]?.value;

    if (!email) {
      return res.redirect('http://localhost:8080/login?error=NoEmail');
    }

    // Upsert user (create if not exists, update if exists)
    let user = await prisma.user.upsert({
      where: { email },
      update: { name, google_id, avatar_url },
      create: { email, name, google_id, avatar_url },
    });

    // Ensure profile exists for this user
    const existingProfile = await prisma.profile.findUnique({ where: { userId: user.id } });
    if (!existingProfile) {
      await prisma.profile.create({
        data: {
          userId: user.id,
          fullName: '',
          username: '',
          contact: '',
          dob: null,
          status: '',
          avatarUrl: '',
          bio: '',
          linkedin: '',
          github: '',
          twitter: '',
          website: '',
          educations: [],
          skills: [],
          projects: [],
          experience: [],
          badges: [],
          events: [],
          learningPath: [],
          progress: [],
          settings: {},
          activityFeed: [],
          quickActions: []
        }
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Redirect to frontend with token
    res.redirect(`http://localhost:8080/login?token=${token}`);
  }
);

// Example function to upsert a user
async function findOrCreateUser({ email, name, google_id, avatar_url }) {
  const user = await prisma.user.upsert({
    where: { email },
    update: { name, google_id, avatar_url },
    create: { email, name, google_id, avatar_url },
  });
  return user;
}

// Registration route for manual signup
app.post('/auth/register', async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'All fields required' });
  }
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already in use' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, name, password: hashedPassword }
    });
    // Automatically create a blank profile for the new user
    await prisma.profile.create({
      data: {
        userId: user.id,
        fullName: '',
        username: '',
        contact: '',
        dob: null,
        status: '',
        avatarUrl: '',
        bio: '',
        linkedin: '',
        github: '',
        twitter: '',
        website: '',
        educations: [],
        skills: [],
        projects: [],
        experience: [],
        badges: [],
        events: [],
        learningPath: [],
        progress: [],
        settings: {},
        activityFeed: [],
        quickActions: []
      }
    });
    // Optionally, generate JWT and return it
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.status(201).json({ message: 'User created', token });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) {
      // User does not exist or has no password (e.g., Google user)
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    // Generate JWT or session here
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.json({ message: 'Login successful', token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.get('/profile', authenticateToken, async (req, res) => {
  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: req.user.id }
    });
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/profile', authenticateToken, async (req, res) => {
  try {
    const allowedFields = [
      'fullName', 'username', 'contact', 'dob', 'status', 'avatarUrl', 'bio',
      'linkedin', 'github', 'twitter', 'website',
      'educations', 'skills', 'projects', 'experience', 'badges', 'events',
      'learningPath', 'progress', 'settings', 'activityFeed', 'quickActions'
    ];
    const data = {};
    for (const key of allowedFields) {
      if (key === 'dob') {
        if (
          req.body.dob &&
          typeof req.body.dob === 'string' &&
          req.body.dob.trim() !== '' &&
          !isNaN(Date.parse(req.body.dob))
        ) {
          data.dob = new Date(req.body.dob).toISOString();
        }
      } else if (req.body[key] !== undefined && req.body[key] !== null) {
        data[key] = req.body[key];
      }
    }
    // Ensure all JSON fields are arrays/objects, never null/undefined
    const jsonFields = [
      'educations', 'skills', 'projects', 'experience', 'badges', 'events',
      'learningPath', 'progress', 'activityFeed', 'quickActions'
    ];
    for (const key of jsonFields) {
      if (data[key] === undefined || data[key] === null) {
        data[key] = [];
      }
    }
    if (data['settings'] === undefined || data['settings'] === null) {
      data['settings'] = {};
    }
    const updated = await prisma.profile.update({
      where: { userId: req.user.id },
      data
    });
    res.json(updated);
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/profile', authenticateToken, async (req, res) => {
  try {
    const allowedFields = [
      'fullName', 'username', 'contact', 'dob', 'status', 'avatarUrl', 'bio',
      'linkedin', 'github', 'twitter', 'website',
      'educations', 'skills', 'projects', 'experience', 'badges', 'events',
      'learningPath', 'progress', 'settings', 'activityFeed', 'quickActions'
    ];
    const data = { userId: req.user.id };
    for (const key of allowedFields) {
      if (key === 'dob') {
        if (
          req.body.dob &&
          typeof req.body.dob === 'string' &&
          req.body.dob.trim() !== '' &&
          !isNaN(Date.parse(req.body.dob))
        ) {
          data.dob = new Date(req.body.dob).toISOString();
        }
      } else if (req.body[key] !== undefined && req.body[key] !== null) {
        data[key] = req.body[key];
      }
    }
    // Ensure all JSON fields are arrays/objects, never null/undefined
    const jsonFields = [
      'educations', 'skills', 'projects', 'experience', 'badges', 'events',
      'learningPath', 'progress', 'activityFeed', 'quickActions'
    ];
    for (const key of jsonFields) {
      if (data[key] === undefined || data[key] === null) {
        data[key] = [];
      }
    }
    if (data['settings'] === undefined || data['settings'] === null) {
      data['settings'] = {};
    }
    const profile = await prisma.profile.create({
      data
    });
    res.status(201).json(profile);
  } catch (err) {
    console.error('Profile create error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Gemini AI integration
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const geminiModel = genAI.getGenerativeModel({ model: 'gemini-1.5-pro-latest' });

async function generateGeminiResponse(history, prompt) {
  try {
    const chat = geminiModel.startChat({ history });
    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini error:', error);
    throw new Error('Failed to generate AI response');
  }
}

// AI Assistant API routes
const aiRouter = express.Router();

// All routes require authentication
aiRouter.use(authenticateToken);

// Get chat sessions for a user
aiRouter.get('/sessions', async (req, res) => {
  try {
    const userId = req.user.id;
    const sessions = await prisma.chatSession.findMany({
      where: { userId },
      include: {
        messages: { orderBy: { timestamp: 'asc' } }
      },
      orderBy: { updatedAt: 'desc' }
    });
    res.json(sessions);
  } catch (error) {
    console.error('Error in getSessions:', error);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

// Send a message and get AI response
aiRouter.post('/message', async (req, res) => {
  try {
    const { content, sessionId } = req.body;
    const userId = req.user.id;
    let chatSession = sessionId
      ? await prisma.chatSession.findUnique({
          where: { id: sessionId },
          include: { messages: true }
        })
      : await prisma.chatSession.create({
          data: {
            userId,
            title: content.slice(0, 50) + '...'
          }
        });
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
    const history = messages.map(msg => ({
      role: msg.sender === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));
    // Generate AI response
    const aiResponse = await generateGeminiResponse(history, content);
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
    res.json({ userMessage, assistantMessage, sessionId: chatSession.id });
  } catch (error) {
    console.error('Error in sendMessage:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

// Delete a chat session
aiRouter.delete('/sessions/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.id;
    const session = await prisma.chatSession.findFirst({ where: { id: sessionId, userId } });
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    await prisma.chatSession.delete({ where: { id: sessionId } });
    res.json({ message: 'Session deleted successfully' });
  } catch (error) {
    console.error('Error in deleteSession:', error);
    res.status(500).json({ error: 'Failed to delete session' });
  }
});

// Update message feedback
aiRouter.patch('/messages/:messageId/feedback', async (req, res) => {
  try {
    const { messageId } = req.params;
    const { feedback } = req.body;
    const userId = req.user.id;
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
});

// Rename a chat session
aiRouter.patch('/sessions/:sessionId/title', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { title } = req.body;
    const userId = req.user.id;
    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ error: 'Title is required' });
    }
    const session = await prisma.chatSession.findFirst({ where: { id: sessionId, userId } });
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    const updated = await prisma.chatSession.update({
      where: { id: sessionId },
      data: { title: title.trim() }
    });
    res.json(updated);
  } catch (error) {
    console.error('Error in renameSession:', error);
    res.status(500).json({ error: 'Failed to rename session' });
  }
});

app.use('/api/ai', aiRouter);

app.use('/api/tests', testRoutes);

const PORT = process.env.PORT || 5000;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});