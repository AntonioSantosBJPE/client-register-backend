export const createContactMock = {
  contactComplete1: {
    name: "contact",
    email: "contact@mail.com",
    phone: "(81)92222-1111",
  },
  contactComplete2: {
    name: "contact2",
    email: "contact2@mail.com",
    phone: "(81)92222-1111",
  },
  contactComplete3: {
    name: "contact3",
    email: "contact3@mail.com",
    phone: "(81)92222-1111",
  },
  contactUnique: {
    name: "Unique",
    email: "unique@mail.com",
    phone: "(81)92222-1111",
  },
  contactInvalidBody: {
    name: 1234,
    email: "mail.com",
    phone: 666666,
  },
  contactInvalidPhone: {
    name: "Unique",
    email: "unique@mail.com",
    phone: "(81)92222-11",
  },
};
