import Advisory from '../models/Advisory.js';

export async function listAdvisories(_req, res) {
  const advisories = await Advisory.find().sort({ createdAt: -1 });
  res.json(advisories);
}

export async function createAdvisory(req, res) {
  const advisory = await Advisory.create(req.body);
  res.status(201).json(advisory);
}

export async function deleteAdvisory(req, res) {
  await Advisory.findByIdAndDelete(req.params.id);
  res.json({ message: 'Advisory deleted' });
}
