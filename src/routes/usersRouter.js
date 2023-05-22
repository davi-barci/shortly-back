import {Router} from 'express';
import { getUserData } from '../controllers/usersController.js';
import { authValidation } from '../middlewares/authSchemaMiddleware.js';

const userRouter = Router();

userRouter.get("/users/me", authValidation, getUserData);

export default userRouter;