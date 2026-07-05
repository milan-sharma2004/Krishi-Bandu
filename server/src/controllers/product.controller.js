import Product from '../models/Product.js';

export async function listProducts(req, res) {
  const { category, search } = req.query;
  const filter = { status: 'active' };
  if (category && category !== 'All') filter.category = category;
  if (search) filter.name = { $regex: search, $options: 'i' };

  const products = await Product.find(filter).populate('seller', 'name location').sort({ createdAt: -1 });
  res.json(products);
}

export async function myProducts(req, res) {
  const products = await Product.find({ seller: req.user._id }).sort({ createdAt: -1 });
  res.json(products);
}

export async function getProduct(req, res) {
  const product = await Product.findById(req.params.id).populate('seller', 'name location phone');
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
}

export async function createProduct(req, res) {
  const product = await Product.create({ ...req.body, seller: req.user._id });
  res.status(201).json(product);
}

export async function updateProduct(req, res) {
  const product = await Product.findOneAndUpdate(
    { _id: req.params.id, seller: req.user._id },
    req.body,
    { new: true }
  );
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
}

export async function deleteProduct(req, res) {
  const product = await Product.findOneAndDelete({ _id: req.params.id, seller: req.user._id });
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json({ message: 'Product deleted' });
}
