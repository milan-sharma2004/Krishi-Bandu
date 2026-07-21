import mongoose from 'mongoose';

const ACTIONS = [
  'user.approved',
  'user.rejected',
  'user.suspended',
  'user.activated',
  'user.deleted',
];

const activityLogSchema = new mongoose.Schema(
  {
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    adminName: { type: String, required: true },
    action: { type: String, enum: ACTIONS, required: true },
    targetUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    // Snapshot of the target's name/email so the log stays readable even if
    // the account is later deleted (a populated ref would just return null).
    targetLabel: { type: String, default: '' },
    details: { type: String, trim: true, default: '' },
  },
  { timestamps: true }
);

export { ACTIONS };
export default mongoose.model('ActivityLog', activityLogSchema);
