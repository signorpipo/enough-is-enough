const CACHE = "enoughISenough-cache";

const files = [
    "/",
    "index.html",
    "wasm-featuredetect.js",
    "icon192.png",
    "manifest.json",
    "f0.png",
    "wonderland.min.js",
    "vr-button.svg",
    "ar-button.svg",
    "favicon.ico",
    "enough IS enough.bin",
    "enough IS enough-bundle.js",
    "WonderlandRuntime-physx.wasm",
    "WonderlandRuntime-physx.js",
    "WonderlandRuntime-physx-simd.wasm",
    "WonderlandRuntime-physx-simd.js",
    "WonderlandRuntime-physx-threads.wasm",
    "WonderlandRuntime-physx-threads.js",
    "WonderlandRuntime-physx-threads.worker.js",
    "WonderlandRuntime-physx-simd-threads.wasm",
    "WonderlandRuntime-physx-simd-threads.js",
    "WonderlandRuntime-physx-simd-threads.worker.js",
    "assets/audio/music/you_KNOW_22Hz.wav",
    "assets/audio/sfx/blather_0.wav",
    "assets/audio/sfx/blather_1.wav",
    "assets/audio/sfx/blather_dot.wav",
    "assets/audio/sfx/clone_appear.wav",
    "assets/audio/sfx/clone_explode.wav",
    "assets/audio/sfx/collision.wav",
    "assets/audio/sfx/evidence_appear.wav",
    "assets/audio/sfx/evidence_disappear.wav",
    "assets/audio/sfx/grab.wav",
    "assets/audio/sfx/hand_piece_appear.wav",
    "assets/audio/sfx/mr_NOT_appear.wav",
    "assets/audio/sfx/mr_NOT_disappear.wav",
    "assets/audio/sfx/mr_NOT_explode.wav",
    "assets/audio/sfx/mr_NOT_fast_appear.wav",
    "assets/audio/sfx/NOT_ENOUGH.wav",
    "assets/audio/sfx/ring_rise.wav",
    "assets/audio/sfx/throw.wav",
    "assets/audio/sfx/title_appear.wav",
    "assets/audio/sfx/title_disappear.wav",
];

// This force using the cache first if the network is failing for cached resources
var forceTryCacheFirst = false;

self.addEventListener('install', evt => {
    evt.waitUntil(precache());
});

self.addEventListener("fetch", (event) => {
    event.respondWith(getResource(event.request, true));
});

async function precache() {
    let cache = await caches.open(CACHE);

    for (let file of files) {
        try {
            await cache.add(file);
        } catch (error) {
            console.error("Can't precache " + file);
        }
    }
}

// With tryCacheFirst you can specify if you want to first try the cache or always check the network for updates
// If cache is checked first, you could have an updated resources not being downloaded until cache is cleaned
async function getResource(request, tryCacheFirst = true, disableForceTryCacheFirst = false) {
    if (tryCacheFirst || (forceTryCacheFirst && !disableForceTryCacheFirst)) {
        // Try to get the resource from the cache
        const responseFromCache = await getFromCache(request.url);
        if (responseFromCache) {
            return responseFromCache;
        }
    }

    // Try to get the resource from the network
    try {
        const responseFromNetwork = await fetch(request);

        // response may be used only once
        // we need to save clone to put one copy in cache
        // and serve second one
        await putInCache(request, responseFromNetwork.clone());
        return responseFromNetwork;
    } catch (error) {
        if (!tryCacheFirst) {
            const responseFromCache = await getFromCache(request.url);
            if (responseFromCache) {
                if (!forceTryCacheFirst) {
                    console.error("Forcing cache first because of possible network issues");
                    forceTryCacheFirst = true;
                }

                return responseFromCache;
            }
        }

        // WLE use ? url params to make it so the bundle is not cached
        // but if network fails we can still try to use the cached one
        if (request.url != null) {
            let requestWithoutParamsURL = request.url.split("?")[0];

            const responseFromCacheWithoutParams = await getFromCache(requestWithoutParamsURL);
            if (responseFromCacheWithoutParams) {
                return responseFromCacheWithoutParams;
            }
        }

        return new Response("Network error happened", {
            status: 408,
            headers: { "Content-Type": "text/plain" },
        });
    }
}

async function getFromCache(requestURL) {
    return await caches.match(requestURL);
}

async function putInCache(request, response) {
    // return if request is not GET
    if (request.method !== 'GET') return;

    const cache = await caches.open(CACHE);
    await cache.put(request, response);
}
