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
 * export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const bearer = req.headers.authorization
    if(!bearer) {
        const error = new Error('No Autorizado')
        return res.status(401).json({error: error.message})
    }

    const [, token] = bearer.split(' ')
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        
        if(typeof decoded === 'object' && decoded.id) {
            const user = await User.findById(decoded.id).select('_id name email')
            if(user) {
                req.user = user
                next()
            } else {
                res.status(500).json({error: 'Token No Válido'})
            }
        }
    } catch (error) {
        res.status(500).json({error: 'Token No Válido'})
    }

}
 */