"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = void 0;
exports.requireRole = requireRole;
function requireRole(allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({
                success: false,
                error: 'Authentication required before checking permissions.',
            });
            return;
        }
        if (!allowedRoles.includes(req.user.role)) {
            res.status(403).json({
                success: false,
                error: 'Forbidden: You do not possess the required permissions to access this platform resource.',
            });
            return;
        }
        next();
    };
}
exports.requireAdmin = requireRole(['ADMIN']);
