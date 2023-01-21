import { match } from "../hooks/match";
import { Contact } from "../utils/data-generator";
import { fromReadablePort } from "remote-web-streams";

type WorkerArgs = {
  contacts: Contact[];
  searchString: string;
};

const simpleSearch = ({ contacts, searchString }: WorkerArgs) => {
  const results = contacts.filter((contact) => match(contact, searchString));
  self.postMessage({ results: results.slice(0, 40) });
};

let contacts: Contact[] = [];
self.onmessage = async (event: MessageEvent<{ readablePort: MessagePort }>) => {
  const { readablePort } = event.data;
  const readable = fromReadablePort(readablePort);

  const data = await readable.getReader().read();

  if (!data.value) {
    return;
  }

  if (data.value.contacts) {
    contacts = data.value.contacts;
    self.postMessage({ status: "initialized" });
  } else {
    simpleSearch({
      contacts,
      searchString: data.value.searchString,
    });
  }
};

export {};
