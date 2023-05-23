import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { Client, Contact } from "../../entities";
import { AppError } from "../../error";
import * as contactInterfaces from "../../interfaces/contact.interface";
import { returnContactSchema } from "../../schemas/contact.schema";

export const createContactService = async (
  payload: contactInterfaces.TcreateContact,
  clientId: string
): Promise<contactInterfaces.TreturnContact> => {
  const clientRepository: Repository<Client> =
    AppDataSource.getRepository(Client);

  const contactRepository: Repository<Contact> =
    AppDataSource.getRepository(Contact);

  const client: Client | null = await clientRepository.findOne({
    where: {
      id: clientId,
    },
  });

  if (!client) {
    throw new AppError("Client not found", 404);
  }

  const contact = contactRepository.create({ ...payload, client });

  const newContact = await contactRepository.save(contact);

  return returnContactSchema.parse(newContact);
};
