import { Router } from "express";
import * as middlewares from "../middlewares";
import * as contactSchemas from "../schemas/contact.schema";
import * as contactControllers from "../controllers/contact.controller";

export const contactRouters: Router = Router();

contactRouters.post(
  "",
  middlewares.validateTokenJwtMiddleware,
  middlewares.validateBodyMiddleware(contactSchemas.createContactSchema),
  middlewares.validateContactEmailExistInClientMiddleware,
  contactControllers.createContactController
);
