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

/**
 * A middleware function that checks if the user's role is in the allowed roles.
 * If the user's role is not in the allowed roles, it throws an UnauthorizedException.
 * 
 * @param {string[]} allowedRoles - An array of allowed roles.
 * 
 * @returns {(req: import('express').Request, res: import('express').Response, next: import('express').NextFunction) => void} - A middleware function.
 */
export const roleMiddleware = async (allowedRoles = []) => (req, res, next) => {
  try {
    if(!req.user) {
      throw new UnauthorizedException('Unauthorized');
    }

    if(!allowedRoles.includes(req.user.role)) {
      throw new UnauthorizedException('Unauthorized');
    }

    next();

  } catch (error) {
    logger.error(error);
    throw error;
  }
};
