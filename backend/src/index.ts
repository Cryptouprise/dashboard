import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import http from 'http';
import webhookRoutes from './routes/webhook';
import logger from './utils/logger';

dotenv.config();

const app = express();

// Debug logging middleware
app.use((req, res, next) => {
  logger.info(`Incoming ${req.method} request to ${req.url}`);
  next();
});

// Middleware
app.use(cors());
app.use(express.json());

// Basic root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Routes
app.use('/api/webhook', webhookRoutes);

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/voice-analytics';

mongoose.connect(MONGODB_URI)
  .then(() => {
    logger.info('Connected to MongoDB');
  })
  .catch((error) => {
    logger.error('Error connecting to MongoDB:', error);
    process.exit(1);
  });

// Error handling middleware
app.use((err: Error, _req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
  next(err);
});

const PORT = process.env.PORT || 8080;

// Create HTTP server
const server = http.createServer(app);

// Start server
server.listen(PORT, () => {
  logger.info(`Server is running at http://127.0.0.1:${PORT}`);
  logger.info('Available endpoints:');
  logger.info(`1. Root: http://127.0.0.1:${PORT}/`);
  logger.info(`2. Health: http://127.0.0.1:${PORT}/api/webhook/health`);
  
  // Test the connection immediately
  http.get(`http://127.0.0.1:${PORT}/api/webhook/health`, (res) => {
    logger.info(`Health check response: ${res.statusCode}`);
  }).on('error', (err) => {
    logger.error(`Health check failed: ${err.message}`);
  });
}); 