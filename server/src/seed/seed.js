import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { connectDB } from '../config/db.js';
import mongoose from 'mongoose';

import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import CropRecord from '../models/CropRecord.js';
import Advisory from '../models/Advisory.js';
import Service from '../models/Service.js';
import Shop from '../models/Shop.js';

async function run() {
  await connectDB();
  console.log('Clearing existing data...');
  await Promise.all([
    User.deleteMany({}),
    Product.deleteMany({}),
    Order.deleteMany({}),
    CropRecord.deleteMany({}),
    Advisory.deleteMany({}),
    Service.deleteMany({}),
    Shop.deleteMany({}),
  ]);

  const passwordHash = await bcrypt.hash('password123', 10);

  console.log('Creating users...');
  const [ravi, sita, admin] = await User.create([
    {
      name: 'Ravi Kumar',
      email: 'ravi@krishibandu.com',
      password: passwordHash,
      role: 'farmer',
      phone: '9851234567',
      location: 'Sindhupalchok',
      avatarUrl: 'https://i.pravatar.cc/150?img=12',
    },
    {
      name: 'Sita Sharma',
      email: 'sita@krishibandu.com',
      password: passwordHash,
      role: 'buyer',
      phone: '9807654321',
      location: 'Kathmandu',
      avatarUrl: 'https://i.pravatar.cc/150?img=32',
    },
    {
      name: 'Admin User',
      email: 'admin@krishibandu.com',
      password: passwordHash,
      role: 'admin',
      phone: '9800000000',
      location: 'Kathmandu',
    },
  ]);

  // Bulk extra users so admin stats look realistic
  const extraFarmers = Array.from({ length: 40 }).map((_, i) => ({
    name: `Farmer ${i + 1}`,
    email: `farmer${i + 1}@krishibandu.com`,
    password: passwordHash,
    role: 'farmer',
    location: ['Sindhupalchok', 'Chitwan', 'Kavre', 'Nuwakot', 'Bhaktapur'][i % 5],
  }));
  const extraBuyers = Array.from({ length: 60 }).map((_, i) => ({
    name: `Buyer ${i + 1}`,
    email: `buyer${i + 1}@krishibandu.com`,
    password: passwordHash,
    role: 'buyer',
    location: ['Kathmandu', 'Lalitpur', 'Bhaktapur', 'Pokhara'][i % 4],
  }));
  await User.insertMany([...extraFarmers, ...extraBuyers]);

  console.log('Creating products...');
  const products = await Product.create([
    {
      seller: ravi._id,
      name: 'Paddy',
      variety: 'Mansuli',
      category: 'Crops',
      pricePerKg: 32,
      availableQty: 500,
      location: 'Nuwakot',
      imageUrl: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=400',
      listingType: 'bulk',
    },
    {
      seller: ravi._id,
      name: 'Tomato',
      variety: 'Hybrid',
      category: 'Crops',
      pricePerKg: 60,
      availableQty: 200,
      location: 'Sindhuli',
      imageUrl: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400',
    },
    {
      seller: ravi._id,
      name: 'Maize',
      variety: 'Rampur',
      category: 'Crops',
      pricePerKg: 33,
      availableQty: 400,
      location: 'Chitwan',
      imageUrl: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400',
    },
    {
      seller: ravi._id,
      name: 'Potato',
      variety: 'Janakdev',
      category: 'Crops',
      pricePerKg: 24,
      availableQty: 300,
      location: 'Kavre',
      imageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400',
    },
    {
      seller: ravi._id,
      name: 'Cauliflower',
      variety: 'Improved',
      category: 'Organic',
      pricePerKg: 48,
      availableQty: 150,
      location: 'Kathmandu',
      imageUrl: 'https://images.unsplash.com/photo-1613743983303-b3e89f8a2b80?w=400',
    },
  ]);

  console.log('Creating crop records...');
  await CropRecord.create([
    { farmer: ravi._id, crop: 'Paddy', variety: 'Mansuli', areaRopani: 28, productionKg: 800, avgPrice: 32, trend: 'up', season: 'Kharif 2081' },
    { farmer: ravi._id, crop: 'Tomato', variety: 'Hybrid', areaRopani: 15, productionKg: 700, avgPrice: 60, trend: 'up', season: 'Kharif 2081' },
    { farmer: ravi._id, crop: 'Maize', variety: 'Rampur', areaRopani: 20, productionKg: 500, avgPrice: 23, trend: 'up', season: 'Kharif 2081' },
    { farmer: ravi._id, crop: 'Potato', variety: 'Janakdev', areaRopani: 18, productionKg: 400, avgPrice: 24, trend: 'down', season: 'Rabi 2080' },
    { farmer: ravi._id, crop: 'Cauliflower', variety: 'Improved', areaRopani: 12, productionKg: 220, avgPrice: 48, trend: 'up', season: 'Rabi 2080' },
  ]);

  console.log('Creating advisories...');
  await Advisory.create([
    { type: 'weather', icon: 'cloud-rain', message: 'Heavy rain alert in your area. Secure crops.', region: 'Sindhupalchok', severity: 'high' },
    { type: 'pest', icon: 'bug', message: 'Potential stem borer in maize. Take action.', region: 'Chitwan', severity: 'medium' },
    { type: 'fertilizer', icon: 'leaf', message: 'Apply urea in paddy this week.', region: 'Nuwakot', severity: 'low' },
    { type: 'subsidy', icon: 'info', message: 'Government subsidy for drip irrigation available.', region: 'National', severity: 'low' },
  ]);

  console.log('Creating services...');
  await Service.create([
    { name: 'Tractor Service', category: 'Tractor Service', provider: 'Shree Ganesh Agro', location: 'Bhaktapur', contact: '9851234567' },
    { name: 'Agricultural Officer', category: 'Agricultural Officer', provider: 'District Agriculture Office', location: 'Bhaktapur', contact: '9851122334' },
    { name: 'Veterinary Doctor', category: 'Veterinary Doctor', provider: 'Dr. Suresh Thapa', location: 'Bhaktapur', contact: '057-623456' },
    { name: 'Private Practitioner', category: 'Private Practitioner', provider: 'Krishi Sewa Clinic', location: 'Bhaktapur', contact: '9812345678' },
  ]);

  console.log('Creating shops...');
  await Shop.create([
    { name: 'Green Agri Center', tags: ['Seeds', 'Fertilizers', 'Tools'], location: 'Bhaktapur', distanceKm: 0.8 },
    { name: 'Naya Krishi Store', tags: ['Seeds', 'Pesticides', 'Tools'], location: 'Madhyapur', distanceKm: 1.2 },
    { name: 'Everest Agro Suppliers', tags: ['Fertilizers', 'Sprayers', 'Tools'], location: 'Suryabinayak', distanceKm: 1.8 },
    { name: 'Krishi Pasal', tags: ['Seeds', 'Organic Inputs'], location: 'Nagarkot', distanceKm: 2.1 },
  ]);

  console.log('Creating a sample order...');
  const tomato = products.find((p) => p.name === 'Tomato');
  const potato = products.find((p) => p.name === 'Potato');
  await Order.create({
    orderCode: 'KBORD12563',
    buyer: sita._id,
    seller: ravi._id,
    items: [
      { product: tomato._id, name: 'Tomato (Hybrid)', quantity: 50, price: 32 },
      { product: potato._id, name: 'Potato', quantity: 20, price: 60 },
    ],
    totalAmount: 2800,
    paymentMethod: 'eSewa',
    deliveryAddress: 'Bhaktapur, Bhaktapur',
    status: 'Confirmed',
  });

  // Extra random orders across the last 30 days for the admin chart
  console.log('Creating historical orders for analytics...');
  const buyers = await User.find({ role: 'buyer' }).limit(60);
  const bulkOrders = [];
  for (let i = 0; i < 140; i += 1) {
    const daysAgo = Math.floor(Math.random() * 30);
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - daysAgo);
    const buyer = buyers[Math.floor(Math.random() * buyers.length)];
    const product = products[Math.floor(Math.random() * products.length)];
    const quantity = 5 + Math.floor(Math.random() * 50);
    bulkOrders.push({
      orderCode: `KBORD${10000 + i}`,
      buyer: buyer._id,
      seller: ravi._id,
      items: [{ product: product._id, name: product.name, quantity, price: product.pricePerKg }],
      totalAmount: quantity * product.pricePerKg,
      deliveryAddress: buyer.location || 'Kathmandu',
      status: 'Delivered',
      createdAt,
    });
  }
  await Order.insertMany(bulkOrders);

  console.log('Seed complete.');
  console.log('Login as farmer: ravi@krishibandu.com / password123');
  console.log('Login as buyer:  sita@krishibandu.com / password123');
  console.log('Login as admin:  admin@krishibandu.com / password123');

  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
