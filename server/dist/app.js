"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const env_1 = require("./config/env");
const index_1 = __importDefault(require("./routes/index"));
const redirectRoutes_1 = __importDefault(require("./routes/redirectRoutes"));
const errorHandler_1 = require("./middleware/errorHandler");
const logger_1 = require("./utils/logger");
function createApp() {
    const app = (0, express_1.default)();
    // Security Headers
    app.use((0, helmet_1.default)({
        crossOriginResourcePolicy: { policy: 'cross-origin' },
        contentSecurityPolicy: false, // Allows flexible embeds in local dev and previews
    }));
    // CORS configuration
    const allowedOrigins = [
        env_1.env.FRONTEND_URL,
        'http://localhost:5173',
        'http://localhost:3000',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:3000',
    ].filter(Boolean);
    app.use((0, cors_1.default)({
        origin: (origin, callback) => {
            // Allow requests with no origin (like mobile apps, curl, server-to-server)
            if (!origin)
                return callback(null, true);
            if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
                return callback(null, true);
            }
            return callback(null, true); // Permissive for local dev
        },
        credentials: true,
        methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    }));
    // Parsers
    app.use(express_1.default.json({ limit: '2mb' }));
    app.use(express_1.default.urlencoded({ extended: true, limit: '2mb' }));
    app.use((0, cookie_parser_1.default)());
    // Request logger in dev
    app.use((req, _res, next) => {
        logger_1.logger.debug(`${req.method} ${req.url}`);
        next();
    });
    // Mount API endpoints
    app.use('/api', index_1.default);
    // Fallback 404 for unmatched API routes
    app.all('/api/*', (_req, res) => {
        res.status(404).json({ success: false, error: 'API endpoint not found' });
    });
    // Serve static assets from frontend dist if built
    const distPath = path_1.default.resolve(__dirname, '../../dist');
    const indexHtml = path_1.default.join(distPath, 'index.html');
    const hasFrontend = fs_1.default.existsSync(indexHtml);
    if (hasFrontend) {
        app.use(express_1.default.static(distPath));
    }
    // Mount short URL redirect route
    app.use('/', redirectRoutes_1.default);
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
    app.use(errorHandler_1.errorHandler);
    return app;
}
