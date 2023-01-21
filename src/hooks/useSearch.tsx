import { useEffect, useState } from "react";
import {
  Contact,
  ContactAmount,
  generateContacts,
} from "../utils/data-generator";
import { formatTime } from "../utils/time";
import { chunkedSimpleSearch } from "./chunkedSimpleSearch";
import {
  loadContactsInWorker,
  searchInPersistentWorker,
} from "./persistentWorkerSearch";
import { simpleSearch } from "./simpleSearch";
import { searchInWorker } from "./workerSearch";
import { searchInWorkerWithStreams } from "./workerSearchStreams";

const searchTypes = [
  "simple",
  "simple_chunked",
  "worker",
  "worker_stream",
  "persistent_worker",
] as const;
export type SearchType = typeof searchTypes[number];

export type SearchHook = {
  contactsToRender: Contact[];
  searchString: string;
  setSearchString: (searchString: string) => void;
};

export type SearchFunctionArgs = {
  contacts: Contact[];
  searchString: string;
  callback: (c: Contact[]) => void;
  controller: AbortController;
};

let start: number | null = null;

export const useSearch = (defaultType: SearchType) => {
  const [amount, setAmount] = useState<ContactAmount>(ContactAmount.SMALL);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchResults, setSearchResults] = useState<Contact[]>([]);
  const [searchString, setSearchString] = useState("");
  const [time, setTime] = useState<number | null>(null);
  const [type, setType] = useState(defaultType);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadContactsInWorker(contacts);
  }, [contacts]);

  useEffect(() => {
    setLoading(true);

    generateContacts(amount)
      .then((c) => setContacts(c))
      .finally(() => setLoading(false));
    setSearchResults([]);
    setSearchString("");
    start = null;
  }, [amount]);

  useEffect(() => {
    if (searchString.trim().length < 2) return;

    setLoading(true);
    const controller = new AbortController();

    if (!start) {
      start = performance.now();
    }

    const callback = (result: Contact[]) => {
      if (!start) return;

      const end = performance.now();
      setTime(end - start);
      setSearchResults(result);
      setLoading(false);
      console.log(`[${type}] Search completed (${formatTime(end - start)}).`);

      start = null;
    };

    let cleanups: (() => void)[] = [];

    if (type === "simple") {
      simpleSearch({
        contacts,
        searchString,
        controller,
        callback,
      });
    }
    if (type === "simple_chunked") {
      chunkedSimpleSearch({
        contacts,
        searchString,
        controller,
        callback,
      });
    }

    if (type === "worker") {
      const cleanup = searchInWorker({
        contacts,
        searchString,
        controller,
        callback,
      });
      cleanups.push(cleanup);
    }
    if (type === "worker_stream") {
      const cleanup = searchInWorkerWithStreams({
        contacts,
        searchString,
        controller,
        callback,
      });
      cleanups.push(cleanup);
    }
    if (type === "persistent_worker") {
      searchInPersistentWorker({
        contacts,
        searchString,
        controller,
        callback,
      });
    }

    return () => {
      controller.abort();
      cleanups.forEach((cleanup) => cleanup());
    };
  }, [searchString]);

  useEffect(() => {
    setSearchResults([]);
    setSearchString("");
    start = null;
  }, [type]);

  const contactsToRender =
    searchString.trim().length === 0
      ? contacts.slice(0, 40)
      : searchResults.slice(0, 40);

  return {
    amount,
    setAmount,
    loading,
    time: formatTime(time),
    searchResults,
    searchString,
    setSearchString,
    contactsToRender,
    type,
    setType,
    searchTypes,
  };
};
