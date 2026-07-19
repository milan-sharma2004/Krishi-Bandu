import User from '../models/User.js';
import Product from '../models/Product.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';

const SELLABLE_ROLES = ['farmer', 'seller'];

export const getSellerShop = asyncHandler(async (req, res) => {
  const seller = await User.findById(req.params.id);
  if (!seller || !SELLABLE_ROLES.includes(seller.role)) {
    throw new AppError('Shop not found', 404);
  }

  const products = await Product.find({
    seller: seller._id,
    status: 'active',
    availableQty: { $gt: 0 },
  }).sort({ createdAt: -1 });

  res.json({
    seller: {
      _id: seller._id,
      name: seller.name,
      shopName: seller.shopName,
      shopDescription: seller.shopDescription,
      location: seller.location,
      phone: seller.phone,
      avatarUrl: seller.avatarUrl,
      memberSince: seller.createdAt,
    },
    products,
  });
});
