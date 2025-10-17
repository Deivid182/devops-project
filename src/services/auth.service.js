import logger from '#config/logger';
import { hashPassword } from '#utils/hash-password';
import { db } from '#config/database';
import { eq } from 'drizzle-orm';
import { users } from '#models/user.model';
import { ConflictException, UnauthorizedException } from '#exceptions/index';
import { jwttoken } from '#utils/jwt';
import { cookies } from '#utils/cookies';
import { comparePassword } from '#utils/compare-password';

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

  /**
   * Creates a new user.
   * 
   * @param {Object} payload
   * @param {Object} payload.userData
   * @param {string} payload.userData.email
   * @param {string} payload.userData.password
   * @param {import('express').Response} payload.res
   * 
   * @throws {ConflictException} If a user with the same email already exists.
   * @throws {InternalServerErrorException} If an error occurs while creating a new user.
   * 
   */

  static async login(payload) {
    const { userData: { email, password }, res } = payload;

    try {
      // check if user exists

      const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

      if(!user) {
        throw new UnauthorizedException('Verify your credentials and try again');
      }

      // check if password is correct
      const isCorrectPassword = await comparePassword(password, user.password);

      if(!isCorrectPassword) {
        throw new UnauthorizedException('Verify your credentials and try again');
      }

      // generate token
      const userFormatted = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      };

      const auth = jwttoken.sign(userFormatted);

      cookies.set(res, 'auth', auth);

      logger.info(`User logged in successfully: ${email}`);

      return userFormatted;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  static async logout(res) {

    try {
      
      cookies.clear(res, 'auth');
  
      logger.info('User logged out successfully');
    } catch (error) {
      logger.error(error);
      throw error; 
    }

  }
}