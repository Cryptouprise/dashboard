import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3001;
const BASE_URL = `http://localhost:${PORT}/api/webhook`;
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || 'your-webhook-secret-123';

// Test data matching our schema
const validCallData = {
  call_id: `test-${Date.now()}`,
  contact_id: "contact-456",
  campaign_id: "campaign-789",
  agent_id: "agent-001",
  disconnection_reason: "call_completed",
  user_sentiment: "Positive",
  call_summary: "Customer showed interest and scheduled a follow-up appointment.",
  call_completion: "true",
  call_completion_reason: "completed_successfully",
  assistant_task_completion: "true",
  recording_url: "https://example.com/recordings/test-call.mp3",
  call_time_ms: "300000", // 5 minutes
  full_transcript: "This is a sample transcript of the call...",
  appointment_scheduled: true,
  appointment_time: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
  appointment_notes: "Follow-up demo scheduled"
};

// Invalid test data to verify validation
const invalidCallData = {
  call_id: "",  // Should fail validation
  contact_id: "contact-456",
  user_sentiment: "Invalid",  // Should fail enum validation
  call_summary: "Test call"
  // Missing required fields
};

async function testWebhook() {
  const axiosInstance = axios.create({
    headers: {
      'Authorization': `Bearer ${WEBHOOK_SECRET}`,
      'Content-Type': 'application/json'
    }
  });

  try {
    // Test 1: Health check
    console.log('\n1. Testing health endpoint...');
    const healthResponse = await axiosInstance.get(`${BASE_URL}/health`);
    console.log('✅ Health check successful:', healthResponse.data);

    // Test 2: Test endpoint
    console.log('\n2. Testing webhook test endpoint...');
    const testResponse = await axiosInstance.post(`${BASE_URL}/test`, {
      message: 'Test webhook message',
      timestamp: new Date().toISOString()
    });
    console.log('✅ Test webhook successful:', testResponse.data);

    // Test 3: Valid call webhook
    console.log('\n3. Testing call webhook with valid data...');
    const validResponse = await axiosInstance.post(`${BASE_URL}/call`, validCallData);
    console.log('✅ Valid call webhook successful:', validResponse.data);

    // Test 4: Invalid call webhook (should fail)
    console.log('\n4. Testing call webhook with invalid data...');
    try {
      await axiosInstance.post(`${BASE_URL}/call`, invalidCallData);
      console.log('❌ Expected validation error but request succeeded');
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ Validation correctly rejected invalid data:', error.response.data);
      } else {
        throw error;
      }
    }

    // Test 5: Invalid auth
    console.log('\n5. Testing invalid authentication...');
    try {
      await axios.post(`${BASE_URL}/call`, validCallData, {
        headers: {
          'Authorization': 'Bearer invalid-secret',
          'Content-Type': 'application/json'
        }
      });
      console.log('❌ Expected auth error but request succeeded');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Auth correctly rejected invalid secret:', error.response.data);
      } else {
        throw error;
      }
    }

    console.log('\n✅ All tests completed successfully!');
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      console.error('No response received. Is the server running?');
    }
    process.exit(1);
  }
}

// Run the tests
console.log('Starting webhook tests...\n');
console.log('Using webhook URL:', BASE_URL);
console.log('Using webhook secret:', WEBHOOK_SECRET);

testWebhook(); 