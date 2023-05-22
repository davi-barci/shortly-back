import {Router} from 'express';
import authRouter from './authRouter.js';
import urlRouter from './urlsRouter.js';
import userRouter from './usersRouter.js';

const router = Router();
router.use(authRouter);
router.use(urlRouter);
router.use(userRouter);

export default router;