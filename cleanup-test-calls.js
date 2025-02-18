const mongoose = require('mongoose');
const { CallData } = require('./src/models/CallData');

async function cleanupTestCalls() {
  try {
    await mongoose.connect('mongodb://localhost:27017/voice-analytics');
    console.log('Connected to MongoDB');

    // Keep the real call, delete all others
    const result = await CallData.deleteMany({
      recording_url: { 
        $ne: 'https://dxc03zgurdly9.cloudfront.net/call_481d9f615f7aeab503812cdcdbf/recording.wav'
      }
    });

    console.log(`Deleted ${result.deletedCount} test calls`);
    
    // Verify the real call is still there
    const realCall = await CallData.findOne({
      recording_url: 'https://dxc03zgurdly9.cloudfront.net/call_481d9f615f7aeab503812cdcdbf/recording.wav'
    });
    
    console.log('Real call preserved:', realCall);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

cleanupTestCalls(); 