import axios from 'axios';

const webhookUrl = 'http://localhost:3001/api/webhook/test';

console.log('\nSending test webhook...');
console.log('Using webhook URL:', webhookUrl);

const testData = {
  message: 'Hello from webhook test!'
};

async function testWebhook() {
  try {
    const response = await axios.post(webhookUrl, testData);
    console.log('\nWebhook test successful! ✅');
    console.log('Response:', response.data);
  } catch (error: any) {
    console.log('\nError testing webhook: ❌');
    if (error.response) {
      console.log('Response:', error.response.data);
    } else {
      console.log('No response received. Is the server running?');
    }
  }
}

testWebhook(); 