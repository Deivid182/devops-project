import { validationError } from '#middleware/validation-error.middleware';
import { registerSchema } from '#validations/auth.validation';
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


    res.status(HttpStatus.CREATED).json({ message: 'User registered successfully', user: { id, name, email, role } });
  }
}