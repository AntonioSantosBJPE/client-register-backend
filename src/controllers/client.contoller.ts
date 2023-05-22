import { Request, Response } from "express";
import * as clienteInterfaces from "../interfaces/client.interface";
import { createClientService } from "../services/client/createClient.service";

export const createClientController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const body: clienteInterfaces.TcreateClient = req.body;
  const newUser: clienteInterfaces.TreturnClient = await createClientService(
    body
  );
  return res.status(201).json(newUser);
};

export const retrieveListClientController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  return res.status(200).json("Route retrieve list of client!");
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
