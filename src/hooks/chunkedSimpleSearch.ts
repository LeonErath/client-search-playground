import { delay } from "../utils/async-utils";
import { Contact } from "../utils/data-generator";
import { match } from "./match";
import { SearchFunctionArgs } from "./useSearch";

export const chunkedSimpleSearch = async ({
  contacts,
  searchString,
  callback,
  controller,
}: SearchFunctionArgs) => {
  let aborted = false;
  controller.signal.onabort = () => {
    aborted = true;
  };

  if (searchString.trim().length === 0) {
    callback([]);
    return;
  }

  const chunkSize = 10_000;
  let results: Contact[] = [];
  for (let i = 0; i < contacts.length; i++) {
    if (aborted) {
      return;
    }

    const contact = contacts[i];

    if (match(contact, searchString)) {
      results.push(contact);
    }

    if (i % chunkSize === 0) {
      await delay(1);
    }
  }

  callback(results);
};
