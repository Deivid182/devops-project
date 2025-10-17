import { jwttoken } from '#utils/jwt';
import { cookies } from '#utils/cookies';
import { UnauthorizedException } from '#exceptions/index';
import { users } from '#models/user.model';
import logger from '#config/logger';
import { db } from '#config/database';
import { eq } from 'drizzle-orm';
/**
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
 * @returns {import('express').NextFunction}
 */

export async function authMiddleware(req, res, next) {
  const token = cookies.get(req, 'auth');
  console.log({token});

  if(!token) {
    throw new UnauthorizedException('Unauthorized');
  }

  try {
    const decoded = jwttoken.verify(token);

    if(!decoded) {
      throw new UnauthorizedException('Unauthorized');
    }

    const [user] = await db.select().from(users).where(eq(users.id, decoded.id)).limit(1);

    if(!user) {
      throw new UnauthorizedException('Unauthorized');
    }

    req.user = user;
    next();
  } catch (error) {
    logger.error(error);
    throw error;
  }
}
