import { db } from '#config/database';
import { users } from '#models/user.model';
import logger from '#config/logger';
import { eq } from 'drizzle-orm';
import { ConflictException, NotFoundException } from '#exceptions/index';

export class UserService {

  static async getAll() {
    try {
      return await db.select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt
      }).from(users);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  /**
   * Retrieves a single user by their ID.
   * @param {string} id - The ID of the user to retrieve.
   * @throws {NotFoundException} If the user was not found.
   */
  static async getOne(id = '') {
    try {
      const [user] = await db.select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt
      }).from(users).where(eq(users.id, id)).limit(1);

      if(!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  /**
   * Updates a single user by their ID.
   * 
   * @param {string} id - The ID of the user to update.
   * @param {Object} data - The data to update the user with.
   * @param {string} data.name - The name of the user.
   * @param {string} data.email - The email of the user.
   * @param {string} data.role - The role of the user.
   * @throws {NotFoundException} If the user was not found.
   * @throws {ConflictException} If a user with the same email already exists.
   */
  static async updateOne(id = '', data = {}) {
    try {
      const existingUser = await this.getOne(id);

      if(data.email && data.email !== existingUser.email) {
        const [user] = await db.select().from(users).where(eq(users.email, data.email)).limit(1);

        if(user) {
          throw new ConflictException('User already exists');
        }
      }

      const [updatedUser] = await db.update(users).set(data).where(eq(users.id, id)).returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt
      }).limit(1);

      return updatedUser;

    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  /**
   * Deletes a single user by their ID.
   * 
   * @param {string} id - The ID of the user to delete.
   * @throws {NotFoundException} If the user was not found.
   */
  static async deleteOne(id = '') {
    try {
      await this.getOne(id);

      const [deletedUser] = await db.delete(users).where(eq(users.id, id)).returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt
      }).limit(1);

      return deletedUser;

    } catch (error) {
      logger.error(error);
      throw error;
    }
  }
}