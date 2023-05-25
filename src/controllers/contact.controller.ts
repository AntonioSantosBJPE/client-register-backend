import { Request, Response } from "express";
import { Contact } from "../entities";
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

export const retrieveContactController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const contact: Contact = res.locals.contact;
  const retrieveContact = await contactServices.retrieveContactService(contact);
  return res.status(200).json(retrieveContact);
};

export const updateContactController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const contact: Contact = res.locals.contact;
  const body: contactInterfaces.TupdateContact = req.body;

  const updateContact: contactInterfaces.TreturnContact =
    await contactServices.updateContactService(contact, body);

  return res.status(200).json(updateContact);
};

export const deleteContactController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const contact: Contact = res.locals.contact;
  await contactServices.deleteContactService(contact);
  return res.status(204).send();
};
