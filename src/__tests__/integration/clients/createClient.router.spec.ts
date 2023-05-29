import supertest from "supertest";
import { DataSource } from "typeorm";
import app from "../../../app";
import { AppDataSource } from "../../../data-source";
import { Client } from "../../../entities";
import { createClientMock } from "../../mocks/clients/createClient.router.mock";

describe("POST /clients", () => {
  let connection: DataSource;

  const baseUrl: string = "/clients";
  const clientRepo = AppDataSource.getRepository(Client);

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => (connection = res))
      .catch((error) => console.error(error));
  });

  beforeEach(async () => {
    const users: Array<Client> = await clientRepo.find();
    await clientRepo.remove(users);
  });

  afterAll(async () => {
    await connection.destroy();
  });

  it("Success: Must be able to create a client - Full body", async () => {
    const response = await supertest(app)
      .post(baseUrl)
      .send(createClientMock.clientComplete);

    const { password, ...bodyEqual } = createClientMock.clientComplete;
    const expectResults = {
      status: 201,
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

  it("Error: Must not be able to create a client - Email already exists", async () => {
    await clientRepo.save(createClientMock.clientUnique);

    const response = await supertest(app)
      .post(baseUrl)
      .send(createClientMock.clientUnique);

    const expectResults = {
      status: 409,
      bodyMessage: { message: "Email already exists" },
    };

    expect(response.status).toBe(expectResults.status);

    expect(response.body).toStrictEqual(expectResults.bodyMessage);
  });

  it("Error: Must not be able to create a client - Invalid full body", async () => {
    const response = await supertest(app)
      .post(baseUrl)
      .send(createClientMock.clientInvalidBody);

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

  it("Error: Must not be able to create a client - Invalid password", async () => {
    const response = await supertest(app)
      .post(baseUrl)
      .send(createClientMock.clientInvalidPassword);

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

  it("Error: Must not be able to create a client - Invalid phone", async () => {
    const response = await supertest(app)
      .post(baseUrl)
      .send(createClientMock.clientInvalidPhone);

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
});
