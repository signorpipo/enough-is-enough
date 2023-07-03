// #region Service Worker Constants

let _ANY_RESOURCE = [".*"];
let _NO_RESOURCE = [];

let _ANY_RESOURCE_FROM_CURRENT_LOCATION = ["^" + _escapeRegexSpecialCharacters(_getCurrentLocation()) + ".*"];
let _ANY_RESOURCE_FROM_CURRENT_ORIGIN = ["^" + _escapeRegexSpecialCharacters(_getCurrentOrigin()) + ".*"];

let _LOCALHOST = ["localhost"];
let _NO_LOCATION = [];

// #endregion Service Worker Constants



// #region Service Worker Setup

// #region BASE SETUP -----------------------------------------------------------------------------------------------------------



// The app name, used, for example, to identify the caches
// When using the Wonderland Engine, u should keep this in sync with the project name found in the Project Settings,
// or manually adjust the bundle.js and .bin file name found in @_myResourceURLsToPrecache
//
// This should not be changed after u have released your app, since it could be used, for example, to look for previous caches
// It's not an issue if u change it, it will just not be able to clean previous caches or use them,
// since it will basically behave like a completely new service worker
let _myAppName = "enoughISenough";



// U should increment this everytime u update the service worker, since it is used by some features to not collide
// with previous service workers
//
// It must be an incremental integer greater than 0
let _myServiceWorkerVersion = 1;



// The cache version
//
// U can increment this when the previous cache is no longer valid due to some changes to your app,
// which might not be compatible anymore with the previous version and could create unpredictable behaviors,
// since u could get a mix of old (from the cache) and new (from the network) resources
//
// It must be an incremental integer greater than 0
let _myCacheVersion = 1;



// This is the list of the resources u want to precache, that means they will be cached on the first load,
// when the service worker is installing and can't catch the fetch events yet
//
// Properly filling this list can potentially make it so your app is ready to work offline on first load,
// otherwise it might require at least a second load, where the service worker will be able to actually catch
// the fetch events and cache the responses itself
// In general, u should precache at least every static resource u have in your app if u want to make it work offline after the first load
//
// The resources URLs can be relative to the service worker location, so, for example,
// for "https://signor-pipo.itch.io/assets/wondermelon.png" u can just specify "assets/wondermelon.png"
// The resources URLs can't be a regex in this case, since it needs to know the specific resource to fetch
let _myResourceURLsToPrecache = [
    "/",
    "wonderland.min.js",
    "wasm-featuredetect.js",
    "f0.png",
    //"WonderlandRuntime-physx.wasm",
    //"WonderlandRuntime-physx.js",
    //"WonderlandRuntime-physx-simd.wasm",
    //"WonderlandRuntime-physx-simd.js",
    //"WonderlandRuntime-physx-threads.wasm",
    //"WonderlandRuntime-physx-threads.js",
    //"WonderlandRuntime-physx-threads.worker.js",
    //"WonderlandRuntime-physx-simd-threads.wasm",
    //"WonderlandRuntime-physx-simd-threads.js",
    //"WonderlandRuntime-physx-simd-threads.worker.js",
    "enough IS enough-bundle.js",
    "enough IS enough.bin",
    "manifest.json",
    "favicon.ico",
    //"icon512.png",
    //"icon192.png",
    //"icon168.png",
    //"icon144.png",
    //"icon96.png",
    //"icon72.png",
    //"icon48.png",
    "1017.png",
    "1428.png",
    "1430.png",
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
    "https://ipfs.filebase.io/ipfs/QmSasURHs9AHTmJA7W98QsZ884zb6VVgFfF85Wf3HpNcBb"
];



// Which resources should be cached
// Note that, as of now, only requests made with a GET method can be cached
//
// The resources URLs can also be a regex
let _myCacheResourceURLsToInclude = [..._ANY_RESOURCE_FROM_CURRENT_LOCATION, "https://ipfs.filebase.io/ipfs/QmSasURHs9AHTmJA7W98QsZ884zb6VVgFfF85Wf3HpNcBb"];
let _myCacheResourceURLsToExclude = _NO_RESOURCE;



// Used to specify if you want to first try the cache or always check the network for updates
//
// The resources URLs can also be a regex
let _myTryCacheFirstResourceURLsToInclude = _ANY_RESOURCE_FROM_CURRENT_LOCATION;
let _myTryCacheFirstResourceURLsToExclude = _NO_RESOURCE;



// If the request tries the cache first, this make it so the cache will be updated (even thought the old cached resource is returned)
// It's important to note that the updated changes will be available starting from the next page load
//
// Beware that this should not be used if the new resources might not be compatible with the old ones, since u could end up
// with a mix of both
// If this is the case, it's better to just increase the cache version, which will cache the new version from scratch
//
// The resources URLs can also be a regex
let _myUpdateCacheInBackgroundResourceURLsToInclude = _NO_RESOURCE;
let _myUpdateCacheInBackgroundResourceURLsToExclude = _NO_RESOURCE;



// If a service worker is being installed in one of these locations, it will be rejected
//
// This is especially useful to avoid using a service worker on development locations like "localhost"
//
// The locations URLs can also be a regex
let _myRejectServiceWorkerLocationURLsToInclude = _LOCALHOST;
let _myRejectServiceWorkerLocationURLsToExclude = _NO_LOCATION;



// Enable some extra logs to better understand what's going on and why things might not be working
let _myLogEnabled = false;



// #endregion BASE SETUP --------------------------------------------------------------------------------------------------------



// #region ADVANCED SETUP -------------------------------------------------------------------------------------------------------



// If a network error happens on any request, this enables the force try cache first on network error feature
//
// The resources URLs can also be a regex
let _myEnableForceTryCacheFirstOnNetworkErrorResourceURLsToInclude = _NO_RESOURCE;
let _myEnableForceTryCacheFirstOnNetworkErrorResourceURLsToExclude = _NO_RESOURCE;



// If a network error happens on any request, this make it so
// that the cache will be tried first by default for these resources
// Useful as a fallback to avoid waiting for all the requests to fail and instead starting to use the cache
//
// The resources URLs can also be a regex
let _myForceTryCacheFirstOnNetworkErrorResourceURLsToInclude = _NO_RESOURCE;
let _myForceTryCacheFirstOnNetworkErrorResourceURLsToExclude = _NO_RESOURCE;



// This is a bit specific, but, for example, even if with wonderland u can cache the bundle.js file and the wonderland.min.js file,
// wonderland normally try to fetch it using URL params and the time of the deploy (possibly to force a cache reload for a new version)
//
// This make it so that u can't precache those files (even if they will be cached on the second load anyway),
// but since u can precache the bundle.js / wonderland.min.js anyway without URL params,
// if u put the bundle.js/wonderland.min.js URLs here, the service worker will try to look in the cache for the requested URL ignoring the URL params
//
// Beware that using this could make u use an old resource which might not be compatible with the new ones
// U should use this only when u know it would not make a difference to use the URL params or if the old resource
// is still ok to use and better than a network error
//
// If u want to use this just to fix the precache issue, but are afraid of the issues related to this feature,
// it might be better to just specify in the precache resource URL the URL params that u know will be used for that resource,
// if that is possible to know (for bundle.s / wonderland.min.js u just have to check out the index.html file)
//
// The resources URLs can also be a regex
let _myTryCacheIgnoringURLParamsResourceURLsToInclude = [
    "bundle\\.js",
    "wonderland.min\\.js"
];
let _myTryCacheIgnoringURLParamsResourceURLsToExclude = _NO_RESOURCE;



// A vary header is used to specify that the resource might be different based on some factors,
// like if the resource is being requested from desktop or mobile
// This could prevent those resources to be retrieved from the cache, since the vary header of the request
// and the cached resource might not match
//
// If u are sure that this does not matter, u can use this to ignore the vary header
//
// The resources URLs can also be a regex
let _myTryCacheIgnoringVaryHeaderResourceURLsToInclude = _NO_RESOURCE;
let _myTryCacheIgnoringVaryHeaderResourceURLsToExclude = _NO_RESOURCE;



// This is the same as @_myTryCacheIgnoringURLParamsAsFallbackResourceURLsToInclude but as a fallback
// for when the requested URL can't be found in any other way
//
// One of the reasons to use @_myTryCacheIgnoringURLParamsAsFallbackResourceURLsToInclude instead of the fallback version,
// is that if u use it as fallback u first have to wait for the fetch to fail, while otherwise it can get it from the cache "instantly",
// even though it is unsafer, due to not even checking if a properly matching version could be fetched from the network
//
// The resources URLs can also be a regex
let _myTryCacheIgnoringURLParamsAsFallbackResourceURLsToInclude = _NO_RESOURCE;
let _myTryCacheIgnoringURLParamsAsFallbackResourceURLsToExclude = _NO_RESOURCE;



// This is the same as @_myTryCacheIgnoringVaryHeaderResourceURLsToInclude but as a fallback
// for when the requested URL can't be found in any other way
//
// One of the reasons to use @_myTryCacheIgnoringVaryHeaderResourceURLsToInclude instead of the fallback version,
// is that if u use it as fallback u first have to wait for the fetch to fail, while otherwise it can get it from the cache "instantly",
// even though it is unsafer, due to not even checking if a properly matching version could be fetched from the network
//
// The resources URLs can also be a regex
let _myTryCacheIgnoringVaryHeaderAsFallbackResourceURLsToInclude = _NO_RESOURCE;
let _myTryCacheIgnoringVaryHeaderAsFallbackResourceURLsToExclude = _NO_RESOURCE;



// Used to cache opaque responses
// Caching opaque responses can lead to a number of issues so use this with caution
// I also advise u to enable the cache update in background when caching opaque responses,
// so to avoid caching a bad opaque response forever
//
// The resources URLs can also be a regex
let _myCacheOpaqueResponseResourceURLsToInclude = _NO_RESOURCE;
let _myCacheOpaqueResponseResourceURLsToExclude = _NO_RESOURCE;



// Use this if u:
// - have updated your app
// - are trying cache first
// - do not feel the need to update the cache version since the new update is compatible with the previous version
// - would like the new resources to be available as soon as possible, without waiting for the cache to be updated in background
// or
// - u are not updating the cache in background, which would mean the new resources will never be fetched again
//
// This feature makes it so that when the new service worker is installed, these resources will not try the cache first
// until they have been fetched again from the network and cached with success
// Basically, this is a way to avoid trying the cache first as long as the resources have not been updated, but still give u
// the chance to use the cache if the fetch fails, since u are not updating the cache version
//
// In general, u should just update the cache version, but if just a few resources have been updated, u don't want
// to make the user wait for everything to be fetched again, and u want the new resources to be available as soon as possible,
// u might want to use this
//
// This is safe to use as long as the new resources are compatible with the current cached ones
// Beware that, until u increase the cache version, the included resource URLs should only "grow",
// because a user might be coming from an even older service worker version which still has the same cache version,
// and should therefore able to refetch every needed resources, not just the one changed between the current and the very last version
//
// The resources URLs can also be a regex
let _myRefetchFromNetworkResourceURLsToInclude = _NO_RESOURCE;
let _myRefetchFromNetworkResourceURLsToExclude = _NO_RESOURCE;



// If some resources must be precached for your service worker to work properly,
// u can specify them here so that the installation will fail if their precache fails
//
// The resources URLs can also be a regex
let _myRejectServiceWorkerOnPrecacheFailResourceURLsToInclude = _NO_RESOURCE;
let _myRejectServiceWorkerOnPrecacheFailResourceURLsToExclude = _NO_RESOURCE;



// The install phase might not have managed to precache every resource due to network errors
//
// Use this to check that the resoruces have been precached on the first fetch of the current service worker session
// If some resources have not been precached, a fetch request will be performed to cache them in background
let _myCheckResourcesHaveBeenPrecachedOnFirstFetch = false;



// Enable this to allow HEAD request to fetch from cache
//
// Note that HEAD requests are NOT cached, they will just check if there is a cached response that was made with a GET,
// and will return that response
// This means that the the returned response will actually have a body, even though HEAD request should not have it
let _myAllowHEADRequestsToFetchFromCache = false;



// Enable this to allow HEAD request to update the cache in background after fetching from the cache
//
// Normally, only when a GET request fetches from the cache it will trigger a cache update in background,
// if @_myUpdateCacheInBackgroundResourceURLsToInclude is enabled for that resource
// This make it so that cached resources will be updated in background even for HEAD requests
//
// Note that the GET request to update the cache in background is created from the HEAD one through the following js code
//
// new Request(headRequest, { method: "GET" })
//
// This should be safe, but it could potentially create a slightly different GET request,
// which could create issues if cached
// 
// Use this with caution
let _myAllowHEADRequestsToUpdateCacheInBackground = false;



// Usually a new service worker is activated when there are no more tabs using the previous one
// This generally happens if the user closes all the tabs or the browser (just refreshing the page does not seem to work)
//
// This flag make it so the service worker is immediately (as soon as possible) activated (without the need to refresh the page), but can cause issues
// due to the fact that the new service worker might be working with data fetched by the previous one in the same session
//
// Beside, when enabling this it would probably be better to also trigger a page reload
// You can add the following js code to your app to achieve the page reload on controller change:
//
// window.navigator.serviceWorker?.addEventListener("controllerchange", function () {
//     window.location.reload();
// });
//
// Note that this js code should be put in your app so that it is executed as soon as possible (for example in the first lines of your index.html),
// so to avoid missing the controller change event
//
// Be aware that the reload might happen while the user is using your app and not just at the beginning,
// which could be annoying (but I'm not sure what the chances are of this actually happening or how to reproduce it)
// Be also aware that this will make every opened page related to this service worker reload, not just the current focused one!
//
// As u can see, handling a service worker activation is a complex topic!
// You might want to look on the internet for solutions that best fit your needs,
// like, for example, asking the user if they want to reload or not
//
// Use this with caution
let _myImmediatelyActivateNewServiceWorker = false;



// When a page is not controlled (usually on the first load), even though the service worker is activated
// it does not actually starts to control the page until it's loaded again,
// since a service worker has to take care of a page from the start
//
// This make it so that the service worker will immediately (as soon as possible) take control over the page even when
// it was not being controlled yet (which basically means that it will be controlled even on the first load)
//
// As for @_myImmediatelyActivateNewServiceWorker, this can potentially cause issues
// due to the fact that the service worker might be fetching the data in a different way compared to not having it,
// and the page fetched at least a bit of data without the service worker, since it was started as soon as possible, but not
// from the beginning
//
// In general, this should not be an issue for the first service worker, unless u have a very specific service worker logic,
// so you should be able to set this to true without worrying too much
//
// The advantages of using this are:
// 1. If the page goes offline on the first load and u need to fetch data, the service worker can already try to use the cache
// 2. The service worker can already cache some data which might be hard (if not impossible) to precache otherwise
//    This is kind of useful, but not reliable, so u still have to properly fill the precache resource URL list yourself if u want your app
//    to work offline even after the first load
//
// If u want to be 100% sure, u can always add the same js code used for @_myImmediatelyActivateNewServiceWorker to reload the page
// when a new service worker takes control of the page, but, in this case, it will reload the page 100% even for the very first load,
// which is annoying but is also what u are trying to achieve with it in this case
//
// window.navigator.serviceWorker?.addEventListener("controllerchange", function () {
//     window.location.reload();
// });
//
// If u don't feel the need to reload the page if it was not initially controlled (and don't want to make the page reload everytime on first load),
// but still would like to enable @_myImmediatelyActivateNewServiceWorker,
// and would like to reload the page when a new service worker is activated,
// u need to specify a different js code to reload the page,
// so to avoid reloading it when it was not initially controlled
//
// let isBeingControlled = window.navigator.serviceWorker?.controller != null;
// window.navigator.serviceWorker?.addEventListener("controllerchange", function () {
//     if (isBeingControlled) {
//         window.location.reload();
//     } else {
//         isBeingControlled = true;
//     }
// });
//
// Note that this js code should be put in your app so that it is executed as soon as possible (for example in the first lines of your index.html),
// so to avoid missing the controller change event
//
// Be aware that the reload might happen while the user is using your app and not just at the beginning,
// which could be annoying (but I'm not sure what the chances are of this actually happening or how to reproduce it)
// Be also aware that this will make every opened page related to this service worker reload, not just the current focused one!
//
// As u can see, again, handling a service worker activation is a complex topic!
// You might want to look on the internet for solutions that best fit your needs,
// like, for example, asking the user if they want to reload or not
//
// Use this with caution
let _myImmediatelyTakeControlOfThePageWhenNotControlled = true;



// #endregion ADVANCED SETUP ----------------------------------------------------------------------------------------------------

// #endregion Service Worker Setup






// #region Service Worker Variables

let _myCheckResourcesHaveBeenPrecachedOnFirstFetchAlreadyPerformed = false; // As of now this is not reset on page reload, but only when using a new tab

let _myForceTryCacheFirstOnNetworkErrorEnabled = false; // As of now this is not reset on page reload, but only when using a new tab

// #endregion Service Worker Variables



// #region Service Worker Events

self.addEventListener("install", function (event) {
    event.waitUntil(_install());
});

self.addEventListener("activate", function (event) {
    event.waitUntil(_activate());
});

self.addEventListener("fetch", function (event) {
    event.respondWith(fetchFromServiceWorker(event.request));
});

// #endregion Service Worker Events



// #region Service Worker Public Functions

async function fetchFromServiceWorker(request) {
    if (_myCheckResourcesHaveBeenPrecachedOnFirstFetch && !_myCheckResourcesHaveBeenPrecachedOnFirstFetchAlreadyPerformed) {
        _myCheckResourcesHaveBeenPrecachedOnFirstFetchAlreadyPerformed = true;
        _cacheResourcesToPrecache(false, false); // Do not await for this, just do it in background
    }

    if (!_shouldHandleRequest(request)) {
        return fetch(request);
    }

    let cacheAlreadyTried = false;

    let refetchFromNetwork = await _shouldResourceBeRefetchedFromNetwork(request.url);

    if (!refetchFromNetwork) {
        let tryCacheFirst = _shouldResourceURLBeIncluded(request.url, _myTryCacheFirstResourceURLsToInclude, _myTryCacheFirstResourceURLsToExclude);
        let forceTryCacheFirstOnNetworkError = _myForceTryCacheFirstOnNetworkErrorEnabled && _shouldResourceURLBeIncluded(request.url, _myForceTryCacheFirstOnNetworkErrorResourceURLsToInclude, _myForceTryCacheFirstOnNetworkErrorResourceURLsToExclude);

        if (tryCacheFirst || forceTryCacheFirstOnNetworkError) {
            cacheAlreadyTried = true;

            // Try to get the resource from the cache
            try {
                let ignoreURLParams = _shouldResourceURLBeIncluded(request.url, _myTryCacheIgnoringURLParamsResourceURLsToInclude, _myTryCacheIgnoringURLParamsResourceURLsToExclude);
                let ignoreVaryHeader = _shouldResourceURLBeIncluded(request.url, _myTryCacheIgnoringVaryHeaderResourceURLsToInclude, _myTryCacheIgnoringVaryHeaderResourceURLsToExclude);
                let responseFromCache = await fetchFromCache(request.url, ignoreURLParams, ignoreVaryHeader);
                if (responseFromCache != null) {
                    if (request.method == "GET" || (_myAllowHEADRequestsToUpdateCacheInBackground && request.method == "HEAD")) {
                        let updateCacheInBackground = _shouldResourceURLBeIncluded(request.url, _myUpdateCacheInBackgroundResourceURLsToInclude, _myUpdateCacheInBackgroundResourceURLsToExclude);
                        if (updateCacheInBackground) {
                            if (request.method == "GET") {
                                _fetchFromNetworkAndPutInCache(request);
                            } else if (request.method == "HEAD") {
                                _fetchFromNetworkAndPutInCache(new Request(request, { method: "GET" }));
                            }
                        }
                    }

                    return responseFromCache;
                }
            } catch (error) {
                // Do nothing, possibly get from cache failed so we should go on and try with the network
            }
        }
    }

    // Try to get the resource from the network
    let [responseFromNetwork, responseHasBeenCached] = await _fetchFromNetworkAndPutInCache(request, true, refetchFromNetwork);
    if (isResponseOk(responseFromNetwork) || isResponseOpaque(responseFromNetwork)) {
        return responseFromNetwork;
    } else {
        if (!_myForceTryCacheFirstOnNetworkErrorEnabled) {
            let enableForceTryCacheFirstOnNetworkError = _shouldResourceURLBeIncluded(request.url, _myEnableForceTryCacheFirstOnNetworkErrorResourceURLsToInclude, _myEnableForceTryCacheFirstOnNetworkErrorResourceURLsToExclude);
            if (enableForceTryCacheFirstOnNetworkError) {
                _myForceTryCacheFirstOnNetworkErrorEnabled = true;

                if (_myLogEnabled) {
                    console.warn("Force try cache on network error enabled");
                }
            }
        }

        if (!cacheAlreadyTried) {
            let ignoreURLParams = _shouldResourceURLBeIncluded(request.url, _myTryCacheIgnoringURLParamsResourceURLsToInclude, _myTryCacheIgnoringURLParamsResourceURLsToExclude);
            let ignoreVaryHeader = _shouldResourceURLBeIncluded(request.url, _myTryCacheIgnoringVaryHeaderResourceURLsToInclude, _myTryCacheIgnoringVaryHeaderResourceURLsToExclude);
            let responseFromCache = await fetchFromCache(request.url, ignoreURLParams, ignoreVaryHeader);
            if (responseFromCache != null) {
                return responseFromCache;
            }
        }

        let ignoreURLParamsAsFallback = _shouldResourceURLBeIncluded(request.url, _myTryCacheIgnoringURLParamsAsFallbackResourceURLsToInclude, _myTryCacheIgnoringURLParamsAsFallbackResourceURLsToExclude);
        let ignoreVaryHeaderAsFallback = _shouldResourceURLBeIncluded(request.url, _myTryCacheIgnoringVaryHeaderAsFallbackResourceURLsToInclude, _myTryCacheIgnoringVaryHeaderAsFallbackResourceURLsToExclude);
        if (ignoreURLParamsAsFallback || ignoreVaryHeaderAsFallback) {
            let fallbackResponseFromCache = await fetchFromCache(request.url, ignoreURLParamsAsFallback, ignoreVaryHeaderAsFallback);
            if (fallbackResponseFromCache != null) {
                if (_myLogEnabled) {
                    console.warn("Get from cache using a fallback: " + request.url);
                }

                return fallbackResponseFromCache;
            }
        }

        if (responseFromNetwork != null) {
            return responseFromNetwork;
        } else {
            return new Response("Invalid response for " + request.url, {
                status: 404,
                headers: { "Content-Type": "text/plain" },
            });
        }
    }
}

async function cacheResourcesToPrecache(rejectOnPrecacheFail = false) {
    return await _cacheResourcesToPrecache(rejectOnPrecacheFail, false);
}

async function fetchFromNetworkAndPutInCache(request, awaitOnlyFetchFromNetwork = false) {
    return await _fetchFromNetworkAndPutInCache(request, awaitOnlyFetchFromNetwork);
}

async function fetchFromNetwork(request) {
    let networkResponse = null;

    try {
        networkResponse = await fetch(request);
    } catch (error) {
        networkResponse = null;

        if (_myLogEnabled) {
            console.error("An error occurred when trying to fetch from the network: " + request.url);
        }
    }

    return networkResponse;
}

async function fetchFromCache(resourceURL, ignoreURLParams = false, ignoreVaryHeader = false) {
    let responseFromCache = null;

    try {
        let currentCacheID = _getCacheID();
        let hasCache = await caches.has(currentCacheID); // Avoid creating the cache when opening it if it has not already been created
        if (hasCache) {
            let currentCache = await caches.open(currentCacheID);
            responseFromCache = await currentCache.match(resourceURL, { ignoreSearch: ignoreURLParams, ignoreVary: ignoreVaryHeader });
        }
    } catch (error) {
        responseFromCache = null;

        if (_myLogEnabled) {
            console.error("An error occurred when trying to get from the cache: " + resourceURL);
        }
    }

    return responseFromCache;
}

async function putInCache(request, response) {
    return await _putInCache(request, response);
}

async function hasInCache(resourceURL, ignoreURLParams = false, ignoreVaryHeader = false) {
    let responseFromCache = await fetchFromCache(resourceURL, ignoreURLParams, ignoreVaryHeader);
    return responseFromCache != null;
}

async function hasInCacheAllResourcesToPrecache(ignoreURLParams = false, ignoreVaryHeader = false) {
    let allResourcesToPreacheAreCached = true;

    let resourceURLsToPrecache = getResourceURLsToPrecache();
    if (resourceURLsToPrecache.length > 0) {
        try {
            let currentCacheID = _getCacheID();
            let hasCache = await caches.has(currentCacheID); // Avoid creating the cache when opening it if it has not already been created
            if (hasCache) {
                let currentCache = await caches.open(currentCacheID);

                allResourcesToPreacheAreCached = true;
                for (let resourceURLToPrecache of resourceURLsToPrecache) {
                    let resourceCompleteURLToPrecache = new Request(resourceURLToPrecache).url;

                    responseFromCache = await currentCache.match(resourceCompleteURLToPrecache, { ignoreSearch: ignoreURLParams, ignoreVary: ignoreVaryHeader });

                    if (responseFromCache == null) {
                        allResourcesToPreacheAreCached = false;
                    }
                }
            } else {
                allResourcesToPreacheAreCached = false;
            }
        } catch (error) {
            allResourcesToPreacheAreCached = false;
        }
    }

    return allResourcesToPreacheAreCached;
}

function getResourceURLsToPrecache() {
    return _myResourceURLsToPrecache;
}

// #endregion Service Worker Public Functions



// #region Service Worker Public Utils

function isResponseOk(response) {
    return response != null && response.status == 200;
}

function isResponseOpaque(response) {
    return response != null && response.status == 0 && response.type.includes("opaque");
}

function shouldResourceBeCached(request, response) {
    let cacheResource = _shouldResourceURLBeIncluded(request.url, _myCacheResourceURLsToInclude, _myCacheResourceURLsToExclude);
    let cacheResourceWithOpaqueResponse = _shouldResourceURLBeIncluded(request.url, _myCacheOpaqueResponseResourceURLsToInclude, _myCacheOpaqueResponseResourceURLsToExclude);
    return cacheResource && (request.method == "GET" && (isResponseOk(response) || (cacheResourceWithOpaqueResponse && isResponseOpaque(response))));
}

// #endregion Service Worker Public Utils



// #region Service Worker Private Functions

async function _install() {
    let rejectServiceWorker = _shouldResourceURLBeIncluded(_getCurrentLocation(), _myRejectServiceWorkerLocationURLsToInclude, _myRejectServiceWorkerLocationURLsToExclude);
    if (rejectServiceWorker) {
        throw new Error("The service worker is not allowed to be installed on the current location: " + _getCurrentLocation());
    }

    if (_myImmediatelyActivateNewServiceWorker) {
        self.skipWaiting();
    }

    await _cacheResourcesToPrecache();
}

async function _activate() {
    await _copyTempCacheToCurrentCache();

    await _deletePreviousCaches();

    await _deletePreviousRefetchFromNetworkChecklists();

    if (_myImmediatelyTakeControlOfThePageWhenNotControlled) {
        self.clients.claim();
    }
}

async function _cacheResourcesToPrecache(rejectOnPrecacheFail = true, useTempCacheIfAlreadyExists = true) {
    if (getResourceURLsToPrecache().length == 0) return;

    let cacheAlreadyExists = false;
    let currentCache = null;
    try {
        cacheAlreadyExists = await caches.has(_getCacheID());
        if (cacheAlreadyExists) {
            currentCache = await caches.open(_getCacheID());
        }
    } catch (error) {
        cacheAlreadyExists = false;
        currentCache = null;
    }

    let useTempCache = useTempCacheIfAlreadyExists && cacheAlreadyExists;

    let currentTempCache = null;
    if (useTempCache) {
        try {
            let tempCacheAlreadyExists = await caches.has(_getTempCacheID());
            if (tempCacheAlreadyExists) {
                currentTempCache = await caches.open(_getTempCacheID());
            }
        } catch (error) {
            currentTempCache = null;
        }
    }

    let promisesToAwait = [];
    for (let resourceURLToPrecache of getResourceURLsToPrecache()) {
        let resourceCompleteURLToPrecache = new Request(resourceURLToPrecache).url;

        promisesToAwait.push(new Promise(async function (resolve, reject) {
            let resourceHasBeenPrecached = false;

            try {
                let resourceHaveToBeCached = false;

                let refetchFromNetwork = await _shouldResourceBeRefetchedFromNetwork(resourceCompleteURLToPrecache);

                if (refetchFromNetwork) {
                    resourceHaveToBeCached = true
                } else if (!cacheAlreadyExists) {
                    resourceHaveToBeCached = true;
                } else {
                    let resourceAlreadyInCache = await currentCache.match(resourceCompleteURLToPrecache) != null;
                    if (!resourceAlreadyInCache) {
                        let resourceAlreadyInTempCache = false;
                        if (useTempCache && currentTempCache != null) {
                            resourceAlreadyInTempCache = await currentTempCache.match(resourceCompleteURLToPrecache) != null;
                        }

                        if (!resourceAlreadyInTempCache) {
                            resourceHaveToBeCached = true;
                        }
                    }
                }

                if (resourceHaveToBeCached) {
                    let [responseFromNetwork, responseHasBeenCached] = await _fetchFromNetworkAndPutInCache(new Request(resourceCompleteURLToPrecache), false, refetchFromNetwork, useTempCache);
                    resourceHasBeenPrecached = responseHasBeenCached;
                } else {
                    resourceHasBeenPrecached = true; // The resource has been already precached
                }
            } catch (error) {
                if (_myLogEnabled) {
                    console.error("Failed to fetch resource to precache: " + resourceCompleteURLToPrecache);
                }
            }

            if (resourceHasBeenPrecached || !rejectOnPrecacheFail) {
                resolve();
            } else {
                let rejectServiceWorkerOnPrecacheFail = _shouldResourceURLBeIncluded(resourceCompleteURLToPrecache, _myRejectServiceWorkerOnPrecacheFailResourceURLsToInclude, _myRejectServiceWorkerOnPrecacheFailResourceURLsToExclude);

                if (!rejectServiceWorkerOnPrecacheFail) {
                    resolve();
                } else {
                    reject();
                }
            }
        }));
    }

    await Promise.all(promisesToAwait);
}

async function _fetchFromNetworkAndPutInCache(request, awaitOnlyFetchFromNetwork = false, refetchFromNetwork = false, useTempCache = false) {
    let responseFromNetwork = await fetchFromNetwork(request);
    let responseHasBeenCached = false;

    if (isResponseOk(responseFromNetwork) || isResponseOpaque(responseFromNetwork)) {
        if (shouldResourceBeCached(request, responseFromNetwork)) {
            if (!awaitOnlyFetchFromNetwork) {
                responseHasBeenCached = await _putInCache(request, responseFromNetwork, useTempCache);

                if (refetchFromNetwork) {
                    await _tickOffFromRefetchFromNetworkChecklist(request.url);
                }
            } else {
                _putInCache(request, responseFromNetwork, useTempCache).then(function (putInCacheSucceeded) {
                    if (putInCacheSucceeded && refetchFromNetwork) {
                        _tickOffFromRefetchFromNetworkChecklist(request.url);
                    }
                });

                responseHasBeenCached = null; // Not awaiting so we can't know
            }
        }
    }

    return [responseFromNetwork, responseHasBeenCached];
}

async function _putInCache(request, response, useTempCache = false) {
    let putInCacheSucceeded = false;

    try {
        let clonedResponse = response.clone();
        let currentCacheID = (useTempCache) ? _getTempCacheID() : _getCacheID();
        let currentCache = await caches.open(currentCacheID);
        await currentCache.put(request, clonedResponse);
        putInCacheSucceeded = true;
    } catch (error) {
        putInCacheSucceeded = false;

        if (_myLogEnabled) {
            console.error("An error occurred when trying to put the response in the cache: " + request.url);
        }
    }

    return putInCacheSucceeded;
}

async function _deletePreviousCaches() {
    let cachesIDs = await caches.keys();
    let currentCacheID = _getCacheID();

    for (let cacheID of cachesIDs) {
        try {
            if (_isCacheID(cacheID) && cacheID != currentCacheID) {
                await caches.delete(cacheID);
            }
        } catch (error) {
            // Do nothing
        }
    }
}

async function _tickOffFromRefetchFromNetworkChecklist(resourceURL) {
    try {
        let refetchChecklist = await caches.open(_getRefetchFromNetworkChecklistID());
        await refetchChecklist.put(new Request(resourceURL), new Response(null));
    } catch (error) {
        if (_myLogEnabled) {
            console.error("An error occurred when trying to put the response in the cache: " + request.url);
        }
    }
}

async function _deletePreviousRefetchFromNetworkChecklists() {
    let cachesIDs = await caches.keys();
    let currentRefetchFromNetworkChecklistID = _getRefetchFromNetworkChecklistID();

    for (let cacheID of cachesIDs) {
        try {
            if (_isRefetchFromNetworkChecklistID(cacheID) && cacheID != currentRefetchFromNetworkChecklistID) {
                await caches.delete(cacheID);
            }
        } catch (error) {
            // Do nothing
        }
    }
}

async function _copyTempCacheToCurrentCache() {
    let currentTempCacheID = _getTempCacheID();

    try {
        let hasTempCache = await caches.has(currentTempCacheID);

        if (hasTempCache) {
            let currentTempCache = await caches.open(currentTempCacheID);
            let currentCache = await caches.open(_getCacheID());

            let currentTempCachedResourceRequests = await currentTempCache.keys();
            for (let currentTempCachedResourceRequest of currentTempCachedResourceRequests) {
                let currentTempCachedResource = await currentTempCache.match(currentTempCachedResourceRequest);
                await currentCache.put(currentTempCachedResourceRequest, currentTempCachedResource);
            }
        }
    } catch (error) {
        // Do nothing
    }

    let cachesIDs = await caches.keys();
    for (let cacheID of cachesIDs) {
        try {
            if (_isTempCacheID(cacheID)) {
                await caches.delete(cacheID);
            }
        } catch (error) {
            // Do nothing
        }
    }
}

// #endregion Service Worker Private Functions



// #region Service Worker Private Utils

function _shouldHandleRequest(request) {
    return request != null && request.url != null && request.method != null &&
        (request.method == "GET" || (_myAllowHEADRequestsToFetchFromCache && request.method == "HEAD"));
}

function _getCacheID(cacheVersion = _myCacheVersion) {
    return _myAppName + "_cache_v" + cacheVersion.toFixed(0);
}

function _getTempCacheID(serviceWorkerVersion = _myServiceWorkerVersion, cacheVersion = _myCacheVersion) {
    return _getCacheID(cacheVersion) + "_temp_v" + serviceWorkerVersion.toFixed(0);
}

function _getRefetchFromNetworkChecklistID(serviceWorkerVersion = _myServiceWorkerVersion) {
    return _myAppName + "_refetch_checklist_v" + serviceWorkerVersion.toFixed(0);
}

function _isCacheID(cacheID) {
    let matchCacheID = new RegExp("^" + _escapeRegexSpecialCharacters(_myAppName) + "_cache_v\\d+$");
    return cacheID.match(matchCacheID) != null;
}

function _isTempCacheID(tempCacheID) {
    let matchTempCacheID = new RegExp("^" + _escapeRegexSpecialCharacters(_myAppName) + "_cache_v\\d+_temp_v\\d+$");
    return tempCacheID.match(matchTempCacheID) != null;
}

function _isRefetchFromNetworkChecklistID(refetchFromNetworkChecklistID) {
    let matchRefetchFromNetworkChecklistID = new RegExp("^" + _escapeRegexSpecialCharacters(_myAppName) + "_refetch_checklist_v\\d+$");
    return refetchFromNetworkChecklistID.match(matchRefetchFromNetworkChecklistID) != null;
}

async function _shouldResourceBeRefetchedFromNetwork(resourceURL) {
    let refetchResourceFromNetwork = false;

    try {
        refetchResourceFromNetwork = _shouldResourceURLBeIncluded(resourceURL, _myRefetchFromNetworkResourceURLsToInclude, _myRefetchFromNetworkResourceURLsToExclude);

        if (refetchResourceFromNetwork) {
            let refetechChecklistID = _getRefetchFromNetworkChecklistID();

            let hasChecklist = await caches.has(refetechChecklistID); // Avoid creating the checklist when opening it if it has not already been created
            if (hasChecklist) {
                let refetchChecklist = await caches.open(refetechChecklistID);
                let refetchChecklistResult = await refetchChecklist.match(resourceURL);

                if (refetchChecklistResult != null) {
                    refetchResourceFromNetwork = false; // It has already been ticked off since it is in the checklist "cache"
                }
            }
        }
    } catch (error) {
        refetchResourceFromNetwork = false;

        if (_myLogEnabled) {
            console.error("An error occurred when trying to check if the resource should be refetched: " + request.url);
        }
    }

    return refetchResourceFromNetwork;
}

// #endregion Service Worker Private Utils



// #region Cauldron Private Utils

function _shouldResourceURLBeIncluded(resourceURL, includeList, excludeList) {
    let includeResourseURL = false;
    for (let includeURL of includeList) {
        if (resourceURL.match(includeURL) != null) {
            includeResourseURL = true;
            break;
        }
    }

    if (includeResourseURL) {
        for (let excludeURL of excludeList) {
            if (resourceURL.match(excludeURL) != null) {
                includeResourseURL = false;
                break;
            }
        }
    }

    return includeResourseURL;
}

function _getCurrentLocation() {
    return self.location.href.slice(0, self.location.href.lastIndexOf("/"));
}

function _getCurrentOrigin() {
    return self.location.origin;
}

function _escapeRegexSpecialCharacters(regexToEscape) {
    let escapeSpecialCharacters = new RegExp("[/\\-\\\\^$*+?.()|[\\]{}]", "g");
    return regexToEscape.replace(escapeSpecialCharacters, "\\$&");
}

// #endregion Cauldron Private Utils