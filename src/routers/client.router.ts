import { Router } from "express";
import * as clientController from "../controllers/client.contoller";

export const clientRouters: Router = Router();

clientRouters.post("", clientController.createClientController);
clientRouters.get("", clientController.retrieveListClientController);
clientRouters.get("/:id", clientController.retrieveClientController);
clientRouters.patch("/:id", clientController.updateClientController);
clientRouters.delete("/:id", clientController.deleteClientController);
