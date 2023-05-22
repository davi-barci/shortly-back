import {Router} from 'express';
import { getUserData, ranking } from '../controllers/usersController.js';
import { authValidation } from '../middlewares/authSchemaMiddleware.js';

const userRouter = Router();

userRouter.get("/users/me", authValidation, getUserData);
userRouter.get("/ranking", ranking);

export default userRouter;