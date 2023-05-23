import { Request, Response } from "express";
import { Client } from "../entities";
import * as contactInterfaces from "../interfaces/contact.interface";
import * as contactServices from "../services/contact";

export const createContactController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const body: contactInterfaces.TcreateContact = req.body;
  const clientId: string = res.locals.clientTokenInfos.id;

  const newContact: contactInterfaces.TreturnContact =
    await contactServices.createContactService(body, clientId);

  return res.status(201).json(newContact);
};
