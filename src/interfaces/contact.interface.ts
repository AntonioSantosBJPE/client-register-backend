import { z } from "zod";
import * as contactSchemas from "../schemas/contact.schema";

export type TcreateContact = z.infer<typeof contactSchemas.createContactSchema>;
export type TreturnContact = z.infer<typeof contactSchemas.returnContactSchema>;
