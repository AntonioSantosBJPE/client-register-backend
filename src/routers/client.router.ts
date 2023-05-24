import { Router } from "express";
import * as clientController from "../controllers/client.contoller";
import * as middlewares from "../middlewares";
import * as clientSchemas from "../schemas/client.schema";

export const clientRouters: Router = Router();

clientRouters.post(
  "",
  middlewares.validateBodyMiddleware(clientSchemas.createClientSchema),
  middlewares.validateEmailExistsMiddleware,
  clientController.createClientController
);
clientRouters.get("", clientController.retrieveListClientController);
clientRouters.get(
  "/profile/:id",
  middlewares.validateTokenJwtMiddleware,
  middlewares.validatePermissionClientIdMiddleware,
  middlewares.validateClientIdMiddleware,
  clientController.retrieveClientController
);
clientRouters.patch(
  "/profile/:id",
  middlewares.validateTokenJwtMiddleware,
  middlewares.validatePermissionClientIdMiddleware,
  middlewares.validateBodyMiddleware(clientSchemas.updateClientSchema),
  middlewares.validateClientIdMiddleware,
  middlewares.validateEmailExistsMiddleware,
  clientController.updateClientController
);
clientRouters.delete(
  "/profile/:id",
  middlewares.validateTokenJwtMiddleware,
  middlewares.validatePermissionClientIdMiddleware,
  middlewares.validateClientIdMiddleware,
  clientController.deleteClientController
);

clientRouters.get(
  "/profile/:id/contacts",
  middlewares.validateTokenJwtMiddleware,
  middlewares.validatePermissionClientIdMiddleware,
  clientController.retrieveContactsClientController
);

clientRouters.get(
  "/profile",
  middlewares.validateTokenJwtMiddleware,
  clientController.retrievProfileClientController
);
