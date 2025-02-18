import { Router, Request } from 'express';
import { handleCallWebhook } from '../controllers/webhookController';
import { validateWebhookSecret } from '../middleware/auth';
import { validateWebhookPayload } from '../middleware/validation';
import CallData from '../models/CallData';
import logger from '../utils/logger';
import path from 'path';

const router = Router();

interface WebhookRequest extends Request {
  webhookMeta?: {
    timestamp: Date;
    secret: string;
    validated: boolean;
  };
}

// HTML Dashboard endpoint
router.get('/dashboard/ui', async (_req, res) => {
  try {
    const calls = await CallData.find().sort({ receivedAt: -1 }).limit(50);
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Voice AI Analytics Dashboard</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
            .container { max-width: 1200px; margin: 0 auto; }
            h1 { color: #333; }
            .call-card {
              background: white;
              border-radius: 8px;
              padding: 15px;
              margin-bottom: 15px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .call-header {
              display: flex;
              justify-content: space-between;
              border-bottom: 1px solid #eee;
              padding-bottom: 10px;
              margin-bottom: 10px;
            }
            .sentiment {
              padding: 5px 10px;
              border-radius: 15px;
              font-size: 14px;
            }
            .sentiment.positive { background: #e3f9e5; color: #1b4332; }
            .sentiment.negative { background: #fde8e8; color: #9b1c1c; }
            .sentiment.neutral { background: #e5e7eb; color: #374151; }
            .meta { color: #666; font-size: 14px; }
            .transcript {
              background: #f8f9fa;
              padding: 10px;
              border-radius: 4px;
              margin-top: 10px;
              font-size: 14px;
              white-space: pre-wrap;
            }
            .stats {
              background: #fff;
              padding: 15px;
              border-radius: 8px;
              margin-bottom: 20px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Voice AI Analytics Dashboard</h1>
            <div class="stats">
              <h3>Stats</h3>
              <p>Total Calls: ${calls.length}</p>
            </div>
            ${calls.map(call => `
              <div class="call-card">
                <div class="call-header">
                  <div>
                    <strong>Call ID:</strong> ${call.call_id}
                    <span class="sentiment ${call.user_sentiment.toLowerCase()}">
                      ${call.user_sentiment}
                    </span>
                  </div>
                  <div class="meta">
                    ${new Date(call.receivedAt).toLocaleString()}
                  </div>
                </div>
                <div>
                  <p><strong>Contact ID:</strong> ${call.contact_id}</p>
                  <p><strong>Summary:</strong> ${call.call_summary}</p>
                  <p><strong>Duration:</strong> ${Math.round(parseInt(call.call_time_ms) / 1000 / 60)} minutes</p>
                  <p><strong>Completion:</strong> ${call.call_completion}</p>
                  <p><strong>Task Completion:</strong> ${call.assistant_task_completion}</p>
                  ${call.appointment_scheduled ? 
                    `<p><strong>Appointment:</strong> ${new Date(call.appointment_time).toLocaleString()}</p>` : 
                    ''}
                  <details>
                    <summary>View Transcript</summary>
                    <div class="transcript">${call.full_transcript}</div>
                  </details>
                </div>
              </div>
            `).join('')}
          </div>
          <script>
            // Auto-refresh every 30 seconds
            setTimeout(() => window.location.reload(), 30000);
          </script>
        </body>
      </html>
    `;
    res.send(html);
  } catch (error) {
    logger.error('Error fetching dashboard data:', error);
    res.status(500).send('Error loading dashboard');
  }
});

// JSON API endpoint
router.get('/dashboard', async (_req, res) => {
  try {
    const calls = await CallData.find().sort({ receivedAt: -1 }).limit(50);
    res.json({
      success: true,
      count: calls.length,
      data: calls
    });
  } catch (error) {
    logger.error('Error fetching dashboard data:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching data'
    });
  }
});

// Test endpoint to verify webhook configuration
router.post('/test', validateWebhookSecret, (req: WebhookRequest, res) => {
  logger.info('Webhook test received', {
    meta: req.webhookMeta,
    body: req.body
  });
  
  res.status(200).json({
    success: true,
    message: 'Webhook test successful',
    data: {
      received_at: new Date(),
      meta: req.webhookMeta,
      payload: req.body
    }
  });
});

// Cleanup endpoint to remove all existing data
router.post('/cleanup', async (req, res) => {
  try {
    await CallData.deleteMany({});
    logger.info('All existing call data has been cleared');
    res.json({ message: 'All call data cleared successfully' });
  } catch (error) {
    logger.error('Error cleaning up call data:', error);
    res.status(500).json({ error: 'Failed to clean up call data' });
  }
});

// Main webhook endpoint for call data
router.post('/call', async (req, res) => {
  logger.info('Incoming POST request to /api/webhook/call');
  
  try {
    // Clear all existing data first
    await CallData.deleteMany({});
    logger.info('Cleared existing call data');

    // Save the new call data
    const callData = new CallData({
      call_id: `call-${Date.now()}`,
      recording_url: req.body.recording_url,
      receivedAt: new Date(),
      duration: 60, // Default duration
      status: 'completed',
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

    res.json({ 
      message: 'Webhook received and saved successfully', 
      callId: callData.call_id 
    });
  } catch (error) {
    logger.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Failed to process webhook' });
  }
});

// Health check endpoint
router.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Webhook service is healthy',
    timestamp: new Date()
  });
});

export default router; 