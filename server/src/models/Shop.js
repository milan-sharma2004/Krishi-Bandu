import mongoose from 'mongoose';

const shopSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    tags: [{ type: String }],
    location: { type: String, required: true },
    distanceKm: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model('Shop', shopSchema);
