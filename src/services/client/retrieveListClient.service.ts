import { AppDataSource } from "../../data-source";
import { Client } from "../../entities";
import * as clientInterfaces from "../../interfaces/client.interface";
import { returnListClientSchema } from "../../schemas/client.schema";

export const retrieveListClientService =
  async (): Promise<clientInterfaces.TreturnListClient> => {
    const usersRepository = AppDataSource.getRepository(Client);

    let clients: Array<Client> = await usersRepository.find({
      withDeleted: true,
    });

    return returnListClientSchema.parse(clients);
  };
