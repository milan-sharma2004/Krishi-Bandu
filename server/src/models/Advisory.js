import mongoose from 'mongoose';

const advisorySchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['weather', 'pest', 'fertilizer', 'subsidy', 'general'], default: 'general' },
    icon: { type: String, default: 'info' },
    message: { type: String, required: true },
    region: { type: String },
    severity: { type: String, enum: ['low', 'medium', 'high'], default: 'low' },
  },
  { timestamps: true }
);

export default mongoose.model('Advisory', advisorySchema);
