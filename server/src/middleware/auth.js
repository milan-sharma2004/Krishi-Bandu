import User from '../models/User.js';
import { verifyToken } from '../utils/jwt.js';

function normalizeRole(role) {
  if (!role) return 'buyer';
  if (['farmer', 'seller'].includes(role)) return 'farmer';
  if (['expert', 'admin', 'buyer'].includes(role)) return role;
  return 'buyer';
}

export async function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Not authenticated' });

  let payload;
  try {
    payload = verifyToken(token);
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }

  const user = await User.findById(payload.id);
  if (!user) return res.status(401).json({ message: 'Invalid or expired token' });
  if (user.status === 'suspended') return res.status(401).json({ message: 'This account has been suspended' });

  req.user = user;
  next();
}

export function requireRole(...roles) {
  const normalizedRoles = roles.map(normalizeRole);
  return (req, res, next) => {
    const userRole = normalizeRole(req.user?.role);
    if (!req.user || !normalizedRoles.includes(userRole)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
}
