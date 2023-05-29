import supertest from "supertest";
import { DataSource } from "typeorm";
import app from "../../../app";
import { AppDataSource } from "../../../data-source";
import { Client } from "../../../entities";
import { loginMock } from "../../mocks/login/login.router.mock";

describe("POST /login", () => {
  let connection: DataSource;

  const baseUrl: string = "/login";
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

  it("Success: Must be able to login", async () => {
    const client: Client = clientRepo.create(loginMock.clientActive);
    await clientRepo.save(client);

    const response = await supertest(app)
      .post(baseUrl)
      .send(loginMock.clientActive);

    const expectResults = {
      status: 200,
      bodyEqual: { accessToken: expect.any(String) },
    };

    expect(response.status).toBe(expectResults.status);
    expect(response.body).toStrictEqual(expectResults.bodyEqual);
  });

  it("Error: Must not be able to login - Invalid credential 1 - Wrong password", async () => {
    const client: Client = clientRepo.create(loginMock.clientActive);
    await clientRepo.save(client);

    const response = await supertest(app)
      .post(baseUrl)
      .send(loginMock.clientInvalidCredential1);

    const expectResults = {
      status: 401,
      bodyEqual: { message: "Invalid credentials" },
    };

    expect(response.status).toBe(expectResults.status);
    expect(response.body).toStrictEqual(expectResults.bodyEqual);
  });

  it("Error: Must not be able to login - Invalid credential 2 - Wrong email", async () => {
    const client: Client = clientRepo.create(loginMock.clientActive);
    await clientRepo.save(client);

    const response = await supertest(app)
      .post(baseUrl)
      .send(loginMock.clientInvalidCredential2);

    const expectResults = {
      status: 401,
      bodyEqual: { message: "Invalid credentials" },
    };

    expect(response.status).toBe(expectResults.status);
    expect(response.body).toStrictEqual(expectResults.bodyEqual);
  });

  it("Error: Must not be able to login - Invalid credential 3 - User inactive", async () => {
    const client: Client = clientRepo.create(loginMock.clientInactive);
    await clientRepo.save(client);
    await clientRepo.softRemove(client);

    const response = await supertest(app)
      .post(baseUrl)
      .send(loginMock.clientInactive);

    const expectResults = {
      status: 401,
      bodyEqual: { message: "Invalid credentials" },
    };

    expect(response.status).toBe(expectResults.status);
    expect(response.body).toStrictEqual(expectResults.bodyEqual);
  });

  it("Error: Must not be able to login - Invalid credential 4 - Invalid full body", async () => {
    const client: Client = clientRepo.create(loginMock.clientActive);
    await clientRepo.save(client);

    const response = await supertest(app)
      .post(baseUrl)
      .send(loginMock.clientInvalidCredential3);

    const expectResults = {
      status: 400,
      bodyEqual: {
        message: {
          email: ["Invalid email"],
          password: ["Expected string, received number"],
        },
      },
    };

    expect(response.status).toBe(expectResults.status);
    expect(response.body).toStrictEqual(expectResults.bodyEqual);
  });
});
