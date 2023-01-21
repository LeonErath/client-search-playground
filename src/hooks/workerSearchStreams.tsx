import { SearchFunctionArgs } from "../hooks/useSearch";
import { Contact } from "../utils/data-generator";
import StreamWorker from "../worker/streamWorker?worker";
import { RemoteWritableStream } from "remote-web-streams";

export const searchInWorkerWithStreams = ({
  contacts,
  searchString,
  callback,
}: SearchFunctionArgs) => {
  const worker = new StreamWorker();

  const { writable, readablePort } = new RemoteWritableStream();
  worker.postMessage({ readablePort }, [readablePort]);
  const writer = writable.getWriter();

  console.log("writing..");
  writer.write({ contacts, searchString });

  worker.onmessage = (event: MessageEvent<Contact[]>) => {
    callback(event.data);
  };

  return () => worker.terminate();
};
