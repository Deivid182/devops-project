import jwt from 'jsonwebtoken';
import logger from '#config/logger';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

export const jwttoken = {
  sign: (payload = {}) => {
    try {
      return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
      });
    } catch (error) {
      logger.error(error);
    }
  },

  verify: (token = '') => {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      logger.error(error);
    }
  },
};