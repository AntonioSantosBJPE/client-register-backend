import { NextFunction, Request, Response } from "express";
import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { Contact } from "../../entities";
import { AppError } from "../../error";
import { isValidUUID } from "../utils";

export const validateContactIdMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const contactId: string = req.params.id;
  const clientId: string = res.locals.clientTokenInfos.id;

  if (!isValidUUID(contactId)) {
    throw new AppError("Contact not found", 404);
  }

  const contactRepository: Repository<Contact> =
    AppDataSource.getRepository(Contact);

  const findContact = await contactRepository.findOne({
    where: {
      id: contactId,
    },
    relations: {
      client: true,
    },
  });

  if (!findContact) {
    throw new AppError("Contact not found", 404);
  }

  res.locals.contact = findContact;
  next();
};
