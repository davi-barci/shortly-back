import {Router} from 'express';
import { createShortUrl } from '../controllers/urlsController.js';
import { authValidation } from '../middlewares/authSchemaMiddleware.js';
import { shortURLSchema } from '../schemas/urlsSchema.js';
import { validateSchema } from '../middlewares/validateSchemaMiddleware.js';


const urlRouter = Router();

urlRouter.post("/urls/shorten", validateSchema(shortURLSchema), authValidation, createShortUrl);

export default urlRouter;