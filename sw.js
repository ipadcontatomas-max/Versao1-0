/* STUG Guarda — service worker. Subir V a cada versão. Só guarda a app e mapas; nunca pedidos de pesquisa nem de localização. */
const V='stug-v2',SHELL=['./','index.html','offline.html','manifest.webmanifest','icon-192.png','icon-512.png','apple-touch-icon.png'],
 CDN=['https://unpkg.com/leaflet@1.9.4/dist/leaflet.css','https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'];
self.addEventListener('install',e=>e.waitUntil(caches.open(V).then(async c=>{await c.addAll(SHELL);await Promise.all(CDN.map(u=>c.add(new Request(u,{mode:'cors'})).catch(()=>{})))})));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>!x.startsWith(V)).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener('message',e=>{if(e.data==='SKIP_WAITING')self.skipWaiting()});
const trim=async(c,n)=>{const k=await c.keys();if(k.length>n)await c.delete(k[0])};
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
 if(r.mode==='navigate'){e.respondWith(fetch(r).then(x=>{if(x.ok){const k=x.clone();caches.open(V).then(c=>c.put('index.html',k))}return x}).catch(()=>caches.match('index.html').then(x=>x||caches.match('offline.html'))));return}
 const tile=u.hostname.endsWith('tile.openstreetmap.org');
 if(u.origin===location.origin||u.hostname==='unpkg.com'||tile)e.respondWith(caches.match(r).then(h=>{const n=fetch(r).then(x=>{if(x.ok||x.type==='opaque'){const k=x.clone();caches.open(tile?V+'-tiles':V).then(async c=>{await c.put(r,k);if(tile)trim(c,400)})}return x}).catch(()=>h);return h||n}))});
