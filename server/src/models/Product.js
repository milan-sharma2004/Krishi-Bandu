import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    variety: { type: String, trim: true },
    category: { type: String, enum: ['Crops', 'Seeds', 'Organic', 'Tools'], default: 'Crops' },
    pricePerKg: { type: Number, required: true },
    availableQty: { type: Number, required: true, default: 0 },
    unit: { type: String, default: 'kg' },
    location: { type: String, trim: true },
    imageUrl: { type: String },
    listingType: { type: String, enum: ['retail', 'bulk'], default: 'retail' },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

export default mongoose.model('Product', productSchema);
