import supertest from "supertest";
import { DataSource } from "typeorm";
import app from "../../../app";
import { AppDataSource } from "../../../data-source";
import { Client } from "../../../entities";
import { createClientMock } from "../../mocks/clients/createClient.router.mock";
import tokenMock from "../../mocks/login/token.mock";

describe("GET /clients/profile", () => {
  let connection: DataSource;

  const baseUrl: string = "/clients/profile";
  let client: Client;
  const clientRepo = AppDataSource.getRepository(Client);

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => (connection = res))
      .catch((error) => console.error(error));
  });

  beforeEach(async () => {
    const users: Array<Client> = await clientRepo.find();
    await clientRepo.remove(users);

    client = await clientRepo.save({ ...createClientMock.clientComplete });
  });

  afterAll(async () => {
    await connection.destroy();
  });

  it("Success: The client must be able to retrieve their profile information", async () => {
    const response = await supertest(app)
      .get(baseUrl)
      .set(
        "Authorization",
        `Bearer ${tokenMock.genToken(client.email, client.id)}`
      );

    const { password, ...bodyEqual } = createClientMock.clientComplete;
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

  it("Error: The client must not be able to retrieve your profile information - invalid token-1", async () => {
    const response = await supertest(app)
      .get(baseUrl)
      .set("Authorization", `Bearer ${tokenMock.invalidSignature}`);

    const expectResults = {
      status: 401,
      bodyMessage: { message: "invalid signature" },
    };

    expect(response.status).toBe(expectResults.status);

    expect(response.body).toStrictEqual(expectResults.bodyMessage);
  });

  it("Error: The client must not be able to retrieve your profile information - invalid token-2", async () => {
    const response = await supertest(app)
      .get(baseUrl)
      .set("Authorization", `Bearer ${tokenMock.jwtMalformed}`);

    const expectResults = {
      status: 401,
      bodyMessage: { message: "jwt malformed" },
    };

    expect(response.status).toBe(expectResults.status);

    expect(response.body).toStrictEqual(expectResults.bodyMessage);
  });

  it("Error: The client must not be able to retrieve your profile information - no token", async () => {
    const response = await supertest(app).get(baseUrl);

    const expectResults = {
      status: 401,
      bodyMessage: { message: "Missing bearer token" },
    };

    expect(response.status).toBe(expectResults.status);

    expect(response.body).toStrictEqual(expectResults.bodyMessage);
  });

  it("Error: The client must not be able to retrieve your profile information - expired token", async () => {
    const response = await supertest(app)
      .get(baseUrl)
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
});
