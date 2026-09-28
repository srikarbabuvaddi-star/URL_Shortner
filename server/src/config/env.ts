import dotenv from 'dotenv';
import path from 'path';

// Load .env from workspace root or current directory
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'file:./dev.db';
}

export const env = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || 'file:./dev.db',
  REDIS_URL: process.env.REDIS_URL || '',
  JWT_SECRET: process.env.JWT_SECRET || 'linkpulse_default_jwt_secret_key_2026',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  ANALYTICS_HASH_SECRET: process.env.ANALYTICS_HASH_SECRET || 'linkpulse_salt_2026',
  APP_URL: process.env.APP_URL || 'http://localhost:5000',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  ADMIN_NAME: process.env.ADMIN_NAME || 'System Administrator',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@linkpulse.io',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'AdminPassword2026!',
  IP_GEOLOCATION_API_KEY: process.env.IP_GEOLOCATION_API_KEY || '',
};
