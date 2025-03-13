self.addEventListener("install", (event) => {
    console.log("Service Worker installé");
    event.waitUntil(self.skipWaiting());
  });
  
  self.addEventListener("activate", (event) => {
    console.log("Service Worker activé");
    event.waitUntil(self.clients.claim());
  });
  
  self.addEventListener("fetch", (event) => {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  });
  