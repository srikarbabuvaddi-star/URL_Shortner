import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import path from 'path';
import fs from 'fs';
import { env } from './config/env';
import apiRoutes from './routes/index';
import redirectRoutes from './routes/redirectRoutes';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';

export function createApp(): Express {
  const app = express();

  // Security Headers
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      contentSecurityPolicy: false, // Allows flexible embeds in local dev and previews
    })
  );

  // CORS configuration
  const allowedOrigins = [
    env.FRONTEND_URL,
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000',
  ].filter(Boolean);

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, server-to-server)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
          return callback(null, true);
        }
        return callback(null, true); // Permissive for local dev
      },
      credentials: true,
      methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    })
  );

  // Parsers
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true, limit: '2mb' }));
  app.use(cookieParser());

  // Request logger in dev
  app.use((req, _res, next) => {
    logger.debug(`${req.method} ${req.url}`);
    next();
  });

  // Mount API endpoints
  app.use('/api', apiRoutes);

  // Fallback 404 for unmatched API routes
  app.all('/api/*', (_req, res) => {
    res.status(404).json({ success: false, error: 'API endpoint not found' });
  });

  // Serve static assets from frontend dist if built
  const distPath = path.resolve(__dirname, '../../dist');
  const indexHtml = path.join(distPath, 'index.html');
  const hasFrontend = fs.existsSync(indexHtml);

  if (hasFrontend) {
    app.use(express.static(distPath));
  }

  // Mount short URL redirect route
  app.use('/', redirectRoutes);

  // If frontend dist is available, serve SPA index.html for all non-API GET requests
  if (hasFrontend) {
    app.get('*', (req, res, next) => {
      if (req.method !== 'GET' || req.path.startsWith('/api')) {
        return next();
      }
      res.sendFile(indexHtml);
    });
  }

  // Central error handling middleware
  app.use(errorHandler);

  return app;
}
