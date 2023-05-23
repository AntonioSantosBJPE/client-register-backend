import { Contact } from "../../entities";
import * as contactInterfaces from "../../interfaces/contact.interface";
import { returnContactSchema } from "../../schemas/contact.schema";

export const retrieveContactService = async (
  contact: Contact
): Promise<contactInterfaces.TreturnContact> => {
  return returnContactSchema.parse(contact);
};
