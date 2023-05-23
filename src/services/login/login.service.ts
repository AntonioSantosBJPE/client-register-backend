import { compare } from "bcryptjs";
import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { AppError } from "../../error";
import { sign } from "jsonwebtoken";
import { Client } from "../../entities";
import "dotenv/config";
import { TloginRequest } from "../../interfaces/login.interface";

export const loginService = async (body: TloginRequest): Promise<string> => {
  const userRepository: Repository<Client> =
    AppDataSource.getRepository(Client);

  const client: Client | null = await userRepository.findOneBy({
    email: body.email,
  });

  if (!client) {
    throw new AppError("Invalid credentials", 401);
  }

  const passwordMatch: boolean = await compare(body.password, client.password);

  if (!passwordMatch) {
    throw new AppError("Invalid credentials", 401);
  }

  const token: string = sign(
    {
      email: client.email,
    },
    String(process.env.SECRET_KEY),
    {
      expiresIn: String(process.env.EXPIRES_IN) || "1h",
      subject: client.id,
    }
  );

  return token;
};
