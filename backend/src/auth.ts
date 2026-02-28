import { Request } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload } from './types';

const secret = process.env.JWT_SECRET || 'dev-secret-change-me';

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, secret, { expiresIn: '7d' });
}

export function verifyToken(token: string): JwtPayload {
  const decoded = jwt.verify(token, secret) as JwtPayload;
  return decoded;
}

export function getAuthToken(req: Request): string | null {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return null;
  return auth.slice(7);
}

export function requireAuth(req: Request): JwtPayload {
  const token = getAuthToken(req);
  if (!token) {
    const err = new Error('Unauthorized');
    (err as any).status = 401;
    throw err;
  }
  return verifyToken(token);
}
