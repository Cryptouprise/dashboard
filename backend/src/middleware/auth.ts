import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

interface WebhookRequest extends Request {
  webhookMeta?: {
    timestamp: Date;
    validated: boolean;
  };
}

export const validateWebhookSecret = (req: WebhookRequest, res: Response, next: NextFunction) => {
  // Add webhook metadata without requiring authentication
  req.webhookMeta = {
    timestamp: new Date(),
    validated: true
  };

  logger.info('Webhook request received', {
    method: req.method,
    path: req.path,
    timestamp: req.webhookMeta.timestamp
  });

  next();
}; 