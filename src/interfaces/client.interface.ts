import { z } from "zod";
import * as clientSchemas from "../schemas/client.schema";

export type TcreateClient = z.infer<typeof clientSchemas.createClientSchema>;
export type TreturnClient = z.infer<typeof clientSchemas.returnClientSchema>;
