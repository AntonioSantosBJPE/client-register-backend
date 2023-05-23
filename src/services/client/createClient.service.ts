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

  const cliente: Client = clientRepository.create(payload as Client);
  await clientRepository.save(cliente);

  return returnClientSchema.parse(cliente);
};
