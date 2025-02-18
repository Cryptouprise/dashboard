const http = require('http');

const options = {
  hostname: 'localhost',
  port: 8080,
  path: '/api/webhook/health',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  
  res.on('data', (chunk) => {
    console.log('Response:', chunk.toString());
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

req.end(); 