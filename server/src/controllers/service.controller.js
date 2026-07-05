import Service from '../models/Service.js';

export async function listServices(_req, res) {
  const services = await Service.find().sort({ category: 1 });
  res.json(services);
}

export async function createService(req, res) {
  const service = await Service.create(req.body);
  res.status(201).json(service);
}

export async function deleteService(req, res) {
  await Service.findByIdAndDelete(req.params.id);
  res.json({ message: 'Service deleted' });
}
