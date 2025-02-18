import mongoose from 'mongoose';

const callDataSchema = new mongoose.Schema({
  call_id: { type: String, required: true, unique: true },
  contact_id: { type: String, required: true },
  campaign_id: String,
  agent_id: String,
  disconnection_reason: { type: String, required: true },
  user_sentiment: { 
    type: String, 
    required: true,
    enum: ['Positive', 'Negative', 'Neutral']
  },
  call_summary: { type: String, required: true },
  call_completion: { type: String, required: true },
  call_completion_reason: String,
  assistant_task_completion: { type: String, required: true },
  recording_url: { type: String, required: true },
  call_time_ms: { type: String, required: true },
  full_transcript: { type: String, required: true },
  appointment_scheduled: Boolean,
  appointment_time: Date,
  appointment_notes: String,
  receivedAt: { type: Date, required: true },
  processedAt: { type: Date, required: true }
}, {
  timestamps: true
});

// Create indexes for common queries
callDataSchema.index({ call_id: 1 });
callDataSchema.index({ contact_id: 1 });
callDataSchema.index({ campaign_id: 1 });
callDataSchema.index({ createdAt: -1 });

const CallData = mongoose.model('CallData', callDataSchema);

export default CallData; 