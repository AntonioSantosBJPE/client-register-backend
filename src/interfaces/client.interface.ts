import { z } from "zod";
import { DeepPartial } from "typeorm";
import * as clientSchemas from "../schemas/client.schema";

export type TcreateClient = z.infer<typeof clientSchemas.createClientSchema>;
export type TreturnClient = z.infer<typeof clientSchemas.returnClientSchema>;
export type TreturnListClient = z.infer<
  typeof clientSchemas.returnListClientSchema
>;
export type TupdateClient = DeepPartial<TcreateClient>;
