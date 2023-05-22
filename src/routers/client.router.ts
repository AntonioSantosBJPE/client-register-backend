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
  "/:id",
  middlewares.validateClientIdMiddleware,
  clientController.retrieveClientController
);
clientRouters.patch(
  "/:id",
  middlewares.validateBodyMiddleware(clientSchemas.updateClientSchema),
  middlewares.validateClientIdMiddleware,
  middlewares.validateEmailExistsMiddleware,
  clientController.updateClientController
);
clientRouters.delete("/:id", clientController.deleteClientController);
