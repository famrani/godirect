import {queueNotification} from './email-notifications.js';
function stable(v:any):string{if(v===undefined)return 'null';if(Array.isArray(v))return '['+v.map(stable).join(',')+']';if(v&&typeof v==='object')return '{'+Object.keys(v).sort().map(k=>JSON.stringify(k)+':'+stable(v[k])).join(',')+'}';return JSON.stringify(v);}
const GROUPS:Record<string,string[]>={presentation:['name','headline','description','translations'],photos:['media'],pricing:['pricing','paymentPolicy'],details:['properties'],location:['location'],prefix:['prefix'],site:['siteContentRevision']};
export function listingChanges(before:any,after:any):string[]{return Object.entries(GROUPS).filter(([,fields])=>fields.some(key=>stable(before?.[key])!==stable(after?.[key]))).map(([group])=>group);}
/** One ID per successful save, stable during Firebase transaction retries. */
export function queueListingUpdate(root:any,before:any,after:any,type:string,assetId:string,actorId:string,saveId:string){const changes=listingChanges(before,after);if(!changes.length)return false;queueNotification(root,{key:saveId,kind:'listing.updated',type,assetId,ownerId:after.ownerId,actorId,changes});return true;}
