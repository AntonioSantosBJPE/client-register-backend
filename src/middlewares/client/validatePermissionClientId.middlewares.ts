import { NextFunction, Request, Response } from "express";
import { AppError } from "../../error";

export const validatePermissionClientIdMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const clientIdParams: string = req.params.id;
  const clientTokenId: string = res.locals.clientTokenInfos.id;

  if (clientIdParams !== clientTokenId) {
    throw new AppError("Insufficient permission", 403);
  }

  next();
};
