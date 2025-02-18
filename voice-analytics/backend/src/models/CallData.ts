import mongoose from 'mongoose';

export interface ICallData {
  call_id: string;
  receivedAt: Date;
  duration: number;
  answered: boolean;
  status: string;
  transferred: boolean;
  appointment_scheduled: boolean;
  user_sentiment: string;
  call_summary: string;
  recording_url: string;
  full_transcript: string;
  agent_id?: string;
}

const callDataSchema = new mongoose.Schema<ICallData>({
  call_id: { type: String, required: true, unique: true },
  receivedAt: { type: Date, required: true },
  duration: { type: Number, required: true },
  answered: { type: Boolean, default: false },
  status: { type: String, required: true },
  transferred: { type: Boolean, default: false },
  appointment_scheduled: { type: Boolean, default: false },
  user_sentiment: { type: String },
  call_summary: { type: String },
  recording_url: { type: String },
  full_transcript: { type: String },
  agent_id: { type: String }
}, {
  timestamps: true
});

// Create index on call_id for faster lookups
callDataSchema.index({ call_id: 1 });

export const CallData = mongoose.model<ICallData>('CallData', callDataSchema); 