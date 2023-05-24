import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { Client } from "../../entities";
import * as clientInterfaces from "../../interfaces/client.interface";
import { returnClientSchema } from "../../schemas/client.schema";

export const retrieveProfileClientService = async (
  clientId: string
): Promise<clientInterfaces.TreturnClient> => {
  const clientRepository: Repository<Client> =
    AppDataSource.getRepository(Client);

  let client: Client | null = await clientRepository.findOneBy({
    id: clientId,
  });

  return returnClientSchema.parse(client);
};
