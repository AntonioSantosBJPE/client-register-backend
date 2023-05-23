import "dotenv/config";
import { NextFunction, Request, Response } from "express";
import { verify, VerifyErrors } from "jsonwebtoken";
import { AppError } from "../../error";

export const validateTokenJwtMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  const authToken: string | undefined = req.headers.authorization;

  if (!authToken) {
    throw new AppError("Missing bearer token", 401);
  }

  const token: string = authToken.split(" ")[1];

  verify(
    token,
    String(process.env.SECRET_KEY),
    (error: VerifyErrors | null, decoded: any) => {
      if (error) {
        throw new AppError(error.message, 401);
      }
      res.locals.clientTokenInfos = {
        email: decoded.email,
        id: decoded.sub,
      };
      return;
    }
  );

  next();
};
