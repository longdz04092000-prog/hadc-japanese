const CACHE = "hadc-v1";
const FILES = [
  "./",
  "index.html",
  "css/style.css",
  "n5/index.html",
  "n5/vocab.html",
  "n5/grammar.html",
  "data/n5-vocab.json",
  "data/n5-grammar.json",
  "manifest.json",
  "icons/icon-192.png",
  "icons/icon-512.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Ưu tiên lấy bản mới từ mạng, mất mạng thì dùng bản đã lưu
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});