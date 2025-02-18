import https from 'https';

const data = JSON.stringify({
  recording_url: 'https://dxc03zgurdly9.cloudfront.net/call_a06a59af9e8364e12484f7cea85/recording.wav'
});

const options = {
  hostname: '8dde-98-50-125-123.ngrok-free.app',
  path: '/api/webhook/call',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
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