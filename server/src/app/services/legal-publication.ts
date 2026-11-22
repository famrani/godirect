import {createHash} from 'node:crypto';
export const LEGAL_LANGUAGES=['fr','en','es','it','de','nl','ru'];
export const LEGAL_ROLES=['customer','assetOwner','concierge'];
export const legalFileHash=(bytes:Buffer)=>createHash('sha256').update(bytes).digest('hex');
const canonical=(v:any):any=>Array.isArray(v)?v.map(canonical):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,canonical(v[k])])):v;
export const legalHash=(value:any)=>createHash('sha256').update(JSON.stringify(canonical(value))).digest('hex');
export function legalReference(d:any){return legalHash({title:d?.title||'',version:d?.version||'',text:d?.text||'',attachment:d?.attachment||null});}
export function managedLegalPublished(release:any){return release?.status==='published'&&release.publication?.method==='admin-ui'&&typeof release.publication.by==='string'&&release.publication.contentHash===legalHash(release.documents);}
export function legalPublicationProblems(release:any){const errors:string[]=[];for(const role of LEGAL_ROLES){const fr=release?.documents?.[role]?.fr,reference=legalReference(fr);for(const language of LEGAL_LANGUAGES){const d=release?.documents?.[role]?.[language];if(!d||d.id!==role||d.language!==language||typeof d.title!=='string'||!d.title.trim()||typeof d.version!=='string'||!d.version.trim()||typeof d.text!=='string'||d.text.trim().length<20||d.reviewedReference!==reference)errors.push(role+'/'+language);}}return errors;}

export function legalReleasePublished(release:any){return managedLegalPublished(release)||(release?.status==='published'&&process.env.LEGAL_TERMS_PUBLISHED==='true');}
