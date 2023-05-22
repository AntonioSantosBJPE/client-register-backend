import { z } from "zod";
import { loginSchema } from "../schemas/login.schema";

export type TloginRequest = z.infer<typeof loginSchema>;
