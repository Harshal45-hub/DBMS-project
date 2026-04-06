const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./middleware/logger');
const { authenticate } = require('./middleware/auth');
const ollamaService = require('./services/ollamaService');

// Import routes
const clothingRoutes = require('./routes/clothing');
const outfitRoutes = require('./routes/outfits');
const shareRoutes = require('./routes/share');
const socialRoutes = require('./routes/social');
const couplesRoutes = require('./routes/couples');
const analyticsRoutes = require('./routes/analytics');
const plannerRoutes = require('./routes/planner');
const aiRoutes = require('./routes/ai');
const notificationRoutes = require('./routes/notifications');
const wishlistRoutes = require('./routes/wishlist');
const challengeRoutes = require('./routes/challenges');
const stealRoutes = require('./routes/steal');
const reelRoutes = require('./routes/reel');
const giftRoutes = require('./routes/gift');
const uploadRoutes = require('./routes/upload');
const path = require('path');


const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(logger);
app.use(authenticate);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);

// Routes
app.use('/api/clothing', clothingRoutes);
app.use('/api/outfits', outfitRoutes);
app.use('/api/share', shareRoutes);
app.use('/api/social', socialRoutes);
app.use('/api/couples', couplesRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/planner', plannerRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/steal', stealRoutes);
app.use('/api/reel', reelRoutes);
app.use('/api/gift', giftRoutes);
app.use('/api/upload', uploadRoutes);

// Health check
app.get('/health', async (req, res) => {
  try {
    const ollamaStatus = await ollamaService.checkConnection();
    res.status(200).json({ 
      status: 'OK', 
      message: 'Server is running',
      ollama: ollamaStatus ? 'connected' : 'disconnected'
    });
  } catch (error) {
    res.status(200).json({ 
      status: 'OK', 
      message: 'Server is running',
      ollama: 'unavailable'
    });
  }
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  
  // Check Ollama connection on startup
  console.log('\n🔍 Checking Ollama connection...');
  const isConnected = await ollamaService.checkConnection();
  if (isConnected) {
    console.log('✅ Ollama is ready to use!\n');
  } else {
    console.log('⚠️ Ollama is not available. AI features will use fallback responses.\n');
  }
});
// Nodemon restart trigger