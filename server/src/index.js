import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';

import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.routes.js';
import orderRoutes from './routes/order.routes.js';
import cropRecordRoutes from './routes/cropRecord.routes.js';
import advisoryRoutes from './routes/advisory.routes.js';
import serviceRoutes from './routes/service.routes.js';
import shopRoutes from './routes/shop.routes.js';
import adminRoutes from './routes/admin.routes.js';

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/crop-records', cropRecordRoutes);
app.use('/api/advisories', advisoryRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/shops', shopRoutes);
app.use('/api/admin', adminRoutes);

app.use((req, res) => res.status(404).json({ message: 'Not found' }));

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Krishi Bandu API running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
  });
