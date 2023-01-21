import { match } from "../hooks/match";
import { Contact } from "../utils/data-generator";
import { fromReadablePort } from "remote-web-streams";

type WorkerArgs = {
  contacts: Contact[];
  searchString: string;
};

const simpleSearch = ({ contacts, searchString }: WorkerArgs) => {
  const results = contacts.filter((contact) => match(contact, searchString));
  self.postMessage(results.slice(0, 40));
};

self.onmessage = async (event: MessageEvent<{ readablePort: MessagePort }>) => {
  const { readablePort } = event.data;
  const readable = fromReadablePort(readablePort);

  const data = await readable.getReader().read();

  if (data.value) {
    console.log("receiving..");

    simpleSearch({
      contacts: data.value.contacts,
      searchString: data.value.searchString,
    });
  }
};

export {};
