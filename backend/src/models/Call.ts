import mongoose, { Schema, Document } from 'mongoose';

export interface ICall extends Document {
  call_id: string;
  contact_id: string;
  timestamp: Date;
  disconnection_reason: string;
  user_sentiment: string;
  call_summary: string;
  call_completion: boolean;
  call_completion_reason: string;
  assistant_task_completion: boolean;
  recording_url: string;
  call_duration_minutes: number;
  full_transcript: string;
  campaign_id?: string;
  agent_id?: string;
  appointment_scheduled: boolean;
  cost_per_minute: number;
  total_cost: number;
}

const CallSchema: Schema = new Schema({
  call_id: { type: String, required: true, unique: true },
  contact_id: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  disconnection_reason: { type: String, required: true },
  user_sentiment: { 
    type: String, 
    enum: ['Positive', 'Negative', 'Neutral'],
    required: true 
  },
  call_summary: { type: String, required: true },
  call_completion: { type: Boolean, required: true },
  call_completion_reason: { type: String },
  assistant_task_completion: { type: Boolean, required: true },
  recording_url: { type: String, required: true },
  call_duration_minutes: { type: Number, required: true },
  full_transcript: { type: String, required: true },
  campaign_id: { type: String },
  agent_id: { type: String },
  appointment_scheduled: { 
    type: Boolean, 
    default: false 
  },
  cost_per_minute: { 
    type: Number,
    default: 0.07,
    min: 0.07,
    max: 1.00
  },
  total_cost: { type: Number, required: true }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
CallSchema.index({ timestamp: -1 });
CallSchema.index({ campaign_id: 1 });
CallSchema.index({ agent_id: 1 });
CallSchema.index({ user_sentiment: 1 });

export default mongoose.model<ICall>('Call', CallSchema); 