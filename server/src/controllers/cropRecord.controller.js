import CropRecord from '../models/CropRecord.js';

export async function listMyCropRecords(req, res) {
  const records = await CropRecord.find({ farmer: req.user._id }).sort({ createdAt: -1 });
  res.json(records);
}

export async function createCropRecord(req, res) {
  const record = await CropRecord.create({ ...req.body, farmer: req.user._id });
  res.status(201).json(record);
}
