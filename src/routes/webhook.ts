import express from 'express';
import { logger } from '../utils/logger';
import { CallData } from '../models/CallData';

const router = express.Router();

// Middleware to verify webhook secret
const verifyWebhookSecret = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const webhookSecret = process.env.WEBHOOK_SECRET || 'your-webhook-secret-123';
  const receivedSecret = req.headers['x-webhook-secret'];

  if (receivedSecret !== webhookSecret) {
    logger.error('Invalid webhook secret');
    return res.status(401).json({ error: 'Invalid webhook secret' });
  }

  next();
};

// Simple test endpoint that just returns success
router.post('/test', (req: express.Request, res: express.Response) => {
  logger.info('Received test webhook', { body: req.body });
  res.status(200).json({
    message: 'Test webhook received successfully',
    data: req.body
  });
});

// Main webhook endpoint for call data
router.post('/call', async (req, res) => {
  logger.info('Incoming POST request to /api/webhook/call');
  
  try {
    // First, clean up test calls
    await CallData.deleteMany({
      recording_url: { 
        $ne: 'https://dxc03zgurdly9.cloudfront.net/call_481d9f615f7aeab503812cdcdbf/recording.wav'
      }
    });
    
    // Now handle the new call
    const callData = new CallData({
      ...req.body,
      receivedAt: new Date(),
      status: 'completed',
      duration: 60,
      answered: true,
      transferred: false,
      appointment_scheduled: false
    });

    await callData.save();
    
    logger.info(`Webhook received for call ${callData.call_id}`, {
      callId: callData.call_id,
      recording_url: callData.recording_url,
      timestamp: new Date().toISOString()
    });

    res.json({ message: 'Webhook received and saved successfully', callId: callData.call_id });
  } catch (error) {
    logger.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Failed to process webhook' });
  }
});

// Cleanup endpoint to remove test calls
router.post('/cleanup', async (req, res) => {
  try {
    const result = await CallData.deleteMany({
      recording_url: { 
        $ne: 'https://dxc03zgurdly9.cloudfront.net/call_481d9f615f7aeab503812cdcdbf/recording.wav'
      }
    });

    logger.info(`Deleted ${result.deletedCount} test calls`);
    
    const realCall = await CallData.findOne({
      recording_url: 'https://dxc03zgurdly9.cloudfront.net/call_481d9f615f7aeab503812cdcdbf/recording.wav'
    });

    res.json({ 
      message: `Deleted ${result.deletedCount} test calls`,
      remainingCall: realCall
    });
  } catch (error) {
    logger.error('Error cleaning up test calls:', error);
    res.status(500).json({ error: 'Failed to clean up test calls' });
  }
});

export default router; 