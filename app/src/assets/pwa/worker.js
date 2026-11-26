// Network-only. Never persist authenticated pages, APIs, or payment responses.
self.addEventListener('fetch',event=>{
 const req=event.request,url=new URL(req.url);
 if(req.method!=='GET'||req.mode!=='navigate'||url.origin!==self.location.origin||/^\/(api|__)(\/|$)/.test(url.pathname))return;
 event.respondWith(fetch(req).catch(()=>new Response('<!doctype html><html lang="fr"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>GoDirect hors connexion</title><main style="font:1.15rem/1.5 system-ui;color:#173d37;max-width:32rem;margin:12vh auto;padding:1rem"><h1>Vous êtes hors connexion</h1><p>Reconnectez-vous pour consulter les réservations et les messages à jour.</p><a href="">Réessayer</a></main></html>',{status:503,headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'}})));
});
self.addEventListener('push',e=>{let d;try{d=e.data.json().data;}catch{return;}if(!d||!['message','booking','event'].includes(d.kind))return;
 let path=d.kind==='message'&&/^[a-f0-9]{64}$/.test(d.thread)?'/messages?threadId='+d.thread:'/';
 if(d.kind==='booking'&&d.bookingId&&d.assetType&&d.assetId){
  const scope=d.delegated==='1'?'concierge':'owner';
  path='/'+scope+'/activity/reservations?'+new URLSearchParams({bookingId:d.bookingId,assetType:d.assetType,assetId:d.assetId});
 }
 if(d.kind==='event'&&typeof d.path==='string'&&/^\/(?![\/\\])/.test(d.path))path=d.path;
 const title=d.title||(d.kind==='message'?'Message · GoDirect':'Réservation · GoDirect');
 const body=d.body||(d.kind==='message'?'Vous avez reçu un message.':'Nouvelle demande de réservation.');
 const preview={body,...(d.kind==='event'&&d.eventId?{tag:d.eventId}:{}),icon:'/assets/pwa/icon-192.png',data:{path}};
 e.waitUntil(self.registration.showNotification(title,preview));});
self.addEventListener('notificationclick',e=>{e.notification.close();const u=new URL(e.notification.data?.path||'/',self.location.origin);if(u.origin===self.location.origin)e.waitUntil(self.clients.openWindow(u.href));});
