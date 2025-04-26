require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

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
  passport.authenticate('google', { failureRedirect: '/' }),
  async (req, res) => {
    console.log('Callback hit!');
    console.log('Google profile:', req.user);
    const googleProfile = req.user;

    console.log('Google profile:', googleProfile);

    // Extract user info from Google profile
    const email = googleProfile.emails[0].value;
    const name = googleProfile.displayName;
    const google_id = googleProfile.id;
    const avatar_url = googleProfile.photos && googleProfile.photos[0] ? googleProfile.photos[0].value : null;

    console.log('Upserting user:', { email, name, google_id, avatar_url });

    // Save or update user in Supabase (PostgreSQL)
    const dbUser = await findOrCreateUser({ email, name, google_id, avatar_url });

    console.log('User in DB:', dbUser);

    // Generate JWT with your own user id
    const token = jwt.sign(
      { id: dbUser.id, email: dbUser.email, name: dbUser.name },
      'your_jwt_secret', // Use a strong secret in production!
      { expiresIn: '1h' }
    );

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
    // Optionally, generate JWT and return it
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      'your_jwt_secret',
      { expiresIn: '1h' }
    );
    res.status(201).json({ message: 'User created', token });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});