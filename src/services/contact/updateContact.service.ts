import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { Contact } from "../../entities";
import * as contactIntefaces from "../../interfaces/contact.interface";
import { returnContactSchema } from "../../schemas/contact.schema";

export const updateContactService = async (
  contact: Contact,
  body: contactIntefaces.TupdateContact
): Promise<contactIntefaces.TreturnContact | any> => {
  const contactRepository: Repository<Contact> =
    AppDataSource.getRepository(Contact);

  const contactUpdate = contactRepository.create({ ...contact, ...body });

  await contactRepository.save(contactUpdate);

  return returnContactSchema.parse(contactUpdate);
};
