import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { Client } from "../../entities";
import * as clientInterfaces from "../../interfaces/client.interface";
import { returnListClientSchema } from "../../schemas/client.schema";

export const retrieveListClientService =
  async (): Promise<clientInterfaces.TreturnListClient> => {
    const clientRepository: Repository<Client> =
      AppDataSource.getRepository(Client);

    let clients: Array<Client> = await clientRepository.find({
      withDeleted: false,
    });

    return returnListClientSchema.parse(clients);
  };
