import { HttpStatus } from '#common/http-status/index';
import aj from '#config/arcject';
import logger from '#config/logger';
import { slidingWindow } from '@arcjet/node';

/**
 * Security middleware using Arcjet.
 *
 * This middleware checks if the incoming request is valid according to Arcjet rules.
 * If the request is valid, it calls next() to continue the request flow.
 * If the request is invalid, it catches the error and returns a 500 status code with an "Internal server error" message.
 *
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object.
 * @param {import('express').NextFunction} next - The next middleware function.
 * @returns {void}
 */
export async function securityMiddleware(req, res, next) {
  try {
    const role = req.user?.role ?? 'guest';

    let limit = 0;
    // let message = '';

    switch (role) {
      case 'user':
        limit = 10;
        // message = 'User limit exceeded';
        break;
      case 'admin':
        limit = 20;
        // message = 'Admin limit exceeded';
        break;

      case 'guest':
        limit = 5;
        // message = 'Guest limit exceeded';
        break;
      default:
        limit = 5;
        // message = 'Default limit exceeded';
        break;
    }

    const client = aj.withRule(
      slidingWindow({
        mode: 'LIVE',
        interval: '1m',
        max: limit,
        name: `${role}-rate-limit`,
      })
    );
    const decision = await client.protect(req);
    console.log({ decision });

    if (decision.isDenied() && decision.reason.isBot()) {
      logger.warn('Bot request blocked', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        path: req.path,
      });

      return res.status(HttpStatus.TOO_MANY_REQUESTS).json({
        error: 'Forbidden',
        message: 'Automated requests are not allowed',
      });
    }

    if (decision.isDenied() && decision.reason.isShield()) {
      logger.warn('Shield Blocked request', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        path: req.path,
        method: req.method,
      });

      return res.status(HttpStatus.TOO_MANY_REQUESTS).json({
        error: 'Forbidden',
        message: 'Request blocked by security policy',
      });
    }

    if (decision.isDenied() && decision.reason.isRateLimit()) {
      logger.warn('Rate limit exceeded', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        path: req.path,
      });

      return res
        .status(HttpStatus.TOO_MANY_REQUESTS)
        .json({ error: 'Forbidden', message: 'Too many requests' });
    }

    next();
  } catch (error) {
    console.log('Arject middleware error: ', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
