import mongoose from 'mongoose';
import dotenv from 'dotenv';
import CallData from '../models/CallData';
import logger from '../utils/logger';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/voice-analytics';

async function clearTestData() {
  try {
    await mongoose.connect(MONGODB_URI);
    logger.info('Connected to MongoDB');

    // Keep only the real call we just received and delete everything else
    const result = await CallData.deleteMany({
      call_id: { $ne: 'j7firo8234jdn8304' }  // Delete everything except our real call
    });

    logger.info(`Deleted ${result.deletedCount} test/bogus records`);

    // Show the remaining real call data
    const remainingCalls = await CallData.find({});
    logger.info(`Remaining calls: ${remainingCalls.length}`);
    remainingCalls.forEach(call => {
      logger.info('Call details:', {
        call_id: call.call_id,
        timestamp: call.receivedAt,
        sentiment: call.user_sentiment
      });
    });

  } catch (error) {
    logger.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

clearTestData(); 