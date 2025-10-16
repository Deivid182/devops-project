import { AuthController } from '#controllers/auth.controller';
import express from 'express';

const authRouter = express.Router();

authRouter.post('/register', AuthController.register);

authRouter.post('/login', (req, res) => {
  res.status(200).json({ message: 'login' });
});

authRouter.post('/logout', (req, res) => {
  res.status(200).json({ message: 'logout' });
});

export default authRouter; 