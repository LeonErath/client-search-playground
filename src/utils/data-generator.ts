import { delay } from "./async-utils";
import { faker } from "@faker-js/faker";

export enum ContactAmount {
  SMALL = 10_000,
  MEDIUM = 100_000,
  LARGE = 1_000_000,
}

export const generateContacts = async (count: number) => {
  const contacts = [];
  const chunkSize = 10_000;

  for (let i = 0; i < count; i += chunkSize) {
    const chunk = Array.from({ length: chunkSize }, createRandomContact);
    contacts.push(...chunk);
    await delay(1);
  }

  return contacts;
};

export type Contact = {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  birthdate: Date;
  registeredAt: Date;
  phonenumber: string;
};

const createRandomContact = (): Contact => ({
  userId: faker.datatype.uuid(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  email: faker.internet.email(),
  avatar: faker.image.avatar(),
  birthdate: faker.date.birthdate(),
  registeredAt: faker.date.past(),
  phonenumber: faker.phone.number("+49 ##### ####"),
});
