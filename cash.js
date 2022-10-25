const CACHE = 'cache-only-v1';

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE).then((cache) => {
            return cache.addAll([
                '/styles.css',
                '/no-image.jpg',
            ]);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(() => {
        caches.open(CACHE).then((cache) =>
        cache.match(request)
            .then((matching) => matching || Promise.reject('no-match'))
        );
    });
});