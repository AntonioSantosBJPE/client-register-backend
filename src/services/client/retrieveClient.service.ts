import { AppDataSource } from "../../data-source";
import { Client } from "../../entities";
import * as clientInterfaces from "../../interfaces/client.interface";
import { returnClientSchema } from "../../schemas/client.schema";

export const retrieveClientService = async (
  client: Client
): Promise<clientInterfaces.TreturnClient> => {
  // const usersRepository = AppDataSource.getRepository(Client);

  // let clients: Array<Client> = await usersRepository.find({
  //   withDeleted: true,
  // });

  return returnClientSchema.parse(client);
};
