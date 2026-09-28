"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load .env from workspace root or current directory
dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), '.env') });
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
dotenv_1.default.config();
if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = 'file:./dev.db';
}
exports.env = {
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
