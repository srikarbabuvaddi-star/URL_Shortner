"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const authService_1 = require("../services/authService");
exports.authController = {
    async register(req, res) {
        try {
            const { user, token } = await authService_1.authService.register(req.body);
            // Set cookie as well for browser clients
            res.cookie('lp_auth', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            res.status(201).json({
                success: true,
                user,
                token,
                message: 'Account successfully registered.',
            });
        }
        catch (err) {
            res.status(400).json({ success: false, error: err.message });
        }
    },
    async login(req, res) {
        try {
            const { user, token } = await authService_1.authService.login(req.body);
            res.cookie('lp_auth', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            res.status(200).json({
                success: true,
                user,
                token,
                message: 'Login successful.',
            });
        }
        catch (err) {
            res.status(401).json({ success: false, error: err.message });
        }
    },
    async logout(req, res) {
        res.clearCookie('lp_auth');
        res.status(200).json({ success: true, message: 'Successfully logged out.' });
    },
    async getMe(req, res) {
        try {
            const user = await authService_1.authService.getMe(req.user.id);
            res.status(200).json({ success: true, user });
        }
        catch (err) {
            res.status(404).json({ success: false, error: err.message });
        }
    },
    async updateProfile(req, res) {
        try {
            const updated = await authService_1.authService.updateProfile(req.user.id, req.body);
            res.status(200).json({
                success: true,
                user: updated,
                message: 'Profile updated successfully.',
            });
        }
        catch (err) {
            res.status(400).json({ success: false, error: err.message });
        }
    },
};
