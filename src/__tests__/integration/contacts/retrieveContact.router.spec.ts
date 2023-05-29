import supertest from "supertest";
import { DataSource } from "typeorm";
import app from "../../../app";
import { AppDataSource } from "../../../data-source";
import { Client, Contact } from "../../../entities";
import { createClientMock } from "../../mocks/clients/createClient.router.mock";
import { createContactMock } from "../../mocks/contacts/createContact.router.mock";
import tokenMock from "../../mocks/login/token.mock";

describe("GET /contacts/:contactId", () => {
  let connection: DataSource;

  const baseUrl: string = "/contacts";
  const invalidIdUrl: string = baseUrl + "/123456";
  const invalidIdUrl2: string =
    baseUrl + "/90e33fb4-e18d-49b0-8d74-c309239f3c1e";
  let validUrl: string;

  let client: Client;
  let contact: Contact;

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

  it("Success: The client must be able to retrieve contact profile information", async () => {
    client = await clientRepo.save({ ...createClientMock.clientComplete });
    contact = await contactRepo.save({
      ...createContactMock.contactComplete1,
      client,
    });

    validUrl = baseUrl + `/${contact.id}`;

    const response = await supertest(app)
      .get(validUrl)
      .set(
        "Authorization",
        `Bearer ${tokenMock.genToken(client.email, client.id)}`
      );

    const { ...bodyEqual } = createContactMock.contactComplete1;
    const expectResults = {
      status: 200,
    };
    console.log(response.body);
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

  it("Error: The client must no be able to retrieve contact profile information - invalid id-1", async () => {
    const response = await supertest(app)
      .get(invalidIdUrl)
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

  it("Error: The client must no be able to retrieve contact profile information - invalid id-2", async () => {
    const response = await supertest(app)
      .get(invalidIdUrl2)
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

  it("Error: The client must no be able to retrieve contact profile information - invalid token-1", async () => {
    const response = await supertest(app)
      .get(invalidIdUrl2)
      .set("Authorization", `Bearer ${tokenMock.invalidSignature}`);

    const expectResults = {
      status: 401,
      bodyMessage: { message: "invalid signature" },
    };

    expect(response.status).toBe(expectResults.status);

    expect(response.body).toStrictEqual(expectResults.bodyMessage);
  });

  it("Error: The client must no be able to retrieve contact profile information - invalid token-2", async () => {
    const response = await supertest(app)
      .get(invalidIdUrl2)
      .set("Authorization", `Bearer ${tokenMock.jwtMalformed}`);

    const expectResults = {
      status: 401,
      bodyMessage: { message: "jwt malformed" },
    };

    expect(response.status).toBe(expectResults.status);

    expect(response.body).toStrictEqual(expectResults.bodyMessage);
  });

  it("Error: The client must no be able to retrieve contact profile information - no token", async () => {
    const response = await supertest(app).get(invalidIdUrl2);

    const expectResults = {
      status: 401,
      bodyMessage: { message: "Missing bearer token" },
    };

    expect(response.status).toBe(expectResults.status);

    expect(response.body).toStrictEqual(expectResults.bodyMessage);
  });

  it("Error: The client must no be able to retrieve contact profile information - expired token", async () => {
    const response = await supertest(app)
      .get(invalidIdUrl2)
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
