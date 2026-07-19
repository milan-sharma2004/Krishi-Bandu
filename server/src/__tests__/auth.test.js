import { beforeAll, afterAll, beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

process.env.JWT_SECRET = 'test_jwt_secret_at_least_16_chars_long';
process.env.CLIENT_ORIGIN = 'http://localhost:5173';
process.env.BCRYPT_SALT_ROUNDS = '4';

const { createApp } = await import('../app.js');
const { default: User } = await import('../models/User.js');
const { signToken } = await import('../utils/jwt.js');
const bcrypt = (await import('bcryptjs')).default;

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
});

async function registerUser(overrides = {}) {
  return request(app)
    .post('/api/auth/register')
    .send({
      name: 'Ravi Kumar',
      email: 'ravi@example.com',
      password: 'password123',
      role: 'farmer',
      ...overrides,
    });
}

// New registrations are pending until an admin approves them, so most tests
// that need a usable token approve the account directly in the DB first.
async function approveUser(email) {
  await User.updateOne({ email }, { approvalStatus: 'approved' });
}

async function registerAndLogin(overrides = {}) {
  const email = overrides.email || 'ravi@example.com';
  const password = overrides.password || 'password123';
  await registerUser(overrides);
  await approveUser(email);
  const res = await request(app).post('/api/auth/login').send({ email, password });
  return res.body.token;
}

describe('POST /api/auth/register', () => {
  it('registers a new user as pending approval, without issuing a token', async () => {
    const res = await registerUser();
    expect(res.status).toBe(201);
    expect(res.body.token).toBeUndefined();
    expect(res.body.user.email).toBe('ravi@example.com');
    expect(res.body.user.password).toBeUndefined();
    expect(res.body.user.approvalStatus).toBe('pending');

    const stored = await User.findOne({ email: 'ravi@example.com' }).select('+password');
    expect(stored.password).not.toBe('password123');
  });

  it('rejects duplicate registration with 409', async () => {
    await registerUser();
    const res = await registerUser();
    expect(res.status).toBe(409);

    const count = await User.countDocuments({ email: 'ravi@example.com' });
    expect(count).toBe(1);
  });

  it('rejects invalid registration data with 400', async () => {
    const res = await registerUser({ email: 'not-an-email' });
    expect(res.status).toBe(400);
  });

  it('rejects a weak password with 400', async () => {
    const res = await registerUser({ email: 'weak@example.com', password: '123' });
    expect(res.status).toBe(400);
  });
});

describe('POST /api/auth/login', () => {
  it('rejects login while the account is still pending approval', async () => {
    await registerUser();
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'ravi@example.com', password: 'password123' });
    expect(res.status).toBe(403);
    expect(res.body.message).toMatch(/approval/i);
  });

  it('logs in with valid credentials once approved', async () => {
    await registerUser();
    await approveUser('ravi@example.com');
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'ravi@example.com', password: 'password123' });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeTypeOf('string');
    expect(res.body.user.password).toBeUndefined();
  });

  it('rejects invalid credentials with a generic 401 message', async () => {
    await registerUser();
    await approveUser('ravi@example.com');
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'ravi@example.com', password: 'wrongpassword' });
    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/invalid/i);
  });

  it('returns the same generic error for a non-existent email', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nobody@example.com', password: 'password123' });
    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/invalid/i);
  });
});

describe('protected routes', () => {
  it('rejects requests with no token with 401', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  it('rejects requests with an invalid token with 401', async () => {
    const res = await request(app).get('/api/auth/me').set('Authorization', 'Bearer not-a-real-token');
    expect(res.status).toBe(401);
  });

  it('accepts requests with a valid token and returns the current user', async () => {
    const token = await registerAndLogin();

    const res = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe('ravi@example.com');
    expect(res.body.user.password).toBeUndefined();
  });
});

describe('PUT /api/auth/me', () => {
  it('updates editable fields but ignores role escalation attempts', async () => {
    const token = await registerAndLogin();

    const res = await request(app)
      .put('/api/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Ravi Updated', role: 'admin', password: 'hacked1234' });

    expect(res.status).toBe(200);
    expect(res.body.user.name).toBe('Ravi Updated');
    expect(res.body.user.role).toBe('farmer');

    const loginWithOldPassword = await request(app)
      .post('/api/auth/login')
      .send({ email: 'ravi@example.com', password: 'password123' });
    expect(loginWithOldPassword.status).toBe(200);
  });
});

describe('POST /api/auth/change-password', () => {
  it('rejects an incorrect current password', async () => {
    const token = await registerAndLogin();

    const res = await request(app)
      .post('/api/auth/change-password')
      .set('Authorization', `Bearer ${token}`)
      .send({ currentPassword: 'wrongpassword', newPassword: 'newpassword123' });
    expect(res.status).toBe(401);
  });

  it('changes the password and invalidates the old one', async () => {
    const token = await registerAndLogin();

    const changeRes = await request(app)
      .post('/api/auth/change-password')
      .set('Authorization', `Bearer ${token}`)
      .send({ currentPassword: 'password123', newPassword: 'newpassword123' });
    expect(changeRes.status).toBe(200);

    const oldLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'ravi@example.com', password: 'password123' });
    expect(oldLogin.status).toBe(401);

    const newLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'ravi@example.com', password: 'newpassword123' });
    expect(newLogin.status).toBe(200);
  });
});

describe('suspended accounts', () => {
  it('rejects login for a suspended account', async () => {
    await registerUser();
    await approveUser('ravi@example.com');
    await User.updateOne({ email: 'ravi@example.com' }, { status: 'suspended' });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'ravi@example.com', password: 'password123' });
    expect(res.status).toBe(403);
  });

  it('rejects an existing valid token once the account is suspended', async () => {
    const token = await registerAndLogin();
    await User.updateOne({ email: 'ravi@example.com' }, { status: 'suspended' });

    const res = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(401);
  });
});

describe('role-protected routes', () => {
  it('rejects a non-admin user accessing an admin-only route with 403', async () => {
    const token = await registerAndLogin({ role: 'buyer', email: 'buyer@example.com' });

    const res = await request(app).get('/api/admin/overview').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(403);
  });

  it('does not allow self-registration to grant the admin role', async () => {
    const register = await registerUser({ role: 'admin', email: 'wannabe-admin@example.com' });
    expect(register.body.user.role).not.toBe('admin');
  });

  it('allows an admin user to access an admin-only route', async () => {
    const passwordHash = await bcrypt.hash('password123', 4);
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: passwordHash,
      role: 'admin',
    });
    const token = signToken(admin);

    const res = await request(app).get('/api/admin/overview').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
  });
});
