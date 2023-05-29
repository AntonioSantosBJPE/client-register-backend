export const loginMock = {
  clientActive: {
    name: "Teste",
    email: "teste@mail.com",
    password: "12345Ab*",
    phone: "(81)92222-1111",
  },
  clientInactive: {
    name: "Unique",
    email: "unique@mail.com",
    password: "12345Ab*",
    phone: "(81)92222-1111",
  },
  clientInvalidCredential1: {
    email: "teste@mail.com",
    password: "invalid_credentials",
  },
  clientInvalidCredential2: {
    email: "invalid_credentials@mail.com.br",
    password: "1234",
  },
  clientInvalidCredential3: {
    email: "mail.com",
    password: 11111,
  },
};
