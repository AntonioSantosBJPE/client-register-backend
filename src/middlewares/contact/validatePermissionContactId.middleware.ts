import { NextFunction, Request, Response } from "express";
import { Contact } from "../../entities";
import { AppError } from "../../error";

export const validatePermissionContactIdMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const contact: Contact = res.locals.contact;
  const clientId: string = res.locals.clientTokenInfos.id;

  if (contact.client.id !== clientId) {
    throw new AppError("Insufficient permission", 403);
  }

  next();
};
