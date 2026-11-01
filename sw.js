// Service worker: installable app shell + push notifications (Firebase Cloud Messaging)
importScripts('fb.js');
importScripts('https://www.gstatic.com/firebasejs/' + FB_VER + '/firebase-app-compat.js', 'https://www.gstatic.com/firebasejs/' + FB_VER + '/firebase-messaging-compat.js');
firebase.initializeApp(FB_CONFIG);
firebase.messaging();   // shows notifications that arrive while the app is closed

var C = 'abrei-shell-v2', SHELL = ['./', 'index.html', 'fb.js', 'manifest.webmanifest', 'icon-192.png', 'apple-touch-icon.png'];
self.addEventListener('install', function (e) { e.waitUntil(caches.open(C).then(function (c) { return c.addAll(SHELL); })); self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(caches.keys().then(function (k) { return Promise.all(k.filter(function (x) { return x !== C; }).map(function (x) { return caches.delete(x); })); })); self.clients.claim(); });
self.addEventListener('fetch', function (e) {
  if (new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(function (r) { var cp = r.clone(); caches.open(C).then(function (c) { c.put(e.request, cp); }); return r; }).catch(function () { return caches.match(e.request); }));
});
self.addEventListener('notificationclick', function (e) {
  e.notification.close();
  e.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (l) { for (var i = 0; i < l.length; i++) if ('focus' in l[i]) return l[i].focus(); return clients.openWindow('./'); }));
});
