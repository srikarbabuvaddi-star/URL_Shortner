"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
const tokenService_1 = require("../auth/tokenService");
const prisma_1 = require("../config/prisma");
async function requireAuth(req, res, next) {
    try {
        let token;
        // Check Authorization header
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7).trim();
        }
        else if (req.cookies && req.cookies.lp_auth) {
            token = req.cookies.lp_auth;
        }
        if (!token) {
            res.status(401).json({
                success: false,
                error: 'Authentication required. Please log in to proceed.',
            });
            return;
        }
        let payload;
        try {
            payload = tokenService_1.tokenService.verifyToken(token);
        }
        catch (err) {
            res.status(401).json({
                success: false,
                error: 'Invalid or expired session token. Please log in again.',
            });
            return;
        }
        // Verify user in DB
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: payload.userId },
            select: { id: true, name: true, email: true, role: true, status: true },
        });
        if (!user) {
            res.status(401).json({
                success: false,
                error: 'User account not found.',
            });
            return;
        }
        if (user.status === 'SUSPENDED') {
            res.status(403).json({
                success: false,
                error: 'Your account has been suspended by an administrator.',
            });
            return;
        }
        req.user = user;
        next();
    }
    catch (err) {
        res.status(500).json({
            success: false,
            error: 'Authentication verification failure.',
        });
    }
}
