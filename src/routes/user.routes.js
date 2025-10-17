import express from 'express';
import { UsersController } from '#controllers/users.controller';
import { authMiddleware, roleMiddleware } from '#middleware/auth.middleware';

const userRouter = express.Router();

userRouter.use(authMiddleware);

userRouter.get('/', roleMiddleware(['admin']),  UsersController.getAll);

userRouter.get('/:id', UsersController.getOne);

userRouter.patch('/', UsersController.update);

userRouter.delete('/', roleMiddleware(['admin']), UsersController.delete);

export default userRouter;