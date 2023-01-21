import { match } from "./match";
import { SearchFunctionArgs } from "./useSearch";

export const simpleSearch = ({
  contacts,
  searchString,
  callback,
}: SearchFunctionArgs) => {
  if (searchString.trim().length === 0) {
    callback([]);
    return;
  }

  const results = contacts.filter((contact) => match(contact, searchString));

  callback(results);
};
