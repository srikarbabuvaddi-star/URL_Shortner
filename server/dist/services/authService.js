"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = require("../config/prisma");
const tokenService_1 = require("../auth/tokenService");
const env_1 = require("../config/env");
exports.authService = {
    async register(data) {
        const existing = await prisma_1.prisma.user.findUnique({
            where: { email: data.email.toLowerCase() },
        });
        if (existing) {
            throw new Error('An account with this email address already exists.');
        }
        const salt = await bcryptjs_1.default.genSalt(12);
        const passwordHash = await bcryptjs_1.default.hash(data.password, salt);
        // Auto-promote to admin if email matches ADMIN_EMAIL in environment
        const role = data.email.toLowerCase() === env_1.env.ADMIN_EMAIL.toLowerCase() ? 'ADMIN' : 'USER';
        const user = await prisma_1.prisma.user.create({
            data: {
                name: data.name.trim(),
                email: data.email.toLowerCase().trim(),
                passwordHash,
                role,
                status: 'ACTIVE',
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                status: true,
                createdAt: true,
            },
        });
        const token = tokenService_1.tokenService.signToken({
            userId: user.id,
            email: user.email,
            role: user.role,
        });
        return { user, token };
    },
    async login(data) {
        const user = await prisma_1.prisma.user.findUnique({
            where: { email: data.email.toLowerCase().trim() },
        });
        if (!user) {
            throw new Error('Invalid email or password.');
        }
        if (user.status === 'SUSPENDED') {
            throw new Error('Your account has been suspended. Please contact support.');
        }
        const isMatch = await bcryptjs_1.default.compare(data.password, user.passwordHash);
        if (!isMatch) {
            throw new Error('Invalid email or password.');
        }
        const token = tokenService_1.tokenService.signToken({
            userId: user.id,
            email: user.email,
            role: user.role,
        });
        const sanitizedUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status,
            createdAt: user.createdAt,
        };
        return { user: sanitizedUser, token };
    },
    async getMe(userId) {
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                status: true,
                createdAt: true,
                _count: {
                    select: {
                        links: true,
                        campaigns: true,
                    },
                },
            },
        });
        if (!user) {
            throw new Error('User not found.');
        }
        return user;
    },
    async updateProfile(userId, data) {
        const user = await prisma_1.prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new Error('User not found.');
        }
        const updateData = {};
        if (data.name) {
            updateData.name = data.name.trim();
        }
        if (data.newPassword) {
            if (!data.currentPassword) {
                throw new Error('Current password is required to set a new password.');
            }
            const isMatch = await bcryptjs_1.default.compare(data.currentPassword, user.passwordHash);
            if (!isMatch) {
                throw new Error('Current password does not match.');
            }
            const salt = await bcryptjs_1.default.genSalt(12);
            updateData.passwordHash = await bcryptjs_1.default.hash(data.newPassword, salt);
        }
        const updatedUser = await prisma_1.prisma.user.update({
            where: { id: userId },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                status: true,
                updatedAt: true,
            },
        });
        return updatedUser;
    },
};
