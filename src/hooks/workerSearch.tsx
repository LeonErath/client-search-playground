import { SearchFunctionArgs } from "../hooks/useSearch";
import { Contact } from "../utils/data-generator";
import SimpleWorker from "../worker/simpleWorker?worker";

export const searchInWorker = ({
  contacts,
  searchString,
  callback,
}: SearchFunctionArgs) => {
  const worker = new SimpleWorker();

  console.log("writing..");
  worker.postMessage({ contacts, searchString });

  worker.onmessage = (event: MessageEvent<Contact[]>) => {
    callback(event.data);
  };

  return () => worker.terminate();
};
