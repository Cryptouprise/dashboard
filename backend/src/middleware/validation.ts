import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import logger from '../utils/logger';

// Define the webhook payload schema
const webhookSchema = z.object({
  call_id: z.string().min(1),
  contact_id: z.string().min(1),
  campaign_id: z.string().optional(),
  agent_id: z.string().optional(),
  disconnection_reason: z.string(),
  user_sentiment: z.enum(['Positive', 'Negative', 'Neutral']),
  call_summary: z.string(),
  call_completion: z.string(),
  call_completion_reason: z.string().optional(),
  assistant_task_completion: z.string(),
  recording_url: z.string().url(),
  call_time_ms: z.string(),
  full_transcript: z.string(),
  appointment_scheduled: z.boolean().optional(),
  appointment_time: z.string().datetime().optional(),
  appointment_notes: z.string().optional()
});

export const validateWebhookPayload = (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = webhookSchema.parse(req.body);
    req.body = validatedData; // Replace with validated data
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.warn('Invalid webhook payload', {
        errors: error.errors,
        body: req.body
      });
      return res.status(400).json({
        success: false,
        message: 'Invalid webhook payload',
        errors: error.errors
      });
    }
    
    logger.error('Unexpected validation error', { error });
    return res.status(500).json({
      success: false,
      message: 'Error validating webhook payload'
    });
  }
}; 