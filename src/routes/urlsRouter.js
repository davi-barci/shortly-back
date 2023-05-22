import {Router} from 'express';
import { createShortUrl, getUrlById, openUrl } from '../controllers/urlsController.js';
import { authValidation } from '../middlewares/authSchemaMiddleware.js';
import { shortURLSchema } from '../schemas/urlsSchema.js';
import { validateSchema } from '../middlewares/validateSchemaMiddleware.js';


const urlRouter = Router();

urlRouter.post("/urls/shorten", validateSchema(shortURLSchema), authValidation, createShortUrl);
urlRouter.get("/urls/:id", getUrlById);
urlRouter.get("/urls/open/:shortUrl", openUrl);

export default urlRouter;