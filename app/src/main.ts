import { assetDomainSlug, setDomainAsset } from './app/services/asset-domain';
import { initializeBoatRouting } from './app/services/boat-routing';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';



if (environment.production) {
  enableProdMode();
}

async function start():Promise<void>{
 if(assetDomainSlug(window.location.hostname)){
  const response=await fetch('/api/asset-domain',{credentials:'same-origin'});
  if(!response.ok)throw new Error('asset_domain_lookup_failed:'+response.status);
  const asset=await response.json();
  if(!['boat','car','property','parking','pool'].includes(asset.assetType)||!/^[a-z0-9][a-z0-9_-]*$/.test(asset.assetId))throw new Error('Invalid asset domain');
  setDomainAsset(asset);
 }
 initializeBoatRouting();
 await platformBrowserDynamic().bootstrapModule(AppModule);
}
start().catch(err=>{
 console.error(err);
 const message=document.createElement('p');message.setAttribute('role','alert');
 message.textContent='Ce sous-domaine ne peut pas être résolu. Vérifiez le déploiement du backend et le préfixe enregistré / Could not resolve this subdomain. Check the deployed backend and saved prefix.'+(String(err?.message||'').startsWith('asset_domain_lookup_failed:')?' (HTTP '+String(err.message).split(':')[1]+')':'');
 document.body.replaceChildren(message);
});
