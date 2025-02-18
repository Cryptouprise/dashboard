import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export const validateWebhookSecret = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    logger.warn('Missing Authorization header in webhook request');
    return res.status(401).json({
      message: 'Missing Authorization header'
    });
  }

  // Extract the token from the Bearer scheme
  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    logger.warn('Invalid Authorization header format in webhook request');
    return res.status(401).json({
      message: 'Invalid Authorization header format'
    });
  }

  // Get the webhook secret from environment variables
  const webhookSecret = process.env.WEBHOOK_SECRET;

  if (!webhookSecret) {
    logger.error('WEBHOOK_SECRET not configured in environment');
    return res.status(500).json({
      message: 'Server configuration error'
    });
  }

  // Validate the token
  if (token !== webhookSecret) {
    logger.warn('Invalid webhook secret provided');
    return res.status(401).json({
      message: 'Invalid webhook secret'
    });
  }

  next();
}; 