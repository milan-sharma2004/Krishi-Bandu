import path from 'path';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import { sanitizeBody } from './utils/sanitize.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.routes.js';
import orderRoutes from './routes/order.routes.js';
import cropRecordRoutes from './routes/cropRecord.routes.js';
import advisoryRoutes from './routes/advisory.routes.js';
import serviceRoutes from './routes/service.routes.js';
import shopRoutes from './routes/shop.routes.js';
import adminRoutes from './routes/admin.routes.js';
import weatherRoutes from './routes/weather.routes.js';
import recommendationRoutes from './routes/recommendation.routes.js';
import uploadRoutes from './routes/upload.routes.js';

export function createApp() {
  const app = express();

  if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
  }

  const allowedOrigins = [
  'http://localhost:5173',
  'https://krishibandu.com',
  'https://www.krishibandu.com',
  'https://krishi-bandu.pages.dev',
  'https://55fac563.krishi-bandu.pages.dev',
  ...(process.env.CLIENT_ORIGIN || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
];

app.use(helmet());

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.error('Blocked by CORS:', origin);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));
  app.use(sanitizeBody);
  app.use('/uploads', express.static(path.resolve('uploads')));

  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      dbConnected: mongoose.connection.readyState === 1,
      timestamp: new Date().toISOString(),
    });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/crop-records', cropRecordRoutes);
  app.use('/api/advisories', advisoryRoutes);
  app.use('/api/services', serviceRoutes);
  app.use('/api/shops', shopRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/weather', weatherRoutes);
  app.use('/api/recommendations', recommendationRoutes);
  app.use('/api/uploads', uploadRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
