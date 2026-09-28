import { Request, Response, NextFunction } from 'express';
import { tokenService, TokenPayload } from '../auth/tokenService';
import { prisma } from '../config/prisma';

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    let token: string | undefined;

    // Check Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7).trim();
    } else if (req.cookies && req.cookies.lp_auth) {
      token = req.cookies.lp_auth;
    }

    if (!token) {
      res.status(401).json({
        success: false,
        error: 'Authentication required. Please log in to proceed.',
      });
      return;
    }

    let payload: TokenPayload;
    try {
      payload = tokenService.verifyToken(token);
    } catch (err) {
      res.status(401).json({
        success: false,
        error: 'Invalid or expired session token. Please log in again.',
      });
      return;
    }

    // Verify user in DB
    const user = await prisma.user.findUnique({
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
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: 'Authentication verification failure.',
    });
  }
}
