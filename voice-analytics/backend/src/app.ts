import express, { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import dotenv from 'dotenv';
import logger from './utils/logger';
import mongoose from 'mongoose';
import webhookRoutes from './routes/webhook';
import metricsRoutes from './routes/metrics';
import { CallData } from './models/CallData';

// Load environment variables
dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3001;

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/voice-analytics';
mongoose.connect(MONGODB_URI)
  .then(() => {
    logger.info('Connected to MongoDB');
  })
  .catch((error) => {
    logger.error('MongoDB connection error:', error);
  });

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use(helmet());

// Add request logging
app.use((req, res, next) => {
  console.log(`Incoming ${req.method} request to ${req.url}`);
  next();
});

// Routes
app.use('/api/webhook', webhookRoutes);
app.use('/api', metricsRoutes);

// Webhook endpoint with error handling
app.post('/api/webhook/test', async (req: Request, res: Response) => {
  try {
    const data = req.body;
    if (!data) {
      throw new Error('Invalid payload - no data received');
    }
    
    logger.info('Webhook received:', { data });
    console.log('Webhook data:', data);

    // Save the test data to MongoDB
    const callData = new CallData({
      call_id: data.call_id || `test-${Date.now()}`,
      receivedAt: new Date(),
      duration: data.duration || 60,
      answered: data.status !== 'failed',
      status: data.status || 'completed',
      transferred: data.transferred || false,
      appointment_scheduled: data.appointment_scheduled || false,
      user_sentiment: data.user_sentiment || 'neutral',
      call_summary: data.call_summary || 'Test call',
      recording_url: data.recording_url || '',
      full_transcript: data.full_transcript || '',
      agent_id: data.agent_id || 'test-agent'
    });

    await callData.save();
    logger.info('Test call data saved to MongoDB');
    
    res.status(200).json({
      success: true,
      message: 'Webhook received and data saved successfully',
      data: data
    });
  } catch (error: any) {
    logger.error('Error processing webhook:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Unknown error occurred'
    });
  }
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  console.log('Health check requested');
  res.status(200).json({ status: 'ok' });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Test webhook endpoint available at http://localhost:${PORT}/api/webhook/test`);
});

export default app; 