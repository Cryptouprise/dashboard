import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import webhookRoutes from './routes/webhook';
import metricsRoutes from './routes/metrics';
import { CallData } from './models/CallData';
import logger from './utils/logger';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use(helmet());

// Add request logging
app.use((req, res, next) => {
  logger.info(`Incoming ${req.method} request to ${req.url}`);
  next();
});

// Routes
app.use('/api/webhook', webhookRoutes);
app.use('/api', metricsRoutes);

// Cleanup endpoint
app.post('/api/cleanup', async (req, res) => {
  try {
    await CallData.deleteMany({});
    logger.info('All call data cleared');
    res.json({ message: 'All call data cleared successfully' });
  } catch (error) {
    logger.error('Error clearing call data:', error);
    res.status(500).json({ error: 'Failed to clear call data' });
  }
});

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/voice-analytics';

mongoose.connect(MONGODB_URI)
  .then(() => {
    logger.info('Connected to MongoDB');
  })
  .catch((error) => {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  });

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Test webhook endpoint available at http://localhost:${PORT}/api/webhook/test`);
}); 