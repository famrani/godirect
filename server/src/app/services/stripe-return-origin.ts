import {domainAssetId} from './asset-domain.js';
import {findAsset} from './asset-paths.service.js';
export async function stripeReturnOrigin(store:any,ownerId:string,candidate:string,configured:string):Promise<string>{
 const invalid=()=>Object.assign(Error('invalid_stripe_return_origin'),{status:400});
 let front:URL,url:URL;try{front=new URL(configured);url=new URL(candidate||configured);}catch{throw invalid();}
 if(url.username||url.password||url.search||url.hash||!['','/'].includes(url.pathname))throw invalid();
 if(url.origin===front.origin&&(url.protocol==='https:'||(url.protocol==='http:'&&['localhost','127.0.0.1'].includes(url.hostname))))return url.origin;
 if(url.protocol==='https:'&&!url.port&&['godirect.fr','www.godirect.fr','owner.godirect.fr'].includes(url.hostname))return url.origin;
 const slug=domainAssetId(url.hostname);
 if(url.protocol!=='https:'||url.port||!slug)throw invalid();
 const alias=(await store.db.ref('assetPrefixes/'+slug).once('value')).val();
 if(!alias)throw invalid();
 const asset=await findAsset(store,String(alias.assetId),String(alias.assetType));
 if(!asset||asset.deletedAt||asset.ownerId!==ownerId)throw invalid();
 return url.origin;
}
