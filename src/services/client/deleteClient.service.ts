import { AppDataSource } from "../../data-source";
import { Client } from "../../entities";

export const deleteClientService = async (client: Client): Promise<void> => {
  const clientRepository = AppDataSource.getRepository(Client);

  await clientRepository.softRemove(client);
};
