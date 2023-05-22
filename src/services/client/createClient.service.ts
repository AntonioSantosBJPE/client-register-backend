import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { Client } from "../../entities";
import * as clientInterfaces from "../../interfaces/client.interface";
import { returnClientSchema } from "../../schemas/client.schema";

export const createClientService = async (
  payload: clientInterfaces.TcreateClient
): Promise<clientInterfaces.TreturnClient> => {
  const clientRepository: Repository<Client> =
    AppDataSource.getRepository(Client);

  const user: Client = clientRepository.create(payload as Client);
  await clientRepository.save(user);

  const userReturn: clientInterfaces.TreturnClient =
    returnClientSchema.parse(user);
  return userReturn;
};
