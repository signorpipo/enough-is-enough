const CACHE = 'enoughISenough-cache';

const files = [
    "/",
    "/index.html",
    "/wasm-featuredetect.js",
    "/icon192.png",
    "/manifest.json",
    "/f0.png",
    "/wonderland.min.js",
    "/vr-button.svg",
    "/ar-button.svg",
    "/favicon.ico",
    "/enough%20IS%20enough.bin",
    "/enough%20IS%20enough-bundle.js",
    "/WonderlandRuntime-physx.wasm",
    "/WonderlandRuntime-physx.js",
    "/WonderlandRuntime-physx-simd.wasm",
    "/WonderlandRuntime-physx-simd.js",
    "/WonderlandRuntime-physx-threads.wasm",
    "/WonderlandRuntime-physx-threads.js",
    "/WonderlandRuntime-physx-threads.worker.js",
    "/WonderlandRuntime-physx-simd-threads.wasm",
    "/WonderlandRuntime-physx-simd-threads.js",
    "/WonderlandRuntime-physx-simd-threads.worker.js",
    "/assets/audio/music/you_KNOW_22Hz.wav",
    "/assets/audio/sfx/blather_0.wav",
    "/assets/audio/sfx/blather_1.wav",
    "/assets/audio/sfx/blather_dot.wav",
    "/assets/audio/sfx/clone_appear.wav",
    "/assets/audio/sfx/clone_explode.wav",
    "/assets/audio/sfx/collision.wav",
    "/assets/audio/sfx/evidence_appear.wav",
    "/assets/audio/sfx/evidence_disappear.wav",
    "/assets/audio/sfx/grab.wav",
    "/assets/audio/sfx/hand_piece_appear.wav",
    "/assets/audio/sfx/mr_NOT_appear.wav",
    "/assets/audio/sfx/mr_NOT_disappear.wav",
    "/assets/audio/sfx/mr_NOT_explode.wav",
    "/assets/audio/sfx/mr_NOT_fast_appear.wav",
    "/assets/audio/sfx/NOT_ENOUGH.wav",
    "/assets/audio/sfx/ring_rise.wav",
    "/assets/audio/sfx/throw.wav",
    "/assets/audio/sfx/title_appear.wav",
    "/assets/audio/sfx/title_disappear.wav",
];

self.addEventListener('install', event => {
  precache().then(() => self.skipWaiting());
});

self.addEventListener('fetch', evt => {
  if (evt.request.url.match(/^.*(\?nocache)$/)) {
    return false;
  }
  evt.respondWith(fromNetwork(evt.request, 400).catch(() => {
    return fromCache(evt.request);
  }));

  evt.waitUntil(update(evt.request));
});

function precache() {
  return caches.open(CACHE).then(cache => {
    return cache.addAll(files);
  });
}

function fromNetwork(request, timeout) {

  return new Promise(function (fulfill, reject) {
    var timeoutId = setTimeout(reject, timeout);
    fetch(request.clone()).then(function (response) {
      clearTimeout(timeoutId);
      fulfill(response);
    }, reject);
  });
}

function fromCache(request) {
  return caches.open(CACHE).then(function (cache) {
    return cache.match(request).then(function (matching) {
      return matching || Promise.reject('no-match');
    });
  });
}

function update(request) {
  // return if request is not GET
  if (request.method !== 'GET') return;
  // return if scheme is not http or https
  if (request.url.indexOf('http') !== 0) return;

  return new Promise((fulfill, reject) =>
    caches.open(CACHE).then(
      (cache) => fetch(request.clone()).then(
        (response) => cache.put(request, response).then(fulfill),
        reject
      ))
  )
}