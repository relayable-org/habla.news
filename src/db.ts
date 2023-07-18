import { SimplePool } from "nostr-tools";
import { LONG_FORM, HIGHLIGHT } from "@habla/const";

const memoize = (fn) => {
  const cache = new Map();

  return (...args) => {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    cache.set(
      key,
      fn(...args).catch((error) => {
        // Delete cache entry if API call fails
        cache.delete(key);
        return Promise.reject(error);
      })
    );

    return cache.get(key);
  };
};

const relays = [
  "wss://relayable.org/",
  "wss://relay.n057r.club/",
  "wss://nostr-pub.wellorder.net/",
  "wss://nos.lol/",
];
const pool = new SimplePool(relays);

async function getNostrPost(pubkey, slug) {
  const filter = {
    kinds: [30023],
    authors: [pubkey],
    "#d": [slug],
  };
  const event = await pool.get(relays, filter);
  return event;
}

export const getPost = memoize(getNostrPost);

async function getNostrPosts(pubkey) {
  const filters = [
    {
      kinds: [LONG_FORM],
      authors: [pubkey],
    },
  ];
  return pool.list(relays, filters);
}

export const getPosts = memoize(getNostrPosts);

async function getNostrEvents(pubkey) {
  const filters = [
    {
      kinds: [LONG_FORM, HIGHLIGHT],
      authors: [pubkey],
    },
  ];
  return pool.list(relays, filters);
}

export const getEvents = memoize(getNostrEvents);

async function getNostrProfile(pubkey) {
  const filter = {
    kinds: [0],
    authors: [pubkey],
  };
  const ev = await pool.get(relays, filter);
  return JSON.parse(ev.content);
}

export const getProfile = memoize(getNostrProfile);
