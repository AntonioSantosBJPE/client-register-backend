import { AppDataSource } from "../../data-source";
import { Contact } from "../../entities";

export const deleteContactService = async (contact: Contact): Promise<void> => {
  const clientRepository = AppDataSource.getRepository(Contact);

  await clientRepository.delete({ id: contact.id });
  //   await clientRepository.softRemove(contact);
};
