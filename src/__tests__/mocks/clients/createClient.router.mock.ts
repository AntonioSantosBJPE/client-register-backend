export const createClientMock = {
  clientComplete: {
    name: "Teste",
    email: "teste@mail.com",
    password: "12345Ab*",
    phone: "(81)92222-1111",
  },
  clientUnique: {
    name: "Unique",
    email: "unique@mail.com",
    password: "12345Ab*",
    phone: "(81)92222-1111",
  },
  clientInvalidBody: {
    name: 1234,
    email: "mail.com",
    phone: 666666,
    password: 11111,
  },
  clientInvalidPassword: {
    name: "Unique",
    email: "unique@mail.com",
    password: "",
    phone: "(81)92222-1111",
  },
  clientInvalidPhone: {
    name: "Unique",
    email: "unique@mail.com",
    password: "12345Ab*",
    phone: "(81)92222-11",
  },
};
