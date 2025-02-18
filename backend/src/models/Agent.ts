import mongoose, { Schema, Document } from 'mongoose';

export interface IAgent extends Document {
  name: string;
  email: string;
  status: 'active' | 'inactive' | 'busy';
  avatar_url?: string;
  total_calls: number;
  answered_calls: number;
  appointments_scheduled: number;
  total_talk_time: number;
  average_call_duration: number;
  positive_sentiment_rate: number;
  success_rate: number;
  current_streak: number;
  best_streak: number;
  badges: string[];
  level: number;
  experience_points: number;
  campaigns: string[];
}

const AgentSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  status: {
    type: String,
    enum: ['active', 'inactive', 'busy'],
    default: 'active'
  },
  avatar_url: { type: String },
  total_calls: { type: Number, default: 0 },
  answered_calls: { type: Number, default: 0 },
  appointments_scheduled: { type: Number, default: 0 },
  total_talk_time: { type: Number, default: 0 }, // in minutes
  average_call_duration: { type: Number, default: 0 },
  positive_sentiment_rate: { type: Number, default: 0 },
  success_rate: { type: Number, default: 0 },
  current_streak: { type: Number, default: 0 },
  best_streak: { type: Number, default: 0 },
  badges: [{ type: String }],
  level: { type: Number, default: 1 },
  experience_points: { type: Number, default: 0 },
  campaigns: [{ type: Schema.Types.ObjectId, ref: 'Campaign' }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for next level threshold
AgentSchema.virtual('next_level_threshold').get(function() {
  return this.level * 1000; // Simple progression: each level requires 1000 more XP
});

// Virtual for level progress
AgentSchema.virtual('level_progress').get(function() {
  const currentLevelThreshold = (this.level - 1) * 1000;
  const nextLevelThreshold = this.level * 1000;
  const currentLevelXP = this.experience_points - currentLevelThreshold;
  const levelRange = nextLevelThreshold - currentLevelThreshold;
  return (currentLevelXP / levelRange) * 100;
});

// Method to add experience points and handle leveling up
AgentSchema.methods.addExperiencePoints = async function(points: number) {
  this.experience_points += points;
  
  // Check for level up
  const newLevel = Math.floor(this.experience_points / 1000) + 1;
  if (newLevel > this.level) {
    this.level = newLevel;
    this.badges.push(`Level ${newLevel}`);
  }
  
  await this.save();
};

// Method to update performance metrics
AgentSchema.methods.updatePerformanceMetrics = async function(callData: {
  duration: number;
  successful: boolean;
  sentiment: string;
}) {
  this.total_calls += 1;
  this.total_talk_time += callData.duration;
  this.average_call_duration = this.total_talk_time / this.total_calls;
  
  if (callData.successful) {
    this.appointments_scheduled += 1;
    this.current_streak += 1;
    this.best_streak = Math.max(this.current_streak, this.best_streak);
    await this.addExperiencePoints(100);
  } else {
    this.current_streak = 0;
  }
  
  this.success_rate = (this.appointments_scheduled / this.total_calls) * 100;
  
  if (callData.sentiment === 'Positive') {
    this.positive_sentiment_rate = 
      ((this.positive_sentiment_rate * (this.total_calls - 1)) + 100) / this.total_calls;
  } else {
    this.positive_sentiment_rate = 
      (this.positive_sentiment_rate * (this.total_calls - 1)) / this.total_calls;
  }
  
  await this.save();
};

// Indexes
AgentSchema.index({ email: 1 }, { unique: true });
AgentSchema.index({ status: 1 });
AgentSchema.index({ success_rate: -1 });
AgentSchema.index({ level: -1 });

export default mongoose.model<IAgent>('Agent', AgentSchema); 