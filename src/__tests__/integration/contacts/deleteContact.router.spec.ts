import supertest from "supertest";
import { DataSource } from "typeorm";
import app from "../../../app";
import { AppDataSource } from "../../../data-source";
import { Client, Contact } from "../../../entities";
import { createClientMock } from "../../mocks/clients/createClient.router.mock";
import { createContactMock } from "../../mocks/contacts/createContact.router.mock";
import tokenMock from "../../mocks/login/token.mock";

describe("DELETE /contacts/:contactId", () => {
  let connection: DataSource;

  const baseUrl: string = "/contacts";
  const invalidIdUrl: string = baseUrl + "/123456";
  const invalidIdUrl2: string =
    baseUrl + "/90e33fb4-e18d-49b0-8d74-c309239f3c1e";
  let validUrl: string;
  let validUrl2: string;

  let client: Client;
  let client2: Client;
  let contact: Contact;
  let contact2: Contact;

  const clientRepo = AppDataSource.getRepository(Client);
  const contactRepo = AppDataSource.getRepository(Contact);

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => (connection = res))
      .catch((error) => console.error(error));
  });

  beforeEach(async () => {});

  afterAll(async () => {
    await connection.destroy();
  });

  it("Success: The client must be able to delete contact", async () => {
    client = await clientRepo.save({ ...createClientMock.clientComplete });
    contact = await contactRepo.save({
      ...createContactMock.contactComplete1,
      client,
    });
    contact2 = await contactRepo.save({
      ...createContactMock.contactComplete2,
      client,
    });

    validUrl = baseUrl + `/${contact.id}`;
    validUrl2 = baseUrl + `/${contact2.id}`;

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

  it("Error: The client must no be able to delete contact, from another client ", async () => {
    client2 = await clientRepo.save({ ...createClientMock.clientUnique });
    const response = await supertest(app)
      .delete(validUrl2)
      .set(
        "Authorization",
        `Bearer ${tokenMock.genToken(client2.email, client2.id)}`
      );

    const expectResults = {
      status: 403,
      bodyMessage: { message: "Insufficient permission" },
    };

    expect(response.status).toBe(expectResults.status);

    expect(response.body).toStrictEqual(expectResults.bodyMessage);
  });

  it("Error: The client must no be able to delete contact - invalid id-1", async () => {
    const response = await supertest(app)
      .delete(invalidIdUrl)
      .set(
        "Authorization",
        `Bearer ${tokenMock.genToken(client.email, client.id)}`
      );

    const expectResults = {
      status: 404,
      bodyMessage: { message: "Contact not found" },
    };

    expect(response.status).toBe(expectResults.status);

    expect(response.body).toStrictEqual(expectResults.bodyMessage);
  });

  it("Error: The client must no be able to delete contact - invalid id-2", async () => {
    const response = await supertest(app)
      .delete(invalidIdUrl2)
      .set(
        "Authorization",
        `Bearer ${tokenMock.genToken(client.email, client.id)}`
      );

    const expectResults = {
      status: 404,
      bodyMessage: { message: "Contact not found" },
    };

    expect(response.status).toBe(expectResults.status);

    expect(response.body).toStrictEqual(expectResults.bodyMessage);
  });

  it("Error: The client must no be able to delete contact - invalid token-1", async () => {
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

  it("Error: The client must no be able to delete contact - invalid token-2", async () => {
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

  it("Error: The client must no be able to delete contact - no token", async () => {
    const response = await supertest(app).delete(validUrl);

    const expectResults = {
      status: 401,
      bodyMessage: { message: "Missing bearer token" },
    };

    expect(response.status).toBe(expectResults.status);

    expect(response.body).toStrictEqual(expectResults.bodyMessage);
  });

  it("Error: The client must no be able to delete contact - expired token", async () => {
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
});
