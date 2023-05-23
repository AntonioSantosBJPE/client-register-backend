import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { Client } from "../../entities";
import * as clientIntefaces from "../../interfaces/client.interface";
import { returnClientSchema } from "../../schemas/client.schema";

export const updateClientService = async (
  client: Client,
  payload: clientIntefaces.TupdateClient
): Promise<clientIntefaces.TreturnClient> => {
  const clientRepository: Repository<Client> =
    AppDataSource.getRepository(Client);

  const clientUpdate = clientRepository.create({ ...client, ...payload });

  await clientRepository.save(clientUpdate);

  return returnClientSchema.parse(clientUpdate);
};
