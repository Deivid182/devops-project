import logger from '#config/logger';
import { hashPassword } from '#utils/hash-password';
import { db } from '#config/database';
import { eq } from 'drizzle-orm';
import { users } from '#models/user.model';
import { ConflictException } from '#exceptions/index';
import { jwttoken } from '#utils/jwt';
import { cookies } from '#utils/cookies';

export class AuthService {
  
  /**
   * Creates a new user.
   * 
   * @param {Object} payload
   * @param {Object} payload.userData
   * @param {string} payload.userData.name
   * @param {string} payload.userData.email
   * @param {string} payload.userData.password
   * @param {string} payload.userData.role
   * @param {import('express').Response} payload.res
   * 
   * @throws {ConflictException} If a user with the same email already exists.
   * @throws {InternalServerErrorException} If an error occurs while creating a new user.
   * 
   */
  static async createUser(payload) {
    const { userData, res } = payload;

    try {
      const existingUser = await db.select().from(users).where(eq(users.email, userData.email)).limit(1);

      if(existingUser.length) {
        throw new ConflictException('User already exists');
      }

      const hashedPassword = await hashPassword(userData.password);

      const [newUser] = await db.insert(users).values({ ...userData, password: hashedPassword }).returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
      });

      const { id, name, email, role } = newUser;
      logger.info(`User created successfully: ${email}`);

      const token = jwttoken.sign({ id, email, role, name });

      cookies.set(res, 'token', token);

      return newUser;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }
}