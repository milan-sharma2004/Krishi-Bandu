import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

function signToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
}

function sanitize(user) {
  const obj = user.toObject();
  delete obj.password;
  return obj;
}

export async function register(req, res) {
  const { name, email, password, role, phone, location } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required' });
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) return res.status(409).json({ message: 'Email already registered' });

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashed,
    role: ['farmer', 'buyer', 'admin'].includes(role) ? role : 'buyer',
    phone,
    location,
  });

  const token = signToken(user);
  res.status(201).json({ token, user: sanitize(user) });
}

export async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: 'Invalid credentials' });

  const token = signToken(user);
  res.json({ token, user: sanitize(user) });
}

export async function me(req, res) {
  res.json({ user: req.user });
}
