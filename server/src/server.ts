import { createApp } from './app';
import { env } from './config/env';
import { logger } from './utils/logger';
import { prisma } from './config/prisma';
import { queueService } from './services/queueService';

const app = createApp();

const HOST = '0.0.0.0';

const server = app.listen(env.PORT, HOST, () => {
  logger.info(`🚀 LinkPulse Server running on http://${HOST}:${env.PORT}`);
  logger.info(`🌐 API available at ${env.APP_URL}/api`);
  logger.info(`🔗 Redirect engine active at ${env.APP_URL}/:shortCode`);
  logger.info(`✨ Frontend expected at ${env.FRONTEND_URL}`);
});

server.on('error', (err: any) => {
  logger.error('Fatal Server Error:', err);
  process.exit(1);
});

process.on('uncaughtException', (err: any) => {
  logger.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason: any) => {
  logger.error('Unhandled Rejection:', reason);
});

// Graceful shutdown handling
async function gracefulShutdown(signal: string) {
  logger.info(`Received ${signal}. Shutting down gracefully...`);

  // Drain analytics queue
  try {
    logger.info('Draining pending analytics events...');
    await queueService.drain();
  } catch (err: any) {
    logger.error('Error draining queue:', err.message);
  }

  server.close(async () => {
    logger.info('HTTP server closed.');
    await prisma.$disconnect();
    logger.info('Database connection closed.');
    process.exit(0);
  });

  // Force exit if not completed within 5 seconds
  setTimeout(() => {
    logger.error('Forced shutdown due to timeout.');
    process.exit(1);
  }, 5000);
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
