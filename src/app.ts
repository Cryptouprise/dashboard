import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import dotenv from 'dotenv';
import webhookRoutes from './routes/webhook';
import { logger } from './utils/logger';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Routes
app.use('/api/webhook', webhookRoutes);

// Simple test endpoint
app.post('/api/webhook/test', (req, res) => {
  console.log('Received webhook:', req.body);
  res.json({ 
    success: true, 
    message: 'Webhook received!',
    data: req.body 
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
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

const PORT = Number(process.env.PORT) || 3001;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Test webhook endpoint available at http://localhost:${PORT}/api/webhook/test`);
}); 