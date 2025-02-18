import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3001;
const WEBHOOK_URL = `http://localhost:${PORT}/api/webhook/call`;
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || 'your-webhook-secret-123';

const generateUniqueId = () => `test-call-${Date.now()}`;

const testWebhookData = {
  call_id: generateUniqueId(),
  contact_id: 'contact-456',
  campaign_id: 'campaign-789',
  agent_id: 'agent-012',
  start_time: new Date().toISOString(),
  end_time: new Date().toISOString(),
  duration: 60,
  disconnection_reason: 'completed',
  user_sentiment: 'positive',
  call_summary: 'Test call with customer about product inquiry',
  call_completion: 'success',
  recording_url: 'https://www2.cs.uic.edu/~i101/SoundFiles/CantinaBand3.wav', // Using a real test audio file
  full_transcript: 'This is a test transcript for the call.',
  cost: 0.07,
  status: 'completed',
  appointment_scheduled: true,
  appointment_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  appointment_notes: 'Follow up meeting scheduled'
};

async function testWebhook() {
  try {
    console.log('Sending test webhook...');
    console.log('Using webhook URL:', WEBHOOK_URL);
    console.log('Using webhook secret:', WEBHOOK_SECRET);
    
    const response = await axios.post(WEBHOOK_URL, testWebhookData, {
      headers: {
        'Authorization': `Bearer ${WEBHOOK_SECRET}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('\nWebhook test successful! ✅');
    console.log('Response:', response.data);
  } catch (error: any) {
    console.error('\nError testing webhook: ❌');
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      console.error('No response received. Is the server running?');
    } else {
      console.error('Error:', error.message);
    }
  }
}

// Run the test
console.log('Starting webhook test...\n');
testWebhook(); 