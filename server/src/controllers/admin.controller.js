import User from '../models/User.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

export async function overview(_req, res) {
  const [totalUsers, totalSellers, totalBuyers, totalOrders, totalProducts] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: 'farmer' }),
    User.countDocuments({ role: 'buyer' }),
    Order.countDocuments(),
    Product.countDocuments(),
  ]);

  const since = new Date();
  since.setDate(since.getDate() - 30);
  const recentOrders = await Order.find({ createdAt: { $gte: since } }).select('createdAt totalAmount');

  const byDay = {};
  for (const order of recentOrders) {
    const key = order.createdAt.toISOString().slice(0, 10);
    byDay[key] = (byDay[key] || 0) + 1;
  }
  const ordersLast30Days = Object.entries(byDay)
    .sort(([a], [b]) => (a > b ? 1 : -1))
    .map(([date, count]) => ({ date, count }));

  res.json({ totalUsers, totalSellers, totalBuyers, totalOrders, totalProducts, ordersLast30Days });
}

export async function listUsers(_req, res) {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.json(users);
}

export async function updateUserStatus(req, res) {
  const { status } = req.body;
  const user = await User.findByIdAndUpdate(req.params.id, { status }, { new: true }).select('-password');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
}
