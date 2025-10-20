// import { HttpStatus } from '#common/http-status/index';
import logger from '#config/logger';
import {
  InternalServerErrorException,
  UnauthorizedException,
} from '#exceptions/index';
// import { UnauthorizedException } from '#exceptions/index';
/**
 * A middleware function that checks if the user's role is in the allowed roles.
 * If the user's role is not in the allowed roles, it throws an UnauthorizedException.
 *
 * @param {string[]} allowedRoles - An array of allowed roles.
 *
 * @throws {UnauthorizedException} If the user's role is not in the allowed roles.
 *
 * @returns {(req: import('express').Request, res: import('express').Response, next: import('express').NextFunction) => void} - A middleware function.
 */
export function roleMiddleware(allowedRoles = []) {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        // return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized' });
        throw new UnauthorizedException('Unauthorized');
      }

      if (!allowedRoles.includes(req.user.role)) {
        // return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized' });
        throw new UnauthorizedException('Unauthorized');
      }
      next();
    } catch (error) {
      logger.error(error);
      // return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
      throw new InternalServerErrorException('Internal server error');
    }
  };
}
