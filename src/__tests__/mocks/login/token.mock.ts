import { sign } from "jsonwebtoken";

const secretKey: string = "1234";
process.env.SECRET_KEY = secretKey;

export default {
  genToken: (email: string, id: string) => {
    return sign({ email }, secretKey, { subject: id.toString() });
  },
  invalidSignature: sign({ email: "teste@mail.com" }, "invalid_signature"),
  jwtMalformed: "12345",
  jwtExpired: (email: string, id: string) => {
    return sign({ email }, secretKey, {
      expiresIn: "0.0000000001h",
      subject: id.toString(),
    });
  },
};
