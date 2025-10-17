import jwt from 'jsonwebtoken';
import 'dotenv/config';
import logger from '#config/logger';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

export const jwttoken = {
  
  /**
   * Generates a JWT token based on the given payload.
   * @param {Object} [payload={}] - Payload to be signed.
   * @returns {string} - Signed JWT token.
   * @throws {Error} - If an error occurs while signing the token.
   */
  sign: (payload = {}) => {
    try {
      return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
      });
    } catch (error) {
      logger.error(error);
    }
  },

  /**
   * Verifies a JWT token with the given secret.
   * @param {string} [token=''] - JWT token to be verified.
   * @returns {Object} - Verified payload.
   * @throws {Error} - If an error occurs while verifying the token.
   */
  verify: (token = '') => {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      logger.error(error);
    }
  },
};