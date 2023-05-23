import { Router } from "express";
import { loginController } from "../controllers/login.controller";
import * as middlewares from "../middlewares";
import { loginSchema } from "../schemas/login.schema";

export const loginRouters: Router = Router();

loginRouters.post(
  "",
  middlewares.validateBodyMiddleware(loginSchema),
  loginController
);
