import supertest from "supertest";
import { DataSource } from "typeorm";
import app from "../../../app";
import { AppDataSource } from "../../../data-source";
import { Client } from "../../../entities";
import { createClientMock } from "../../mocks/clients/createClient.router.mock";
import { updateClientMock } from "../../mocks/clients/updateClient.router.mock";
import tokenMock from "../../mocks/login/token.mock";

describe("PATCH /clients/profile/:clienteId", () => {
  let connection: DataSource;

  const baseUrl: string = "/clients/profile";
  const invalidIdUrl: string = baseUrl + "/123456";
  const invalidIdUrl2: string =
    baseUrl + "/90e33fb4-e18d-49b0-8d74-c309239f3c1e";
  let validUrl: string;
  let validUrlClient2: string;
  let client: Client;
  let client2: Client;
  const clientRepo = AppDataSource.getRepository(Client);

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => (connection = res))
      .catch((error) => console.error(error));
  });

  beforeEach(async () => {
    const clients: Array<Client> = await clientRepo.find({
      withDeleted: true,
    });
    await clientRepo.remove(clients);
    client = await clientRepo.save({ ...createClientMock.clientComplete });
    client2 = await clientRepo.save({ ...createClientMock.clientUnique });
    validUrl = baseUrl + `/${client.id}`;
    validUrlClient2 = baseUrl + `/${client2.id}`;
  });

  afterAll(async () => {
    await connection.destroy();
  });

  it("Success: Client must be able to update their own account - full body", async () => {
    const response = await supertest(app)
      .patch(validUrl)
      .set(
        "Authorization",
        `Bearer ${tokenMock.genToken(client.email, client.id)}`
      )
      .send(updateClientMock.updateclientComplete);

    const { password, ...bodyEqual } = updateClientMock.updateclientComplete;
    const expectResults = {
      status: 200,
    };

    expect(response.status).toBe(expectResults.status);
    expect(response.body).toEqual(expect.objectContaining(bodyEqual));
    expect(response.body).not.toEqual(
      expect.objectContaining({ password: expect.any(String) })
    );

    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      })
    );
  });

  it("Success: Client must be able to update their own account -- partial body", async () => {
    const response = await supertest(app)
      .patch(validUrl)
      .set(
        "Authorization",
        `Bearer ${tokenMock.genToken(client.email, client.id)}`
      )
      .send(updateClientMock.updateclientPartial);

    const { ...bodyEqual } = updateClientMock.updateclientPartial;
    const expectResults = {
      status: 200,
    };

    expect(response.status).toBe(expectResults.status);
    expect(response.body).toEqual(expect.objectContaining(bodyEqual));
    expect(response.body).not.toEqual(
      expect.objectContaining({ password: expect.any(String) })
    );

    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      })
    );
  });

  it("Error: Client must no be able to update their own account - Email already exists", async () => {
    const response = await supertest(app)
      .patch(validUrl)
      .set(
        "Authorization",
        `Bearer ${tokenMock.genToken(client.email, client.id)}`
      )
      .send(updateClientMock.clientUnique);

    const expectResults = {
      status: 409,
      bodyMessage: { message: "Email already exists" },
    };

    expect(response.status).toBe(expectResults.status);

    expect(response.body).toStrictEqual(expectResults.bodyMessage);
  });

  it("Error: Client must no be able to update their own account - invalid body", async () => {
    const response = await supertest(app)
      .patch(validUrl)
      .set(
        "Authorization",
        `Bearer ${tokenMock.genToken(client.email, client.id)}`
      )
      .send(updateClientMock.updateclientInvalidBody);

    const expectResults = {
      status: 400,
      bodyMessage: {
        message: {
          name: ["Expected string, received number"],
          email: ["Invalid email"],
          phone: ["Expected string, received number"],
          password: ["Expected string, received number"],
        },
      },
    };

    expect(response.status).toBe(expectResults.status);
    expect(response.body).toStrictEqual(expectResults.bodyMessage);
  });

  it("Error: Client must no be able to update their own account - Invalid password", async () => {
    const response = await supertest(app)
      .patch(validUrl)
      .set(
        "Authorization",
        `Bearer ${tokenMock.genToken(client.email, client.id)}`
      )
      .send(updateClientMock.updateclientInvalidPassword);

    const expectResults = {
      status: 400,
      bodyMessage: {
        message: {
          password: [
            "One uppercase character",
            "One lowercase character",
            "One number",
            "One special character",
            "String must contain at least 8 character(s)",
          ],
        },
      },
    };

    expect(response.status).toBe(expectResults.status);
    expect(response.body).toStrictEqual(expectResults.bodyMessage);
  });

  it("Error: Client must no be able to update their own account - Invalid phone", async () => {
    const response = await supertest(app)
      .patch(validUrl)
      .set(
        "Authorization",
        `Bearer ${tokenMock.genToken(client.email, client.id)}`
      )
      .send(updateClientMock.updateclientInvalidPhone);

    const expectResults = {
      status: 400,
      bodyMessage: {
        message: {
          phone: ["Invalid format, use (99)92222-1111"],
        },
      },
    };

    expect(response.status).toBe(expectResults.status);
    expect(response.body).toStrictEqual(expectResults.bodyMessage);
  });

  it("Error: Client must not be able to update another client's account", async () => {
    const response = await supertest(app)
      .patch(validUrlClient2)
      .set(
        "Authorization",
        `Bearer ${tokenMock.genToken(client.email, client.id)}`
      )
      .send(updateClientMock.updateclientComplete);

    const expectResults = { status: 403 };

    expect(response.status).toBe(expectResults.status);
    expect(response.body).toStrictEqual({ message: "Insufficient permission" });
  });

  it("Error: Client must not be able to update another client's account - invalid id-1", async () => {
    const response = await supertest(app)
      .patch(invalidIdUrl)
      .set(
        "Authorization",
        `Bearer ${tokenMock.genToken(client.email, client.id)}`
      )
      .send(updateClientMock.updateclientComplete);

    const expectResults = {
      status: 404,
      bodyMessage: { message: "Client not found" },
    };

    expect(response.status).toBe(expectResults.status);

    expect(response.body).toStrictEqual(expectResults.bodyMessage);
  });

  it("Error: Client must not be able to update another client's account - invalid id-2", async () => {
    const response = await supertest(app)
      .patch(invalidIdUrl2)
      .set(
        "Authorization",
        `Bearer ${tokenMock.genToken(client.email, client.id)}`
      )
      .send(updateClientMock.updateclientComplete);

    const expectResults = {
      status: 404,
      bodyMessage: { message: "Client not found" },
    };

    expect(response.status).toBe(expectResults.status);

    expect(response.body).toStrictEqual(expectResults.bodyMessage);
  });

  it("Error: Client should not be able to update their account - expired token", async () => {
    const response = await supertest(app)
      .patch(validUrl)
      .set(
        "Authorization",
        `Bearer ${tokenMock.jwtExpired(client.email, client.id)}`
      )
      .send(updateClientMock.updateclientComplete);

    const expectResults = {
      status: 401,
      bodyMessage: { message: "jwt expired" },
    };

    expect(response.status).toBe(expectResults.status);

    expect(response.body).toStrictEqual(expectResults.bodyMessage);
  });

  it("Error: Client should not be able to update their account - invalid token-1", async () => {
    const response = await supertest(app)
      .patch(validUrl)
      .set("Authorization", `Bearer ${tokenMock.invalidSignature}`)
      .send(updateClientMock.updateclientComplete);

    const expectResults = {
      status: 401,
      bodyMessage: { message: "invalid signature" },
    };

    expect(response.status).toBe(expectResults.status);

    expect(response.body).toStrictEqual(expectResults.bodyMessage);
  });

  it("Error: Client should not be able to update their account - invalid token-2", async () => {
    const response = await supertest(app)
      .patch(validUrl)
      .set("Authorization", `Bearer ${tokenMock.jwtMalformed}`)
      .send(updateClientMock.updateclientComplete);

    const expectResults = {
      status: 401,
      bodyMessage: { message: "jwt malformed" },
    };

    expect(response.status).toBe(expectResults.status);

    expect(response.body).toStrictEqual(expectResults.bodyMessage);
  });

  it("Error: Client should not be able to update their account - no token", async () => {
    const response = await supertest(app)
      .patch(validUrl)
      .send(updateClientMock.updateclientComplete);

    const expectResults = {
      status: 401,
      bodyMessage: { message: "Missing bearer token" },
    };

    expect(response.status).toBe(expectResults.status);

    expect(response.body).toStrictEqual(expectResults.bodyMessage);
  });
});
