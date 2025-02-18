import mongoose, { Schema, Document } from 'mongoose';

export interface ICampaign extends Document {
  name: string;
  description?: string;
  start_date: Date;
  end_date?: Date;
  status: 'active' | 'paused' | 'completed';
  cost_per_minute: number;
  budget: number;
  budget_spent: number;
  target_appointments: number;
  appointments_scheduled: number;
  success_rate_target: number;
}

const CampaignSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  start_date: { type: Date, required: true },
  end_date: { type: Date },
  status: {
    type: String,
    enum: ['active', 'paused', 'completed'],
    default: 'active'
  },
  cost_per_minute: {
    type: Number,
    required: true,
    min: 0.07,
    max: 1.00,
    default: 0.07
  },
  budget: {
    type: Number,
    required: true,
    min: 0
  },
  budget_spent: {
    type: Number,
    default: 0,
    min: 0
  },
  target_appointments: {
    type: Number,
    required: true,
    min: 0
  },
  appointments_scheduled: {
    type: Number,
    default: 0,
    min: 0
  },
  success_rate_target: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for progress percentage
CampaignSchema.virtual('progress').get(function() {
  return (this.appointments_scheduled / this.target_appointments) * 100;
});

// Virtual for budget usage percentage
CampaignSchema.virtual('budget_usage').get(function() {
  return (this.budget_spent / this.budget) * 100;
});

// Virtual for success rate
CampaignSchema.virtual('current_success_rate').get(function() {
  return this.appointments_scheduled > 0 ? 
    (this.appointments_scheduled / this.target_appointments) * 100 : 0;
});

// Indexes
CampaignSchema.index({ status: 1 });
CampaignSchema.index({ start_date: -1 });
CampaignSchema.index({ name: 'text' });

export default mongoose.model<ICampaign>('Campaign', CampaignSchema); 