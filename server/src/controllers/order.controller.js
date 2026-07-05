import Order from '../models/Order.js';
import Product from '../models/Product.js';

function generateOrderCode() {
  const rand = Math.floor(10000 + Math.random() * 90000);
  return `KBORD${rand}`;
}

export async function createOrder(req, res) {
  const { items, deliveryAddress, paymentMethod } = req.body;
  if (!items || !items.length) return res.status(400).json({ message: 'Order must include items' });

  const productDocs = await Product.find({ _id: { $in: items.map((i) => i.product) } });
  if (!productDocs.length) return res.status(400).json({ message: 'Invalid products' });

  const itemsBySeller = new Map();
  for (const i of items) {
    const p = productDocs.find((pd) => pd._id.toString() === i.product);
    if (!p) continue;
    const sellerId = p.seller.toString();
    if (!itemsBySeller.has(sellerId)) itemsBySeller.set(sellerId, []);
    itemsBySeller.get(sellerId).push({ product: p._id, name: p.name, quantity: i.quantity, price: p.pricePerKg });
  }

  const orders = await Promise.all(
    Array.from(itemsBySeller.entries()).map(([sellerId, enrichedItems]) => {
      const totalAmount = enrichedItems.reduce((sum, i) => sum + i.quantity * i.price, 0);
      return Order.create({
        orderCode: generateOrderCode(),
        buyer: req.user._id,
        seller: sellerId,
        items: enrichedItems,
        totalAmount,
        deliveryAddress,
        paymentMethod: paymentMethod || 'Cash on Delivery',
      });
    })
  );

  res.status(201).json(orders);
}

export async function myOrders(req, res) {
  const orders = await Order.find({ buyer: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
}

export async function sellerOrders(req, res) {
  const orders = await Order.find({ seller: req.user._id }).populate('buyer', 'name location').sort({ createdAt: -1 });
  res.json(orders);
}

export async function getOrder(req, res) {
  const order = await Order.findById(req.params.id).populate('buyer', 'name location phone').populate('seller', 'name location phone');
  if (!order) return res.status(404).json({ message: 'Order not found' });

  const isBuyer = order.buyer._id.toString() === req.user._id.toString();
  const isSeller = order.seller._id.toString() === req.user._id.toString();
  if (!isBuyer && !isSeller && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  res.json(order);
}

export async function updateOrderStatus(req, res) {
  const { status } = req.body;
  const order = await Order.findOneAndUpdate(
    { _id: req.params.id, seller: req.user._id },
    { status },
    { new: true }
  );
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json(order);
}

export async function listAllOrders(_req, res) {
  const orders = await Order.find().populate('buyer', 'name').populate('seller', 'name').sort({ createdAt: -1 });
  res.json(orders);
}
