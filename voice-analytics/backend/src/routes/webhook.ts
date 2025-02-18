import express from 'express';
import logger from '../utils/logger';
import { CallData } from '../models/CallData';

const router = express.Router();

// Test endpoint to verify webhook configuration
router.post('/test', (req, res) => {
  logger.info('Webhook test received', { body: req.body });
  res.status(200).json({
    message: 'Webhook test successful',
    receivedAt: new Date(),
    body: req.body
  });
});

// Webhook endpoint to receive call data
router.post('/call', async (req, res) => {
  try {
    // Extract only required fields from request
    const { recording_url } = req.body;
    
    // Create new call data with required fields and defaults
    const callData = new CallData({
      call_id: `call-${Date.now()}`, // Generate unique ID
      recording_url,
      duration: 60, // Default duration
      status: 'completed', // Default status
      receivedAt: new Date(),
      answered: true,
      transferred: false,
      appointment_scheduled: false
    });

    // Save to MongoDB
    await callData.save();

    logger.info(`Webhook received for call ${callData.call_id}`, {
      callId: callData.call_id,
      recording_url
    });

    res.status(200).json({
      message: 'Webhook received and saved successfully',
      callId: callData.call_id
    });
  } catch (error: any) {
    logger.error('Error processing webhook:', error);
    res.status(500).json({
      message: 'Error processing webhook',
      error: error.message || 'Unknown error'
    });
  }
});

export default router; 