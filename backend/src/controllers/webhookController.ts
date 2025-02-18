import { Request, Response } from 'express';
import logger from '../utils/logger';
import CallData from '../models/CallData';

interface WebhookRequest extends Request {
  webhookMeta?: {
    timestamp: Date;
    secret: string;
    validated: boolean;
  };
}

export const handleCallWebhook = async (req: WebhookRequest, res: Response) => {
  try {
    const callData = new CallData({
      ...req.body,
      receivedAt: req.webhookMeta?.timestamp || new Date(),
      processedAt: new Date()
    });

    await callData.save();

    logger.info('Call data saved successfully', {
      call_id: req.body.call_id,
      contact_id: req.body.contact_id
    });

    res.status(200).json({
      success: true,
      message: 'Webhook processed successfully',
      data: {
        call_id: callData.call_id,
        received_at: callData.receivedAt,
        processed_at: callData.processedAt
      }
    });
  } catch (error) {
    logger.error('Error processing webhook', {
      error: error instanceof Error ? error.message : 'Unknown error',
      body: req.body
    });

    res.status(500).json({
      success: false,
      message: 'Error processing webhook'
    });
  }
}; 