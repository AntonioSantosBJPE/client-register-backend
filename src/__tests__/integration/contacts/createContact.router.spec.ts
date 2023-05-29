import supertest from "supertest";
import { DataSource } from "typeorm";
import app from "../../../app";
import { AppDataSource } from "../../../data-source";
import { Client, Contact } from "../../../entities";
import { createClientMock } from "../../mocks/clients/createClient.router.mock";
import { createContactMock } from "../../mocks/contacts/createContact.router.mock";
import tokenMock from "../../mocks/login/token.mock";

describe("post /contacts", () => {
  let connection: DataSource;

  const baseUrl: string = "/contacts";

  let client: Client;

  const clientRepo = AppDataSource.getRepository(Client);
  const contactRepo = AppDataSource.getRepository(Contact);

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => (connection = res))
      .catch((error) => console.error(error));
  });

  beforeEach(async () => {
    // const contacts: Array<Contact> = await contactRepo.find();
    // await contactRepo.remove(contacts);
  });

  afterAll(async () => {
    await connection.destroy();
  });

  it("Success: Client must be able to create a contact - full body", async () => {
    client = await clientRepo.save({ ...createClientMock.clientComplete });
    const response = await supertest(app)
      .post(baseUrl)
      .set(
        "Authorization",
        `Bearer ${tokenMock.genToken(client.email, client.id)}`
      )
      .send(createContactMock.contactComplete1);

    const { ...bodyEqual } = createContactMock.contactComplete1;
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

  it("Error: Must not be able to create a contact - Contact email already exists in Client", async () => {
    const response = await supertest(app)
      .post(baseUrl)
      .set(
        "Authorization",
        `Bearer ${tokenMock.genToken(client.email, client.id)}`
      )
      .send(createContactMock.contactComplete1);

    const expectResults = {
      status: 409,
      bodyMessage: { message: "Contact email already exists in Client" },
    };

    expect(response.status).toBe(expectResults.status);

    expect(response.body).toStrictEqual(expectResults.bodyMessage);
  });

  it("Error: Client must no be able to create a contact - invalid body", async () => {
    const response = await supertest(app)
      .post(baseUrl)
      .set(
        "Authorization",
        `Bearer ${tokenMock.genToken(client.email, client.id)}`
      )
      .send(createContactMock.contactInvalidBody);

    const expectResults = {
      status: 400,
      bodyMessage: {
        message: {
          name: ["Expected string, received number"],
          email: ["Invalid email"],
          phone: ["Expected string, received number"],
        },
      },
    };

    expect(response.status).toBe(expectResults.status);
    expect(response.body).toStrictEqual(expectResults.bodyMessage);
  });

  it("Error: Client must no be able to create a contact - invalid phone", async () => {
    const response = await supertest(app)
      .post(baseUrl)
      .set(
        "Authorization",
        `Bearer ${tokenMock.genToken(client.email, client.id)}`
      )
      .send(createContactMock.contactInvalidPhone);

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

  it("Error: Client should not be able to update their account - expired token", async () => {
    const response = await supertest(app)
      .post(baseUrl)
      .set(
        "Authorization",
        `Bearer ${tokenMock.jwtExpired(client.email, client.id)}`
      )
      .send(createContactMock.contactComplete1);

    const expectResults = {
      status: 401,
      bodyMessage: { message: "jwt expired" },
    };

    expect(response.status).toBe(expectResults.status);

    expect(response.body).toStrictEqual(expectResults.bodyMessage);
  });

  it("Error: Client should not be able to update their account - invalid token-1", async () => {
    const response = await supertest(app)
      .post(baseUrl)
      .set("Authorization", `Bearer ${tokenMock.invalidSignature}`)
      .send(createContactMock.contactComplete1);

    const expectResults = {
      status: 401,
      bodyMessage: { message: "invalid signature" },
    };

    expect(response.status).toBe(expectResults.status);

    expect(response.body).toStrictEqual(expectResults.bodyMessage);
  });

  it("Error: Client should not be able to update their account - invalid token-2", async () => {
    const response = await supertest(app)
      .post(baseUrl)
      .set("Authorization", `Bearer ${tokenMock.jwtMalformed}`)
      .send(createContactMock.contactComplete1);

    const expectResults = {
      status: 401,
      bodyMessage: { message: "jwt malformed" },
    };

    expect(response.status).toBe(expectResults.status);

    expect(response.body).toStrictEqual(expectResults.bodyMessage);
  });

  it("Error: Client should not be able to update their account - no token", async () => {
    const response = await supertest(app)
      .post(baseUrl)
      .send(createContactMock.contactComplete1);

    const expectResults = {
      status: 401,
      bodyMessage: { message: "Missing bearer token" },
    };

    expect(response.status).toBe(expectResults.status);

    expect(response.body).toStrictEqual(expectResults.bodyMessage);
  });
});
