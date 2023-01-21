import { Contact } from "../utils/data-generator";

export const match = (contact: Contact, searchString: string): boolean =>
  contact.firstName.toLowerCase().includes(searchString.toLowerCase()) ||
  contact.lastName.toLowerCase().includes(searchString.toLowerCase()) ||
  contact.email.toLowerCase().includes(searchString.toLowerCase()) ||
  contact.phonenumber.includes(searchString.toLowerCase()) ||
  contact.phonenumber.trim().includes(searchString.trim()) ||
  `${contact.firstName.toLowerCase()} ${contact.lastName.toLowerCase()}`.includes(
    searchString.toLowerCase()
  );
