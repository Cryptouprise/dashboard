import mongoose, { Document, Schema } from 'mongoose';

export interface ICall extends Document {
  callId: string;
  contactId: string;
  campaignId: string;
  agentId: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  disconnectionReason: string;
  userSentiment: string;
  callSummary: string;
  callCompletion: number;
  recordingUrl: string;
  fullTranscript: string;
  cost: number;
  status: string;
  appointmentScheduled: boolean;
  appointmentTime?: Date;
  appointmentNotes?: string;
  receivedAt: Date;
}

const CallSchema = new Schema<ICall>({
  callId: { type: String, required: true, unique: true },
  contactId: { type: String, required: true },
  campaignId: { type: String, required: true },
  agentId: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  duration: { type: Number, required: true },
  disconnectionReason: { type: String, required: true },
  userSentiment: { type: String, required: true },
  callSummary: { type: String, required: true },
  callCompletion: { type: Number, required: true },
  recordingUrl: { type: String, required: true },
  fullTranscript: { type: String, required: true },
  cost: { type: Number, required: true },
  status: { type: String, required: true },
  appointmentScheduled: { type: Boolean, required: true },
  appointmentTime: { type: Date },
  appointmentNotes: { type: String },
  receivedAt: { type: Date, required: true }
}, {
  timestamps: true
});

// Indexes for better query performance
CallSchema.index({ campaignId: 1, startTime: -1 });
CallSchema.index({ agentId: 1, startTime: -1 });
CallSchema.index({ status: 1 });
CallSchema.index({ appointmentScheduled: 1 });

export const Call = mongoose.model<ICall>('Call', CallSchema); 