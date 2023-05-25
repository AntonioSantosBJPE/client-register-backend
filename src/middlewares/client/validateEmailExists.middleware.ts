import { NextFunction, Request, Response } from "express";
import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { Client } from "../../entities";
import { AppError } from "../../error";

export const validateEmailExistsMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const usersRepository: Repository<Client> =
    AppDataSource.getRepository(Client);

  if (req.body.email) {
    const clientToValidate: Client | null = await usersRepository.findOne({
      where: {
        email: req.body.email,
      },
      withDeleted: true,
    });

    if (clientToValidate) {
      if (req.method === "POST") {
        throw new AppError("Email already exists", 409);
      }

      if (req.method === "PATCH") {
        if (!(req.params.id === clientToValidate.id))
          throw new AppError("Email already exists", 409);
      }
    }
  }

  next();
};
