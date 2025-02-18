const https = require('https');

const data = JSON.stringify({
  call_id: 'test-call-123456',
  contact_id: 'contact-123',
  campaign_id: 'campaign-789',
  recording_url: 'https://dxc03zgurdly9.cloudfront.net/call_a06a59af9e8364e12484f7cea85/recording.wav',
  status: 'completed',
  duration: 120,
  user_sentiment: 'positive',
  call_summary: 'Voice AI platform test call',
  full_transcript: 'Test call transcript'
});

const options = {
  hostname: '665d-98-50-125-123.ngrok-free.app',
  path: '/api/webhook/call',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length,
    'Authorization': 'Bearer your-webhook-secret-123'
  }
};

const req = https.request(options, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  
  res.on('data', (chunk) => {
    console.log('Response: ' + chunk);
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

req.write(data);
req.end(); 