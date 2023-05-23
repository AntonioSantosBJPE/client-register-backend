import { z } from "zod";
import { returnClientSchema } from "./client.schema";

export const contactSchema = z.object({
  id: z.string(),
  name: z.string().min(3).max(150),
  email: z.string().email().max(45),
  phone: z
    .string()
    .regex(
      new RegExp(/^\([0-9]{2}\)[0-9]{5}-[0-9]{4}$/),
      "Invalid format, use (99)92222-1111"
    ),
  createdAt: z.string(),
  updatedAt: z.string(),
  deletedAt: z.string().nullable(),
  client: returnClientSchema,
});

export const createContactSchema = contactSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  client: true,
});

export const updateContactSchema = createContactSchema.partial();

export const returnContactSchema = contactSchema.omit({
  deletedAt: true,
  client: true,
});

export const returnListContactSchema = returnContactSchema.array();
