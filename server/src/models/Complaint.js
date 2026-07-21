import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    subject: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: { type: String, enum: ['order', 'payment', 'listing', 'account', 'other'], default: 'other' },
    status: { type: String, enum: ['open', 'in_progress', 'resolved', 'closed'], default: 'open' },
    adminNote: { type: String, trim: true, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('Complaint', complaintSchema);
