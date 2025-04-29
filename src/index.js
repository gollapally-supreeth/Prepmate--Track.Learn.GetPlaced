import express from 'express';
const app = express();

// ... existing code ...
// AI Assistant routes
app.use('/api/ai', authenticateToken, aiRouter);

// Update session title
app.patch('/api/ai/session/:sessionId', authenticateToken, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { title } = req.body;
    const userId = req.user.id;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    // Update session title in database
    const updatedSession = await prisma.chatSession.update({
      where: {
        id: sessionId,
        userId: userId // Ensure user owns this session
      },
      data: {
        title
      }
    });

    res.json(updatedSession);
  } catch (error) {
    console.error('Error updating session title:', error);
    res.status(500).json({ error: 'Failed to update session title' });
  }
});

// ... existing code ...

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});