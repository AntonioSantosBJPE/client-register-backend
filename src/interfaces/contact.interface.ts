import { DeepPartial } from "typeorm";
import { z } from "zod";
import * as contactSchemas from "../schemas/contact.schema";

export type TcreateContact = z.infer<typeof contactSchemas.createContactSchema>;
export type TupdateContact = DeepPartial<TcreateContact>;
export type TreturnContact = z.infer<typeof contactSchemas.returnContactSchema>;
export type TreturnContactList = z.infer<
  typeof contactSchemas.returnListContactSchema
>;
