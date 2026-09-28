"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const env_1 = require("./config/env");
const logger_1 = require("./utils/logger");
const prisma_1 = require("./config/prisma");
const queueService_1 = require("./services/queueService");
const app = (0, app_1.createApp)();
const HOST = '0.0.0.0';
const server = app.listen(env_1.env.PORT, HOST, () => {
    logger_1.logger.info(`🚀 LinkPulse Server running on http://${HOST}:${env_1.env.PORT}`);
    logger_1.logger.info(`🌐 API available at ${env_1.env.APP_URL}/api`);
    logger_1.logger.info(`🔗 Redirect engine active at ${env_1.env.APP_URL}/:shortCode`);
    logger_1.logger.info(`✨ Frontend expected at ${env_1.env.FRONTEND_URL}`);
});
server.on('error', (err) => {
    logger_1.logger.error('Fatal Server Error:', err);
    process.exit(1);
});
process.on('uncaughtException', (err) => {
    logger_1.logger.error('Uncaught Exception:', err);
});
process.on('unhandledRejection', (reason) => {
    logger_1.logger.error('Unhandled Rejection:', reason);
});
// Graceful shutdown handling
async function gracefulShutdown(signal) {
    logger_1.logger.info(`Received ${signal}. Shutting down gracefully...`);
    // Drain analytics queue
    try {
        logger_1.logger.info('Draining pending analytics events...');
        await queueService_1.queueService.drain();
    }
    catch (err) {
        logger_1.logger.error('Error draining queue:', err.message);
    }
    server.close(async () => {
        logger_1.logger.info('HTTP server closed.');
        await prisma_1.prisma.$disconnect();
        logger_1.logger.info('Database connection closed.');
        process.exit(0);
    });
    // Force exit if not completed within 5 seconds
    setTimeout(() => {
        logger_1.logger.error('Forced shutdown due to timeout.');
        process.exit(1);
    }, 5000);
}
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
