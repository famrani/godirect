(() => {
  const manifests = new Map([
    ['godirect.fr', 'owner'], ['owner.godirect.fr', 'owner-portal'],
    ['admin.godirect.fr', 'admin'], ['concierge.godirect.fr', 'concierge']
  ]);
  const manifest=manifests.get(location.hostname);
  if(!manifest){
    if(location.pathname==='/assets/pwa/install.html')location.replace('https://godirect.fr/assets/pwa/install.html');
    return;
  }
  for (const [rel, href] of [['manifest','/assets/pwa/'+manifest+'.webmanifest'],['apple-touch-icon','/assets/pwa/icon-180.png']]) {
    const el=document.createElement('link'); el.rel=rel; el.href=href; document.head.append(el);
  }
  const theme=document.createElement('meta'); theme.name='theme-color'; theme.content='#173d37';document.head.append(theme);
  if (isSecureContext && 'serviceWorker' in navigator)
    navigator.serviceWorker.register('/godirect-sw.js',{scope:'/'}).catch(e=>console.warn('GoDirect PWA',e));
  if(location.pathname!=='/assets/pwa/install.html') return;
  let prompt;
  addEventListener('beforeinstallprompt',e=>{
    e.preventDefault();prompt=e;document.querySelector('#install').hidden=false;
  });
  addEventListener('DOMContentLoaded',()=>{
    const b=document.querySelector('#install');
    b.onclick=async()=>{if(prompt){const p=prompt;prompt=null;b.hidden=true;await p.prompt();}};
    const installed=()=>{document.querySelector('#status').textContent='GoDirect est installé.';b.hidden=true;};
    if(matchMedia('(display-mode: standalone)').matches||navigator.standalone) installed();
    addEventListener('appinstalled',installed);
  });
})();
