// Service worker do Aval: recebe os avisos push e abre o site ao tocar neles.
self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()))

self.addEventListener('push', e => {
  let d = {}
  try { d = e.data.json() } catch (_) { d = { titulo: 'Aval', mensagem: e.data ? e.data.text() : '' } }
  e.waitUntil(self.registration.showNotification(d.titulo || 'Aval', {
    body: d.mensagem || '',
    icon: 'icon-192.png',
    tag: 'aval-' + (d.id || Date.now()),
    data: { url: self.registration.scope },
  }))
})

self.addEventListener('notificationclick', e => {
  e.notification.close()
  const url = (e.notification.data && e.notification.data.url) || self.registration.scope
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
    for (const c of list) if (c.url.startsWith(self.registration.scope) && 'focus' in c) return c.focus()
    return self.clients.openWindow(url)
  }))
})
