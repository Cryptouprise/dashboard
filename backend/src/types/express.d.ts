import 'express';

declare global {
  namespace Express {
    interface Request {
      webhookMeta?: {
        timestamp: Date;
        secret: string;
        validated: boolean;
      };
    }
  }
}

export {}; 