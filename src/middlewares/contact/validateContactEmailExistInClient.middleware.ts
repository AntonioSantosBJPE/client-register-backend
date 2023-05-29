import { NextFunction, Request, Response } from "express";
import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { Contact } from "../../entities";
import { AppError } from "../../error";

export const validateContactEmailExistInClientMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const bodyEmail: string = req.body.email;
  const clientId: string = res.locals.clientTokenInfos.id;

  const contactRepository: Repository<Contact> =
    AppDataSource.getRepository(Contact);

  if (bodyEmail) {
    const findEmailContactExistInClient = await contactRepository.findOne({
      where: {
        email: bodyEmail,
        client: {
          id: clientId,
        },
      },
      withDeleted: true,
    });

    if (findEmailContactExistInClient) {
      if (req.method === "POST") {
        throw new AppError("Contact email already exists in Client", 409);
      }

      if (req.method === "PATCH") {
        if (!(req.params.id === findEmailContactExistInClient.id))
          throw new AppError("Contact email already exists in Client", 409);
      }
    }
  }

  next();
};
