import express from 'express';
import { AuthController } from '#controllers/auth.controller';
import { authMiddleware } from '#middleware/auth.middleware';

const authRouter = express.Router();

authRouter.post('/register', AuthController.register);

authRouter.post('/login', AuthController.login);

authRouter.post('/logout', authMiddleware, AuthController.logout);

export default authRouter; 