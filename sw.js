/* Service worker – מאפשר עבודה ללא רשת.
   index.html ו-data.js נטענים תמיד מהרשת כשיש רשת (כדי לקבל עדכונים), ומהמטמון כשאין.
   תמונות נשמרות במטמון בהתקנה. כשמוסיפים תמונה חדשה – להוסיף לרשימה למטה ולהעלות את VERSION. */
const VERSION='v1';
const CACHE='tlv-sop-'+VERSION;
const IMAGES=["areas-north.jpg", "areas-south.jpg", "armon-ext-high.jpg", "armon-ext-jordan.jpg", "armon-ext-llbg.jpg", "armon-ext-routes.jpg", "armon.jpg", "arrival.jpg", "atmas-role.jpg", "ats-1.jpg", "ats-2.jpg", "bait-haravot.jpg", "bait.jpg", "dafna.jpg", "errez.jpg", "exp-handoff.jpg", "fuel-dump.jpg", "haifa-1.jpg", "haifa-2.jpg", "handoff.jpg", "holding.jpg", "ivona-rapiv.jpg", "jotron-1.jpg", "jotron-2.jpg", "ktav-17.jpg", "new-view.jpg", "sec-arr-1.jpg", "sec-arr-2.jpg", "sec-dep-1.jpg", "sec-dep-2.jpg", "sec-map.jpg", "sec-ovfe.jpg", "sec-ovfw.jpg", "sid-nat.jpg", "sid-patzael.jpg", "south-airspace.jpg", "south-infra.jpg", "south-routing.jpg", "take-sector-1.jpg", "take-sector-2.jpg"];
const CORE=['./','index.html','data.js','icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE.concat(IMAGES.map(i=>'img/'+i)))).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url); if(u.origin!==location.origin) return;
  const core=u.pathname.endsWith('/')||u.pathname.endsWith('index.html')||u.pathname.endsWith('data.js');
  if(core){ e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(CACHE).then(c=>c.put(e.request,cp));return r;}).catch(()=>caches.match(e.request))); }
  else { e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(r2=>{const cp=r2.clone();caches.open(CACHE).then(c=>c.put(e.request,cp));return r2;}))); }
});
