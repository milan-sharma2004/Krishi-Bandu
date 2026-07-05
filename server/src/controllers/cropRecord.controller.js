import CropRecord from '../models/CropRecord.js';

export async function listMyCropRecords(req, res) {
  const records = await CropRecord.find({ farmer: req.user._id }).sort({ createdAt: -1 });
  res.json(records);
}

export async function createCropRecord(req, res) {
  const record = await CropRecord.create({ ...req.body, farmer: req.user._id });
  res.status(201).json(record);
}

export async function updateCropRecord(req, res) {
  const record = await CropRecord.findOneAndUpdate(
    { _id: req.params.id, farmer: req.user._id },
    req.body,
    { new: true }
  );
  if (!record) return res.status(404).json({ message: 'Crop record not found' });
  res.json(record);
}

export async function deleteCropRecord(req, res) {
  const record = await CropRecord.findOneAndDelete({ _id: req.params.id, farmer: req.user._id });
  if (!record) return res.status(404).json({ message: 'Crop record not found' });
  res.json({ message: 'Crop record deleted' });
}
