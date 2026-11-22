// Network-only. Never persist authenticated pages, APIs, or payment responses.
self.addEventListener('fetch',event=>{
 const req=event.request,url=new URL(req.url);
 if(req.method!=='GET'||req.mode!=='navigate'||url.origin!==self.location.origin||/^\/(api|__)(\/|$)/.test(url.pathname))return;
 event.respondWith(fetch(req).catch(()=>new Response('<!doctype html><html lang="fr"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>GoDirect hors connexion</title><main style="font:1.15rem/1.5 system-ui;color:#173d37;max-width:32rem;margin:12vh auto;padding:1rem"><h1>Vous êtes hors connexion</h1><p>Reconnectez-vous pour consulter les réservations et les messages à jour.</p><a href="">Réessayer</a></main></html>',{status:503,headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'}})));
});
