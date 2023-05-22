import { NextFunction, Request, Response } from "express";
import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Client } from "../entities";
import { AppError } from "../error";
import { isValidUUID } from "./utils";
export const validateClientIdMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const paramsId: string = req.params.id;

  if (!isValidUUID(paramsId)) {
    throw new AppError("Client not found", 404);
  }

  const repository: Repository<Client> = AppDataSource.getRepository(Client);
  const findClient: Client | null = await repository.findOneBy({
    id: paramsId,
  });

  if (findClient === null) {
    throw new AppError("Client not found", 404);
  }

  res.locals.client = findClient;
  next();
};
