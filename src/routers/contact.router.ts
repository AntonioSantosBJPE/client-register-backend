import { Router } from "express";
import * as contactControllers from "../controllers/contact.controller";
import * as middlewares from "../middlewares";
import * as contactSchemas from "../schemas/contact.schema";

export const contactRouters: Router = Router();

contactRouters.post(
  "",
  middlewares.validateTokenJwtMiddleware,
  middlewares.validateBodyMiddleware(contactSchemas.createContactSchema),
  middlewares.validateContactEmailExistInClientMiddleware,
  contactControllers.createContactController
);

contactRouters.get(
  "/:id",
  middlewares.validateTokenJwtMiddleware,
  middlewares.validateContactIdMiddleware,
  middlewares.validatePermissionContactIdMiddleware,
  contactControllers.retrieveContactController
);
contactRouters.patch(
  "/:id",
  middlewares.validateTokenJwtMiddleware,
  middlewares.validateBodyMiddleware(contactSchemas.updateContactSchema),
  middlewares.validateContactIdMiddleware,
  middlewares.validateContactEmailExistInClientMiddleware,
  contactControllers.updateContactController
);
contactRouters.delete(
  "/:id",
  middlewares.validateTokenJwtMiddleware,
  middlewares.validateContactIdMiddleware,
  contactControllers.deleteContactController
);
