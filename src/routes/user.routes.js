import express from 'express';
import { UsersController } from '#controllers/users.controller';
import { authMiddleware } from '#middleware/auth.middleware';
import { roleMiddleware } from '#middleware/role.middleware';

const userRouter = express.Router();

userRouter.use(authMiddleware);

userRouter.get('/', roleMiddleware(['admin']), UsersController.getAll);

userRouter.get('/:id', UsersController.getOne);

userRouter.patch('/:id', UsersController.update);

userRouter.delete('/:id', roleMiddleware(['admin']), UsersController.delete);

export default userRouter;
