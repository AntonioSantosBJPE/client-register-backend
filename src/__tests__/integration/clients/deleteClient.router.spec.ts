import supertest from "supertest";
import { DataSource } from "typeorm";
import app from "../../../app";
import { AppDataSource } from "../../../data-source";
import { Client } from "../../../entities";
import { createClientMock } from "../../mocks/clients/createClient.router.mock";
import tokenMock from "../../mocks/login/token.mock";

describe("DELETE /clients/profile/:clienteId", () => {
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
    console.log(clients);
    client = await clientRepo.save({ ...createClientMock.clientComplete });
    client2 = await clientRepo.save({ ...createClientMock.clientUnique });
    validUrl = baseUrl + `/${client.id}`;
    validUrlClient2 = baseUrl + `/${client2.id}`;
  });

  afterAll(async () => {
    await connection.destroy();
  });

  it("Success: Client must be able to delete their own account", async () => {
    const response = await supertest(app)
      .delete(validUrl)
      .set(
        "Authorization",
        `Bearer ${tokenMock.genToken(client.email, client.id)}`
      );

    const expectResults = { status: 204 };

    expect(response.status).toBe(expectResults.status);
    expect(response.body).toStrictEqual({});
  });

  it("Error: Client must not be able to delete another client's account", async () => {
    const response = await supertest(app)
      .delete(validUrlClient2)
      .set(
        "Authorization",
        `Bearer ${tokenMock.genToken(client.email, client.id)}`
      );

    const expectResults = { status: 403 };

    expect(response.status).toBe(expectResults.status);
    expect(response.body).toStrictEqual({ message: "Insufficient permission" });
  });

  it("Error: Client must not be able to delete another client's account - invalid id-1", async () => {
    const response = await supertest(app)
      .delete(invalidIdUrl)
      .set(
        "Authorization",
        `Bearer ${tokenMock.genToken(client.email, client.id)}`
      );

    const expectResults = {
      status: 404,
      bodyMessage: { message: "Client not found" },
    };

    expect(response.status).toBe(expectResults.status);

    expect(response.body).toStrictEqual(expectResults.bodyMessage);
  });

  it("Error: Client must not be able to delete another client's account - invalid id-2", async () => {
    const response = await supertest(app)
      .delete(invalidIdUrl2)
      .set(
        "Authorization",
        `Bearer ${tokenMock.genToken(client.email, client.id)}`
      );

    const expectResults = {
      status: 404,
      bodyMessage: { message: "Client not found" },
    };

    expect(response.status).toBe(expectResults.status);

    expect(response.body).toStrictEqual(expectResults.bodyMessage);
  });

  it("Error: Client should not be able to delete their account - expired token", async () => {
    const response = await supertest(app)
      .delete(validUrl)
      .set(
        "Authorization",
        `Bearer ${tokenMock.jwtExpired(client.email, client.id)}`
      );

    const expectResults = {
      status: 401,
      bodyMessage: { message: "jwt expired" },
    };

    expect(response.status).toBe(expectResults.status);

    expect(response.body).toStrictEqual(expectResults.bodyMessage);
  });

  it("Error: Client should not be able to delete their account - invalid token-1", async () => {
    const response = await supertest(app)
      .delete(validUrl)
      .set("Authorization", `Bearer ${tokenMock.invalidSignature}`);

    const expectResults = {
      status: 401,
      bodyMessage: { message: "invalid signature" },
    };

    expect(response.status).toBe(expectResults.status);

    expect(response.body).toStrictEqual(expectResults.bodyMessage);
  });

  it("Error: Client should not be able to delete their account - invalid token-2", async () => {
    const response = await supertest(app)
      .delete(validUrl)
      .set("Authorization", `Bearer ${tokenMock.jwtMalformed}`);

    const expectResults = {
      status: 401,
      bodyMessage: { message: "jwt malformed" },
    };

    expect(response.status).toBe(expectResults.status);

    expect(response.body).toStrictEqual(expectResults.bodyMessage);
  });

  it("Error: Client should not be able to delete their account - no token", async () => {
    const response = await supertest(app).delete(validUrl);

    const expectResults = {
      status: 401,
      bodyMessage: { message: "Missing bearer token" },
    };

    expect(response.status).toBe(expectResults.status);

    expect(response.body).toStrictEqual(expectResults.bodyMessage);
  });
});
