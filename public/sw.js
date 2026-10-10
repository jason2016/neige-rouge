// Chemin de l'espace, tire du scope de CE service worker : « /neige-rouge/ » en production,
// « /neige-rouge/recette/ » pour la page de test. Les deux partagent l'origine jason2016.github.io,
// donc le stockage des caches : chacun ne touche qu'aux siens.
const BASE = new URL(self.registration.scope).pathname;
const PROD = BASE === '/neige-rouge/';
const PREFIXE = PROD ? 'neige-rouge-v' : 'nr-recette-v';
const CACHE_NAME = PREFIXE + '3';
// Petit cache de configuration ecrit par la page de suivi (adresse de l'API, cle = BASE + '__api') :
// il doit survivre aux mises a jour, sinon un push arrive sans savoir ou demander le numero.
const CACHE_CONFIG = 'nr-config';
const ASSETS_TO_CACHE = [BASE, BASE + 'index.html'];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys
        .filter(key => key.startsWith(PREFIXE) && key !== CACHE_NAME)   // seulement NOS anciennes versions
        .map(key => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.url.includes('/api/')) return;
  if (event.request.url.includes('mcp.clawshow.ai')) return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});

// « Commande prete » : le serveur envoie un push SANS contenu (pas de chiffrement de charge utile).
// On demande au serveur quel numero annoncer, a partir de notre propre abonnement.
// Si cette demande echoue, on affiche quand meme un avis generique : un push recu doit toujours
// donner une notification visible.
self.addEventListener('push', event => {
  event.waitUntil((async () => {
    let titre = (PROD ? '' : 'TEST — ') + 'Neige Rouge — Votre commande est prête 🍜';
    let url = BASE;
    try {
      const reponse = await (await caches.open(CACHE_CONFIG)).match(BASE + '__api');
      const api = reponse ? await reponse.text() : '';
      const sub = await self.registration.pushManager.getSubscription();
      if (api && sub) {
        const r = await fetch(api + '/api/suivi-push/notification', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endpoint: sub.endpoint }),
        });
        if (r.ok) {
          const d = await r.json();
          titre = (PROD ? '' : 'TEST — ') + `Neige Rouge — Commande ${d.order_number} prête 🍜`;
          url = `${BASE}#suivi?t=${encodeURIComponent(d.suivi_token)}`;
        }
      }
    } catch (e) { /* avis generique */ }
    await self.registration.showNotification(titre, {
      body: 'Présentez votre numéro au comptoir · 您的餐已准备好，请到柜台取餐',
      tag: 'nr-pret', renotify: true, requireInteraction: true,
      vibrate: [400, 200, 400, 200, 400],
      icon: BASE + 'icons/icon-192.png', badge: BASE + 'icons/icon-192.png',
      data: { url },
    });
  })());
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || BASE;
  event.waitUntil((async () => {
    // Uniquement les fenetres controlees par CE service worker : la recette n'ouvre jamais
    // une page de production, et inversement.
    const fenetres = await self.clients.matchAll({ type: 'window' });
    for (const f of fenetres) {
      if ('focus' in f) {
        try { await f.navigate(url); } catch (e) { /* ignore */ }
        return f.focus();
      }
    }
    return self.clients.openWindow(url);
  })());
});
