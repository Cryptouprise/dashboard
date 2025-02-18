import axios from 'axios';
import logger from '../utils/logger';

interface WebhookConfig {
  url: string;
  secret: string;
  retries?: number;
}

class WebhookService {
  private static MAX_RETRIES = 3;
  private static RETRY_DELAY = 1000; // 1 second

  /**
   * Send data to an external webhook
   */
  static async send(config: WebhookConfig, data: any, attempt = 1): Promise<boolean> {
    const { url, secret, retries = this.MAX_RETRIES } = config;

    try {
      const response = await axios.post(url, data, {
        headers: {
          'Authorization': `Bearer ${secret}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status >= 200 && response.status < 300) {
        logger.info('Webhook sent successfully', {
          url,
          status: response.status,
          data: response.data
        });
        return true;
      }

      throw new Error(`Received status code ${response.status}`);
    } catch (error) {
      logger.error('Error sending webhook', {
        url,
        attempt,
        error: error.message
      });

      // Retry logic
      if (attempt < retries) {
        await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY * attempt));
        return this.send(config, data, attempt + 1);
      }

      return false;
    }
  }

  /**
   * Send a test webhook to verify configuration
   */
  static async test(config: WebhookConfig): Promise<boolean> {
    const testData = {
      event: 'test',
      timestamp: new Date().toISOString(),
      message: 'This is a test webhook'
    };

    return this.send(config, testData);
  }

  /**
   * Send call status update to an external service
   */
  static async sendCallUpdate(config: WebhookConfig, callData: any): Promise<boolean> {
    return this.send(config, {
      event: 'call_update',
      timestamp: new Date().toISOString(),
      data: callData
    });
  }

  /**
   * Send campaign status update to an external service
   */
  static async sendCampaignUpdate(config: WebhookConfig, campaignData: any): Promise<boolean> {
    return this.send(config, {
      event: 'campaign_update',
      timestamp: new Date().toISOString(),
      data: campaignData
    });
  }
}

export default WebhookService; 