import Shop from '../models/Shop.js';

export async function listShops(_req, res) {
  const shops = await Shop.find().sort({ distanceKm: 1 });
  res.json(shops);
}

export async function createShop(req, res) {
  const shop = await Shop.create(req.body);
  res.status(201).json(shop);
}

export async function deleteShop(req, res) {
  await Shop.findByIdAndDelete(req.params.id);
  res.json({ message: 'Shop deleted' });
}
