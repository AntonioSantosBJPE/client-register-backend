import { Client } from "../../entities";
import * as clientInterfaces from "../../interfaces/client.interface";
import { returnClientSchema } from "../../schemas/client.schema";

export const retrieveClientService = async (
  client: Client
): Promise<clientInterfaces.TreturnClient> => {
  return returnClientSchema.parse(client);
};
