import { validationError } from '#middleware/validation-error.middleware';
// import { loginSchema, registerSchema } from '#validations/auth.validation';
import { UserService } from '#services/users.service';
import { HttpStatus } from '#common/http-status/index';
import { idSchema } from '#common/validations/id.validation';
import { updateUserSchema } from '#validations/users/update-user.validation';

export class UsersController {

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @returns {Promise<void>}
   * @description Register a new user
   *
    */
  static async getAll(req, res) {
    const data = await UserService.getAll();

    return res.status(HttpStatus.CREATED).json({ message: 'Users retrieved successfully', data });
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @returns {Promise<void>}
   * @description Login a user
   *
    */
  static async getOne(req, res) {
    const { id } = validationError({ schema: idSchema, data: req.params });

    const data = await UserService.getOne(id);

    return res.status(HttpStatus.OK).json({ message: 'User retrieved successfully', data});
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @returns {Promise<void>}
   * @description Logout a user
   *
  */
  static async update(req, res) {
    const userData = validationError({ schema: updateUserSchema, data: req.params });   

    const data = await UserService.updateOne(userData.id, userData);

    return res.status(HttpStatus.OK).json({ message: 'User updated successfully', data });
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @returns {Promise<void>}
   * @description Logout a user
   *
  */
  static async delete(req, res) {
    const { id } = validationError({ schema: idSchema, data: req.params });

    await UserService.deleteOne(id);

    return res.status(HttpStatus.OK).json({ message: 'User deleted successfully', data: {} });
  }
}