import bcrypt from 'bcryptjs';
import { prisma } from '../config/prisma';
import { tokenService } from '../auth/tokenService';
import { env } from '../config/env';

export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export const authService = {
  async register(data: RegisterDTO) {
    const existing = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });

    if (existing) {
      throw new Error('An account with this email address already exists.');
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(data.password, salt);

    // Auto-promote to admin if email matches ADMIN_EMAIL in environment
    const role = data.email.toLowerCase() === env.ADMIN_EMAIL.toLowerCase() ? 'ADMIN' : 'USER';

    const user = await prisma.user.create({
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

    const token = tokenService.signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return { user, token };
  },

  async login(data: LoginDTO) {
    const user = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase().trim() },
    });

    if (!user) {
      throw new Error('Invalid email or password.');
    }

    if (user.status === 'SUSPENDED') {
      throw new Error('Your account has been suspended. Please contact support.');
    }

    const isMatch = await bcrypt.compare(data.password, user.passwordHash);
    if (!isMatch) {
      throw new Error('Invalid email or password.');
    }

    const token = tokenService.signToken({
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

  async getMe(userId: string) {
    const user = await prisma.user.findUnique({
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

  async updateProfile(userId: string, data: { name?: string; currentPassword?: string; newPassword?: string }) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found.');
    }

    const updateData: any = {};

    if (data.name) {
      updateData.name = data.name.trim();
    }

    if (data.newPassword) {
      if (!data.currentPassword) {
        throw new Error('Current password is required to set a new password.');
      }
      const isMatch = await bcrypt.compare(data.currentPassword, user.passwordHash);
      if (!isMatch) {
        throw new Error('Current password does not match.');
      }
      const salt = await bcrypt.genSalt(12);
      updateData.passwordHash = await bcrypt.hash(data.newPassword, salt);
    }

    const updatedUser = await prisma.user.update({
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
