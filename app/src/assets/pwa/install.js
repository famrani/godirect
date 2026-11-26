(() => {
  const manifests = new Map([
    ['godirect.fr', 'owner'], ['owner.godirect.fr', 'owner-portal'],
    ['admin.godirect.fr', 'admin'], ['concierge.godirect.fr', 'concierge']
  ]);
  const host=location.hostname.toLowerCase();
  const prefix=/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.godirect\.fr$/.test(host) && !['www.godirect.fr','client.godirect.fr'].includes(host);
  const manifest=manifests.get(host)||(host==='www.godirect.fr'?'owner':prefix?'site':null);
  if(!manifest){
    if(location.pathname==='/assets/pwa/install.html')location.replace('https://godirect.fr/assets/pwa/install.html');
    return;
  }
  const link=document.createElement('link');link.rel='manifest';link.href='/assets/pwa/'+manifest+'.webmanifest';document.head.append(link);
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
