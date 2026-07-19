import 'dotenv/config';
import mongoose from 'mongoose';
import { validateEnv } from './config/env.js';
import { connectDB } from './config/db.js';
import { createApp } from './app.js';

validateEnv();

const app = createApp();
const PORT = process.env.PORT || 5050;

let server;

connectDB()
  .then(() => {
    server = app.listen(PORT, () => console.log(`Krishi Bandu API running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
  });

function shutdown(signal) {
  console.log(`${signal} received, shutting down gracefully...`);
  if (server) {
    server.close(() => {
      mongoose.connection.close(false).then(() => process.exit(0));
    });
  } else {
    process.exit(0);
  }
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled promise rejection:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
  process.exit(1);
});
