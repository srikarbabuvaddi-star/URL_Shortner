"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queueService = void 0;
const prisma_1 = require("../config/prisma");
const logger_1 = require("../utils/logger");
class QueueService {
    inMemoryQueue = [];
    isProcessing = false;
    batchSize = 50;
    constructor() {
        // Process queue periodically or when items arrive
        setInterval(() => {
            this.processBatch().catch((err) => {
                logger_1.logger.error('[Queue] Error in periodic batch processing:', err);
            });
        }, 500);
    }
    /**
     * Enqueues an analytics event for asynchronous background processing
     */
    enqueueAnalytics(event) {
        this.inMemoryQueue.push(event);
        // If queue is getting full, trigger process immediately
        if (this.inMemoryQueue.length >= this.batchSize) {
            setImmediate(() => {
                this.processBatch().catch((err) => {
                    logger_1.logger.error('[Queue] Immediate batch processing error:', err);
                });
            });
        }
    }
    /**
     * Processes a batch of analytics events from the queue
     */
    async processBatch() {
        if (this.isProcessing || this.inMemoryQueue.length === 0) {
            return;
        }
        this.isProcessing = true;
        const batch = this.inMemoryQueue.splice(0, this.batchSize);
        try {
            // 1. Bulk insert analytics events
            await prisma_1.prisma.analyticsEvent.createMany({
                data: batch.map((item) => ({
                    linkId: item.linkId,
                    campaignId: item.campaignId || null,
                    timestamp: item.timestamp || new Date(),
                    visitorId: item.visitorId,
                    ipHash: item.ipHash,
                    country: item.country || null,
                    region: item.region || null,
                    city: item.city || null,
                    deviceType: item.deviceType || null,
                    browser: item.browser || null,
                    browserVersion: item.browserVersion || null,
                    os: item.os || null,
                    osVersion: item.osVersion || null,
                    referrer: item.referrer || null,
                    userAgent: item.userAgent || null,
                    isBot: item.isBot || false,
                    statusCode: item.statusCode || 302,
                })),
            });
            // 2. Update lastClickedAt on affected links
            const uniqueLinkIds = Array.from(new Set(batch.map((b) => b.linkId)));
            const now = new Date();
            await prisma_1.prisma.link.updateMany({
                where: {
                    id: {
                        in: uniqueLinkIds,
                    },
                },
                data: {
                    lastClickedAt: now,
                },
            });
            logger_1.logger.debug(`[Queue] Processed ${batch.length} analytics events successfully.`);
        }
        catch (err) {
            logger_1.logger.error('[Queue] Failed to process analytics batch:', err.message);
            // Re-queue items that failed (up to a limit to prevent memory leak)
            if (this.inMemoryQueue.length < 1000) {
                this.inMemoryQueue.unshift(...batch);
            }
        }
        finally {
            this.isProcessing = false;
        }
    }
    /**
     * Drains the queue completely (useful for tests or graceful shutdown)
     */
    async drain() {
        while (this.inMemoryQueue.length > 0) {
            await this.processBatch();
        }
    }
    getQueueLength() {
        return this.inMemoryQueue.length;
    }
}
exports.queueService = new QueueService();
