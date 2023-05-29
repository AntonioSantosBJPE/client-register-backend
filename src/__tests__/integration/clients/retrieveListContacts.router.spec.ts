import supertest from "supertest";
import { DataSource } from "typeorm";
import app from "../../../app";
import { AppDataSource } from "../../../data-source";
import { Client, Contact } from "../../../entities";
import { createClientMock } from "../../mocks/clients/createClient.router.mock";
import { createContactMock } from "../../mocks/contacts/createContact.router.mock";
import tokenMock from "../../mocks/login/token.mock";

describe("GET /clients/profile/:clientId/contacts", () => {
  let connection: DataSource;

  const baseUrl: string = "/clients/profile";
  const invalidIdUrl: string = baseUrl + "/123456/contacts";
  const invalidIdUrl2: string =
    baseUrl + "/90e33fb4-e18d-49b0-8d74-c309239f3c1e/contacts";
  let validUrl: string;

  let client: Client;
  let client2: Client;
  let contact: Contact;
  let contact2: Contact;
  let contact3: Contact;
  let listContacts: any[];

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

  it("Success: The client must be able to retrieve list contacts", async () => {
    client = await clientRepo.save({ ...createClientMock.clientComplete });
    contact = await contactRepo.save({
      ...createContactMock.contactComplete1,
      client,
    });
    contact2 = await contactRepo.save({
      ...createContactMock.contactComplete2,
      client,
    });
    contact3 = await contactRepo.save({
      ...createContactMock.contactComplete3,
      client,
    });
    const {
      client: clientCont1,
      deletedAt: delCont1,
      ...contact1Data
    } = contact;
    const {
      client: clientCont2,
      deletedAt: delCont2,
      ...contact2Data
    } = contact2;
    const {
      client: clientCont3,
      deletedAt: delCont3,
      ...contact3Data
    } = contact3;
    listContacts = [contact1Data, contact2Data, contact3Data];

    validUrl = baseUrl + `/${client.id}/contacts`;

    const response = await supertest(app)
      .get(validUrl)
      .set(
        "Authorization",
        `Bearer ${tokenMock.genToken(client.email, client.id)}`
      );

    const expectResults = {
      status: 200,
    };

    expect(response.status).toBe(expectResults.status);
    expect(response.body).toEqual(listContacts);
    expect(response.body).toEqual(expect.any(Array));
    expect(response.body.length).toEqual(3);
  });

  it("Error: The client must no be able to retrieve list contacts, from another client ", async () => {
    client2 = await clientRepo.save({ ...createClientMock.clientUnique });
    const response = await supertest(app)
      .get(validUrl)
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

  it("Error: The client must no be able to retrieve list contacts - invalid id-1", async () => {
    const response = await supertest(app)
      .get(invalidIdUrl)
      .set(
        "Authorization",
        `Bearer ${tokenMock.genToken(client.email, client.id)}`
      );

    const expectResults = {
      status: 403,
      bodyMessage: { message: "Insufficient permission" },
    };

    expect(response.status).toBe(expectResults.status);

    expect(response.body).toStrictEqual(expectResults.bodyMessage);
  });

  it("Error: The client must no be able to retrieve list contacts - invalid id-2", async () => {
    const response = await supertest(app)
      .get(invalidIdUrl2)
      .set(
        "Authorization",
        `Bearer ${tokenMock.genToken(client.email, client.id)}`
      );

    const expectResults = {
      status: 403,
      bodyMessage: { message: "Insufficient permission" },
    };

    expect(response.status).toBe(expectResults.status);

    expect(response.body).toStrictEqual(expectResults.bodyMessage);
  });

  it("Error: The client must no be able to retrieve list contacts - invalid token-1", async () => {
    const response = await supertest(app)
      .get(validUrl)
      .set("Authorization", `Bearer ${tokenMock.invalidSignature}`);

    const expectResults = {
      status: 401,
      bodyMessage: { message: "invalid signature" },
    };

    expect(response.status).toBe(expectResults.status);

    expect(response.body).toStrictEqual(expectResults.bodyMessage);
  });

  it("Error: The client must no be able to retrieve list contacts - invalid token-2", async () => {
    const response = await supertest(app)
      .get(validUrl)
      .set("Authorization", `Bearer ${tokenMock.jwtMalformed}`);

    const expectResults = {
      status: 401,
      bodyMessage: { message: "jwt malformed" },
    };

    expect(response.status).toBe(expectResults.status);

    expect(response.body).toStrictEqual(expectResults.bodyMessage);
  });

  it("Error: The client must no be able to retrieve list contacts - no token", async () => {
    const response = await supertest(app).get(validUrl);

    const expectResults = {
      status: 401,
      bodyMessage: { message: "Missing bearer token" },
    };

    expect(response.status).toBe(expectResults.status);

    expect(response.body).toStrictEqual(expectResults.bodyMessage);
  });

  it("Error: The client must no be able to retrieve list contacts - expired token", async () => {
    const response = await supertest(app)
      .get(validUrl)
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
