import { AppDataSource } from "../../data-source";
import { Client } from "../../entities";

export const deleteClientService = async (client: Client): Promise<void> => {
  const userRepository = AppDataSource.getRepository(Client);

  await userRepository.softRemove(client);
};
