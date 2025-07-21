// Service Worker for Firebase Auth Caching Optimization
const CACHE_NAME = 'restjam-firebase-auth-v1'
const FIREBASE_CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

// Firebase auth URLs to cache with longer TTL
const FIREBASE_AUTH_URLS = [
  'https://www.gstatic.com/firebasejs/',
  'https://restjam-6dd35.firebaseapp.com/__/auth/iframe.js',
  'https://restjam-6dd35.firebaseapp.com/__/auth/handler',
  'https://firebase.googleapis.com/v1/projects/',
]

self.addEventListener('install', (event) => {
  console.log('RestJAM Service Worker: Installing...')
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  console.log('RestJAM Service Worker: Activating...')
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('RestJAM Service Worker: Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  return self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)
  
  // Only handle Firebase auth requests
  const isFirebaseAuth = FIREBASE_AUTH_URLS.some(authUrl => 
    url.href.includes(authUrl) || url.hostname.includes('firebaseapp.com')
  )

  if (isFirebaseAuth) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            // Check if cached response is still valid (24 hours)
            const cacheDate = new Date(cachedResponse.headers.get('sw-cache-date'))
            const now = new Date()
            
            if (now - cacheDate < FIREBASE_CACHE_DURATION) {
              console.log('RestJAM SW: Serving Firebase auth from cache:', url.href)
              return cachedResponse
            }
          }

          // Fetch new response and cache it
          return fetch(event.request).then((response) => {
            if (response.ok) {
              const responseClone = response.clone()
              
              // Add custom cache date header
              const headers = new Headers(responseClone.headers)
              headers.set('sw-cache-date', new Date().toISOString())
              headers.set('Cache-Control', 'public, max-age=86400') // 24 hours
              
              const cachedResponse = new Response(responseClone.body, {
                status: responseClone.status,
                statusText: responseClone.statusText,
                headers: headers
              })
              
              cache.put(event.request, cachedResponse)
              console.log('RestJAM SW: Cached Firebase auth resource:', url.href)
            }
            
            return response
          }).catch((error) => {
            console.error('RestJAM SW: Fetch failed for:', url.href, error)
            // Return cached version if available, even if expired
            return cachedResponse || new Response('Network error', { status: 503 })
          })
        })
      })
    )
  }
})