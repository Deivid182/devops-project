import { validationError } from '#middleware/validation-error.middleware';
import { loginSchema, registerSchema } from '#validations/auth.validation';
import { AuthService } from '#services/auth.service';
import { HttpStatus } from '#common/http-status/index';

export class AuthController {

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @returns {Promise<void>}
   * @description Register a new user
   *
    */
  static async register(req, res) {
    const userData = validationError({ schema: registerSchema, data: req.body, res });

    const { name, email, role, id } = await AuthService.createUser({userData, res});

    return res.status(HttpStatus.CREATED).json({ message: 'User registered successfully', data: { id, name, email, role } });
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @returns {Promise<void>}
   * @description Login a user
   *
    */
  static async login(req, res) {
    const userData = validationError({ schema: loginSchema, data: req.body });

    const loggedInUser = await AuthService.login({ userData, res });

    return res.status(HttpStatus.OK).json({ message: 'User logged in successfully', data: loggedInUser});
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @returns {Promise<void>}
   * @description Logout a user
   *
  */
  static async logout(req, res) {
    await AuthService.logout(res);

    return res.status(HttpStatus.OK).json({ message: 'User logged out successfully', data: {} });
  }
}