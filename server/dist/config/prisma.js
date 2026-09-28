"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
require("./env");
const client_1 = require("@prisma/client");
const logger_1 = require("../utils/logger");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
function resolveDbUrl() {
    const url = process.env.DATABASE_URL;
    if (!url)
        return undefined;
    if (url.startsWith('file:')) {
        const rawPath = url.slice(5);
        if (path_1.default.isAbsolute(rawPath)) {
            return `file:${rawPath.replace(/\\/g, '/')}`;
        }
        const prismaDirDb = path_1.default.resolve(__dirname, '../../../prisma/dev.db');
        if (fs_1.default.existsSync(prismaDirDb)) {
            return `file:${prismaDirDb.replace(/\\/g, '/')}`;
        }
        const cwdDb = path_1.default.resolve(process.cwd(), rawPath);
        return `file:${cwdDb.replace(/\\/g, '/')}`;
    }
    return url;
}
const dbUrl = resolveDbUrl();
exports.prisma = global.prismaGlobal ||
    new client_1.PrismaClient({
        datasources: dbUrl ? { db: { url: dbUrl } } : undefined,
        log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
    });
if (process.env.NODE_ENV !== 'production') {
    global.prismaGlobal = exports.prisma;
}
logger_1.logger.info('Prisma client initialized');
