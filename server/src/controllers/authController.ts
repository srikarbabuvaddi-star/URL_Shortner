import { Request, Response } from 'express';
import { authService } from '../services/authService';

export const authController = {
  async register(req: Request, res: Response) {
    try {
      const { user, token } = await authService.register(req.body);

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
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  },

  async login(req: Request, res: Response) {
    try {
      const { user, token } = await authService.login(req.body);

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
    } catch (err: any) {
      res.status(401).json({ success: false, error: err.message });
    }
  },

  async logout(req: Request, res: Response) {
    res.clearCookie('lp_auth');
    res.status(200).json({ success: true, message: 'Successfully logged out.' });
  },

  async getMe(req: Request, res: Response) {
    try {
      const user = await authService.getMe(req.user!.id);
      res.status(200).json({ success: true, user });
    } catch (err: any) {
      res.status(404).json({ success: false, error: err.message });
    }
  },

  async updateProfile(req: Request, res: Response) {
    try {
      const updated = await authService.updateProfile(req.user!.id, req.body);
      res.status(200).json({
        success: true,
        user: updated,
        message: 'Profile updated successfully.',
      });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  },
};
