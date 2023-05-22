import { Router } from "express";
import { loginController } from "../controllers/login.controller";
export const loginRouters: Router = Router();
import * as middlewares from "../middlewares";
import { loginSchema } from "../schemas/login.schema";

loginRouters.post(
  "",
  middlewares.validateBodyMiddleware(loginSchema),
  loginController
);
