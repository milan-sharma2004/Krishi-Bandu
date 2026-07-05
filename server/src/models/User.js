import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['farmer', 'buyer', 'admin'], default: 'buyer' },
    phone: { type: String, trim: true },
    location: { type: String, trim: true },
    avatarUrl: { type: String },
    status: { type: String, enum: ['active', 'suspended'], default: 'active' },
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
