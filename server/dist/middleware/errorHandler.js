"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const logger_1 = require("../utils/logger");
function errorHandler(err, _req, res, _next) {
    const statusCode = err.statusCode || err.status || 500;
    const message = err.message || 'Internal Server Error';
    logger_1.logger.error(`[Error] ${statusCode} - ${message}`, {
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
    res.status(statusCode).json({
        success: false,
        error: message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
}
