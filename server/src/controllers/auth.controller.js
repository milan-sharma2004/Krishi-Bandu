import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { signToken } from '../utils/jwt.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';
import { isValidEmail, isValidPassword, normalizeRole } from '../utils/validators.js';

const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS) || 12;

const EDITABLE_PROFILE_FIELDS = ['name', 'phone', 'location', 'avatarUrl'];

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, phone, location } = req.body;

  if (!name || !email || !password) {
    throw new AppError('Name, email and password are required', 400);
  }
  if (!isValidEmail(email)) {
    throw new AppError('Enter a valid email address', 400);
  }
  if (!isValidPassword(password)) {
    throw new AppError('Password must be at least 8 characters', 400);
  }

  const normalizedEmail = email.toLowerCase().trim();
  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) throw new AppError('Email already registered', 409);

  const hashed = await bcrypt.hash(password, SALT_ROUNDS);

  let user;
  try {
    user = await User.create({
      name: String(name).trim(),
      email: normalizedEmail,
      password: hashed,
      role: normalizeRole(role),
      phone,
      location,
      // Every new public registration requires admin approval.
      approvalStatus: 'pending',
    });
  } catch (err) {
    if (err.code === 11000) throw new AppError('Email already registered', 409);
    throw err;
  }

  // Do not issue a JWT while the account is pending approval.
  res.status(201).json({
    message: 'Registration submitted successfully. Your account is awaiting administrator approval.',
    user: user.toJSON(),
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
    throw new AppError('Email and password are required', 400);
  }

  const normalizedEmail = email.toLowerCase().trim();
  const user = await User.findOne({ email: normalizedEmail }).select('+password');
  if (!user) throw new AppError('Invalid email or password', 401);

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new AppError('Invalid email or password', 401);

  if (user.approvalStatus === 'pending') {
    throw new AppError('Your account is awaiting administrator approval.', 403);
  }
  if (user.approvalStatus === 'rejected') {
    throw new AppError(user.rejectionReason || 'Your account registration was not approved.', 403);
  }
  if (user.status === 'suspended') {
    throw new AppError('This account has been suspended', 403);
  }

  const token = signToken(user);
  res.json({ token, user: user.toJSON() });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ user: req.user.toJSON() });
});

export const updateMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) throw new AppError('User not found', 404);

  for (const field of EDITABLE_PROFILE_FIELDS) {
    if (req.body[field] !== undefined) user[field] = req.body[field];
  }
  await user.save();
  res.json({ user: user.toJSON() });
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (typeof currentPassword !== 'string' || typeof newPassword !== 'string' || !currentPassword || !newPassword) {
    throw new AppError('Current and new password are required', 400);
  }
  if (!isValidPassword(newPassword)) {
    throw new AppError('New password must be at least 8 characters', 400);
  }

  const user = await User.findById(req.user._id).select('+password');
  if (!user) throw new AppError('User not found', 404);

  const match = await bcrypt.compare(currentPassword, user.password);
  if (!match) throw new AppError('Current password is incorrect', 401);

  const sameAsOld = await bcrypt.compare(newPassword, user.password);
  if (sameAsOld) throw new AppError('New password must be different from the current password', 400);

  user.password = await bcrypt.hash(newPassword, SALT_ROUNDS);
  await user.save();
  res.json({ message: 'Password updated' });
});
