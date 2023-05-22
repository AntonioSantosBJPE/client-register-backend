import { Request, Response } from "express";

export const createClientController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  return res.status(201).json("Route create new client!");
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
