/* Monidoro's service worker - the only file whose whole job is to make the
   installed copy open with no network.

   Two rules are deliberate:

   1. A page is fetched from the network first and only falls back to the cache.
      Cache-first would be faster and would also pin an old Monidoro for as long
      as the cache lived, and this app is deployed by pushing to main - being one
      version stale on a timer whose settings and history shapes keep changing is
      a bug, not a speed-up. Offline, the cached page is exactly what we want.

   2. Anything with a Range header is left alone. The recordings are played
      through <audio>, which asks for byte ranges, and a 206 response cached as
      if it were the whole file breaks the next playback. Music is online-only
      when installed, which the app already handles: with a file missing it
      falls back to its own synthesised melody (NOTES.md, gotcha 13).

   The icon files are cached on demand as well as precached, so a deploy that
   adds a size still works.

   VERSION only needs bumping for the shell list or the cache policy. The page
   itself is network-first, so a new deploy is picked up on the next online load
   without one. */
const VERSION = "2";
const CACHE = "monidoro-v" + VERSION;

// The shell is stored under one canonical key, not under whatever URL happened
// to be asked for. A navigation can carry a query string (?cb= when testing,
// or anything a link adds), and one cache entry per URL is a cache that grows
// for no reason and is harder to fall back to.
const SHELL_KEY = "./monidoro.html";

const SHELL = [
  "./monidoro.html",
  "./manifest.webmanifest",
  "./favicon-32.png",
  "./mark-64.png",
  "./icon-192.png",
  "./icon-512.png",
  "./apple-touch-icon.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (request.headers.has("range")) return;

  if (request.mode === "navigate") {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        // A navigation does not always *reject* when the origin is unreachable:
        // Chromium can resolve it with a synthetic non-ok response (a 502 with
        // an empty body). Caching that is how "offline" turns into a blank
        // page, and it overwrites the good copy while doing it. Only a real,
        // successful page may replace the shell.
        if (response && response.ok) {
          const cache = await caches.open(CACHE);
          cache.put(SHELL_KEY, response.clone());
          return response;
        }
        const hit = (await caches.match(request)) || (await caches.match(SHELL_KEY));
        return hit || response;
      } catch (err) {
        const hit = (await caches.match(request)) || (await caches.match(SHELL_KEY));
        return hit || Response.error();
      }
    })());
    return;
  }

  // Everything else: answer from the cache when possible, and refresh it in the
  // background. A miss goes to the network and is stored for next time.
  event.respondWith(
    caches.match(request).then((hit) => {
      const network = fetch(request)
        .then((response) => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => hit);
      return hit || network;
    })
  );
});
