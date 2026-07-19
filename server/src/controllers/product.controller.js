import Product from '../models/Product.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';

const EDITABLE_FIELDS = [
  'name',
  'variety',
  'category',
  'pricePerKg',
  'availableQty',
  'unit',
  'location',
  'imageUrl',
  'listingType',
];

function pickEditableFields(body) {
  const data = {};
  for (const field of EDITABLE_FIELDS) {
    if (body[field] !== undefined) data[field] = body[field];
  }
  return data;
}

function validateListingInput(data, { partial = false } = {}) {
  if (!partial || data.name !== undefined) {
    if (!data.name || typeof data.name !== 'string' || !data.name.trim()) {
      throw new AppError('Product name is required', 400);
    }
  }
  if (!partial || data.pricePerKg !== undefined) {
    const price = Number(data.pricePerKg);
    if (data.pricePerKg === undefined || Number.isNaN(price) || price <= 0) {
      throw new AppError('Price must be a positive number', 400);
    }
    data.pricePerKg = price;
  }
  if (!partial || data.availableQty !== undefined) {
    const qty = Number(data.availableQty);
    if (data.availableQty === undefined || Number.isNaN(qty) || qty < 0) {
      throw new AppError('Available quantity must be zero or a positive number', 400);
    }
    data.availableQty = qty;
  }
}

export const listProducts = asyncHandler(async (req, res) => {
  const { category, search } = req.query;
  const filter = { status: 'active', availableQty: { $gt: 0 } };
  if (category && category !== 'All') filter.category = category;
  if (search) filter.name = { $regex: search, $options: 'i' };

  const products = await Product.find(filter).populate('seller', 'name location').sort({ createdAt: -1 });
  res.json(products);
});

export const myProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ seller: req.user._id }).sort({ createdAt: -1 });
  res.json(products);
});

export const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('seller', 'name location phone');
  if (!product) throw new AppError('Product not found', 404);
  res.json(product);
});

export const createProduct = asyncHandler(async (req, res) => {
  const data = pickEditableFields(req.body);
  validateListingInput(data);

  const product = await Product.create({ ...data, seller: req.user._id });
  res.status(201).json(product);
});

export const updateProduct = asyncHandler(async (req, res) => {
  const data = pickEditableFields(req.body);
  validateListingInput(data, { partial: true });

  const product = await Product.findOneAndUpdate({ _id: req.params.id, seller: req.user._id }, data, {
    new: true,
    runValidators: true,
  });
  if (!product) throw new AppError('Product not found', 404);
  res.json(product);
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOneAndDelete({ _id: req.params.id, seller: req.user._id });
  if (!product) throw new AppError('Product not found', 404);
  res.json({ message: 'Product deleted' });
});
