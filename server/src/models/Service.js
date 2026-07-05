import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: {
      type: String,
      enum: ['Tractor Service', 'Agricultural Officer', 'Veterinary Doctor', 'Private Practitioner', 'Labor', 'Irrigation', 'Mechanic'],
      required: true,
    },
    provider: { type: String, required: true },
    location: { type: String, required: true },
    contact: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model('Service', serviceSchema);
