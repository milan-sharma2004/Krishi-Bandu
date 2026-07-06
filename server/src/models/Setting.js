import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema(
  {
    siteName: { type: String, default: 'Krishi Bandu' },
    supportPhone: { type: String, default: '1660-01-2323' },
    supportEmail: { type: String, default: 'support@krishibandu.com' },
    maintenanceMode: { type: Boolean, default: false },
  },
  { timestamps: true }
);

settingSchema.statics.getSingleton = async function getSingleton() {
  let doc = await this.findOne();
  if (!doc) doc = await this.create({});
  return doc;
};

export default mongoose.model('Setting', settingSchema);
