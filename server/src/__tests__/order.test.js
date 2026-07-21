import { beforeAll, afterAll, beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

process.env.JWT_SECRET = 'test_jwt_secret_at_least_16_chars_long';
process.env.CLIENT_ORIGIN = 'http://localhost:5173';
process.env.BCRYPT_SALT_ROUNDS = '4';

const { createApp } = await import('../app.js');
const { default: User } = await import('../models/User.js');
const { default: Product } = await import('../models/Product.js');
const { default: Order } = await import('../models/Order.js');

let mongod;
let app;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
  app = createApp();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

beforeEach(async () => {
  await User.deleteMany({});
  await Product.deleteMany({});
  await Order.deleteMany({});
});

async function registerAndLogin(overrides = {}) {
  const email = overrides.email;
  const password = overrides.password || 'password123';
  await request(app)
    .post('/api/auth/register')
    .send({ name: 'Test User', password, ...overrides });
  await User.updateOne({ email }, { approvalStatus: 'approved' });
  const res = await request(app).post('/api/auth/login').send({ email, password });
  return res.body.token;
}

async function createListing(sellerToken, overrides = {}) {
  const res = await request(app)
    .post('/api/products')
    .set('Authorization', `Bearer ${sellerToken}`)
    .send({
      name: 'Cauliflower',
      description: 'Fresh cauliflower.',
      category: 'Crops',
      pricePerKg: 48,
      availableQty: 150,
      ...overrides,
    });
  return res.body;
}

describe('POST /api/orders (stock enforcement)', () => {
  it('rejects an order that exceeds available stock', async () => {
    const sellerToken = await registerAndLogin({ email: 'seller@example.com', role: 'farmer' });
    const buyerToken = await registerAndLogin({ email: 'buyer@example.com', role: 'buyer' });
    const product = await createListing(sellerToken, { availableQty: 150 });

    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${buyerToken}`)
      .send({
        items: [{ product: product._id, quantity: 153 }],
        deliveryAddress: 'Kathmandu',
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/only 150/i);

    const unchanged = await Product.findById(product._id);
    expect(unchanged.availableQty).toBe(150);
  });

  it('decrements stock after a successful order', async () => {
    const sellerToken = await registerAndLogin({ email: 'seller@example.com', role: 'farmer' });
    const buyerToken = await registerAndLogin({ email: 'buyer@example.com', role: 'buyer' });
    const product = await createListing(sellerToken, { availableQty: 150 });

    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${buyerToken}`)
      .send({
        items: [{ product: product._id, quantity: 150 }],
        deliveryAddress: 'Kathmandu',
      });

    expect(res.status).toBe(201);

    const updated = await Product.findById(product._id);
    expect(updated.availableQty).toBe(0);
  });

  it('rejects a zero or negative quantity', async () => {
    const sellerToken = await registerAndLogin({ email: 'seller@example.com', role: 'farmer' });
    const buyerToken = await registerAndLogin({ email: 'buyer@example.com', role: 'buyer' });
    const product = await createListing(sellerToken, { availableQty: 150 });

    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${buyerToken}`)
      .send({
        items: [{ product: product._id, quantity: 0 }],
        deliveryAddress: 'Kathmandu',
      });

    expect(res.status).toBe(400);
  });

  it('does not let a second buyer over-order the remaining stock after a first order', async () => {
    const sellerToken = await registerAndLogin({ email: 'seller@example.com', role: 'farmer' });
    const buyerA = await registerAndLogin({ email: 'buyer-a@example.com', role: 'buyer' });
    const buyerB = await registerAndLogin({ email: 'buyer-b@example.com', role: 'buyer' });
    const product = await createListing(sellerToken, { availableQty: 100 });

    const first = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${buyerA}`)
      .send({ items: [{ product: product._id, quantity: 80 }], deliveryAddress: 'Kathmandu' });
    expect(first.status).toBe(201);

    const second = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${buyerB}`)
      .send({ items: [{ product: product._id, quantity: 30 }], deliveryAddress: 'Lalitpur' });
    expect(second.status).toBe(400);

    const remaining = await Product.findById(product._id);
    expect(remaining.availableQty).toBe(20);
  });
});
