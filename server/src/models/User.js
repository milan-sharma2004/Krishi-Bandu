import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['farmer', 'seller', 'buyer', 'expert', 'admin'], default: 'buyer' },
    phone: { type: String, trim: true },
    location: { type: String, trim: true },
    avatarUrl: { type: String },
    shopName: { type: String, trim: true, default: null },
    shopDescription: { type: String, trim: true, default: null },
    status: { type: String, enum: ['active', 'suspended'], default: 'active' },
    approvalStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'approved' },
    rejectionReason: { type: String, default: null },
    approvedAt: { type: Date, default: null },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        delete ret.password;
        return ret;
      },
    },
  }
);

export default mongoose.model('User', userSchema);
