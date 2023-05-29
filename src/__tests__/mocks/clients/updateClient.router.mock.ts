export const updateClientMock = {
  updateclientComplete: {
    name: "Teste22",
    email: "teste22@mail.com",
    password: "123456Ab*",
    phone: "(81)92222-3333",
  },
  updateclientPartial: {
    name: "Teste22",
    email: "teste22@mail.com",
  },
  clientUnique: {
    name: "Unique",
    email: "unique@mail.com",
    password: "12345Ab*",
    phone: "(81)92222-1111",
  },
  updateclientInvalidBody: {
    name: 1234,
    email: "mail.com",
    phone: 666666,
    password: 11111,
  },
  updateclientInvalidPassword: {
    name: "Unique",
    email: "unique@mail.com",
    password: "",
    phone: "(81)92222-1111",
  },
  updateclientInvalidPhone: {
    name: "Unique",
    email: "unique@mail.com",
    password: "12345Ab*",
    phone: "(81)92222-11",
  },
};
