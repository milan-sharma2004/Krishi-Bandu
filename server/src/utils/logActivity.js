import ActivityLog from '../models/ActivityLog.js';

// Logging an admin action must never break the action itself, so failures
// here are swallowed (and reported to the server console) rather than thrown.
export async function logActivity({ admin, action, targetUser, details }) {
  try {
    await ActivityLog.create({
      admin: admin._id,
      adminName: admin.name,
      action,
      targetUser: targetUser?._id || null,
      targetLabel: targetUser ? `${targetUser.name} (${targetUser.email})` : '',
      details: details || '',
    });
  } catch (err) {
    console.error('Failed to record activity log:', err);
  }
}
