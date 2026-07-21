import Complaint from '../models/Complaint.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';

const CATEGORIES = ['order', 'payment', 'listing', 'account', 'other'];
const STATUSES = ['open', 'in_progress', 'resolved', 'closed'];

export const createComplaint = asyncHandler(async (req, res) => {
  const { subject, description, category } = req.body;

  if (!subject || !subject.trim()) throw new AppError('Subject is required', 400);
  if (!description || !description.trim()) throw new AppError('Description is required', 400);
  if (category !== undefined && !CATEGORIES.includes(category)) {
    throw new AppError(`Category must be one of: ${CATEGORIES.join(', ')}`, 400);
  }

  const complaint = await Complaint.create({
    user: req.user._id,
    subject: subject.trim(),
    description: description.trim(),
    category: category || 'other',
  });
  res.status(201).json(complaint);
});

export const listMyComplaints = asyncHandler(async (req, res) => {
  const complaints = await Complaint.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(complaints);
});

export const listComplaints = asyncHandler(async (_req, res) => {
  const complaints = await Complaint.find().populate('user', 'name email role').sort({ createdAt: -1 });
  res.json(complaints);
});

export const updateComplaint = asyncHandler(async (req, res) => {
  const { status, adminNote } = req.body;
  if (status !== undefined && !STATUSES.includes(status)) {
    throw new AppError(`Status must be one of: ${STATUSES.join(', ')}`, 400);
  }

  const complaint = await Complaint.findById(req.params.id);
  if (!complaint) throw new AppError('Complaint not found', 404);

  if (status !== undefined) complaint.status = status;
  if (adminNote !== undefined) complaint.adminNote = adminNote.trim();
  await complaint.save();

  res.json(complaint);
});
