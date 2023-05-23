import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { Contact } from "../../entities";
import { TreturnContactList } from "../../interfaces/contact.interface";
import { returnListContactSchema } from "../../schemas/contact.schema";

export const retrieveContactsClientService = async (
  clientId: string
): Promise<TreturnContactList> => {
  const contactRepository: Repository<Contact> =
    AppDataSource.getRepository(Contact);

  const findListContacts: Contact[] = await contactRepository.find({
    where: {
      client: {
        id: clientId,
      },
    },
  });

  return returnListContactSchema.parse(findListContacts);
};
