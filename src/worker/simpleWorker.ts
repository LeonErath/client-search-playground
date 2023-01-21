import { match } from "../hooks/match";
import { Contact } from "../utils/data-generator";

type WorkerArgs = {
  contacts: Contact[];
  searchString: string;
};

const simpleSearch = ({ contacts, searchString }: WorkerArgs) => {
  const results = contacts.filter((contact) => match(contact, searchString));
  self.postMessage(results.slice(0, 40));
};

self.onmessage = (e: MessageEvent<WorkerArgs>) => {
  console.log("receiving..");

  simpleSearch({
    contacts: e.data.contacts,
    searchString: e.data.searchString,
  });
};

export {};
