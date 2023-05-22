import { Request, Response } from "express";
import { Client } from "../entities";
import * as clientInterfaces from "../interfaces/client.interface";
import * as clientServices from "../services/client";

export const createClientController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const body: clientInterfaces.TcreateClient = req.body;

  const newClient: clientInterfaces.TreturnClient =
    await clientServices.createClientService(body);

  return res.status(201).json(newClient);
};

export const retrieveListClientController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const clients: clientInterfaces.TreturnListClient =
    await clientServices.retrieveListClientService();

  return res.status(200).json(clients);
};

export const retrieveClientController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const findClient: Client = res.locals.client;

  const client: clientInterfaces.TreturnClient =
    await clientServices.retrieveClientService(findClient);

  return res.status(200).json(client);
};

export const updateClientController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const client: Client = res.locals.client;
  const body: clientInterfaces.TupdateClient = req.body;

  const updateClient: clientInterfaces.TreturnClient =
    await clientServices.updateClientService(client, body);

  return res.status(200).json(updateClient);
};

export const deleteClientController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const client: Client = res.locals.client;
  await clientServices.deleteClientService(client);
  return res.status(204).send();
};
