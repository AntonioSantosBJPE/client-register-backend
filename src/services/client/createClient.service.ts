import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { Client } from "../../entities";
import * as clientInterfaces from "../../interfaces/client.interface";
import { returnClientSchema } from "../../schemas/client.schema";
import { hash } from "bcryptjs";

export const createClientService = async (
  payload: clientInterfaces.TcreateClient
): Promise<clientInterfaces.TreturnClient> => {
  const usersRepository: Repository<Client> =
    AppDataSource.getRepository(Client);

  payload.password = await hash(payload.password, 10);

  const user: Client = usersRepository.create(payload as Client);
  await usersRepository.save(user);

  const userReturn: clientInterfaces.TreturnClient =
    returnClientSchema.parse(user);
  return userReturn;
};
