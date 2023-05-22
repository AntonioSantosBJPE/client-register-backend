import { Request, Response } from "express";
import * as clienteInterfaces from "../interfaces/client.interface";
import * as clientServices from "../services/client";

export const createClientController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const body: clienteInterfaces.TcreateClient = req.body;
  const newClient: clienteInterfaces.TreturnClient =
    await clientServices.createClientService(body);
  return res.status(201).json(newClient);
};

export const retrieveListClientController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const clients: clienteInterfaces.TreturnListClient =
    await clientServices.retrieveListClientService();
  return res.status(200).json(clients);
};

export const retrieveClientController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  return res.status(200).json("Route retrieve client!");
};

export const updateClientController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  return res.status(200).json("Route update client!");
};

export const deleteClientController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  return res.status(204).send();
};
