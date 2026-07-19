import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
  },
  { _id: false }
);

const statusHistoryEntrySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'],
      required: true,
    },
    changedAt: { type: Date, default: Date.now },
    note: { type: String, trim: true },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderCode: { type: String, required: true, unique: true },
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true },
    paymentMethod: { type: String, default: 'Cash on Delivery' },
    deliveryAddress: { type: String, required: true },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
    statusHistory: [statusHistoryEntrySchema],
    estimatedDelivery: { type: Date, default: null },
    courierName: { type: String, trim: true, default: null },
    courierContact: { type: String, trim: true, default: null },
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);
