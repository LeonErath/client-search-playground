import { RemoteWritableStream } from "remote-web-streams";
import { SearchFunctionArgs } from "../hooks/useSearch";
import { Contact } from "../utils/data-generator";
import { formatTime } from "../utils/time";
import Worker from "../worker/persistentWorker?worker";

export const persistentWorker = new Worker();

export const loadContactsInWorker = (contacts: Contact[]) => {
  const initStart = performance.now();
  const { writable, readablePort } = new RemoteWritableStream();
  persistentWorker.postMessage({ readablePort }, [readablePort]);
  const writer = writable.getWriter();

  writer.write({ contacts, type: "contacts" });

  persistentWorker.onmessage = (message) => {
    if (message.data.status) {
      console.log(
        `Initialized persistent Worker in ${formatTime(
          performance.now() - initStart
        )} with ${contacts.length} contacts.`
      );
    }
  };
};

export const searchInPersistentWorker = ({
  searchString,
  callback,
}: SearchFunctionArgs) => {
  const { writable, readablePort } = new RemoteWritableStream();
  persistentWorker.postMessage({ readablePort }, [readablePort]);
  const writer = writable.getWriter();

  writer.write({ searchString, type: "searchString" });

  persistentWorker.onmessage = (
    event: MessageEvent<{ results?: Contact[] }>
  ) => {
    if (event.data.results) {
      callback(event.data.results);
    }
  };
};
