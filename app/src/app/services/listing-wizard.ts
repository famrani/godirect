export const LISTING_WIZARD_STEPS=['details','photos','pricing','documents'];
const numeric=(v:any)=>typeof v==='number'&&Number.isFinite(v);
export function listingStepValid(form:any,step:number):boolean{
 if(step===0)return ['boat','car','property','parking','pool'].includes(form.assetType)&&!!String(form.name||'').trim()&&String(form.name).trim().length<=120&&String(form.description||'').length<=10000&&Object.values(form.properties||{}).every(v=>v===null||v===undefined||typeof v==='boolean'||typeof v==='string'&&v.length<=1000||numeric(v)&&Number(v)>=0)&&(!['parking','pool','property'].includes(form.assetType)||(!!String(form.location?.city||'').trim()&&!!String(form.location?.country||'').trim()));
 if(step===1)return true;
 return ['percentage','fixed'].includes(form.depositType)&&form.pricing?.currency==='EUR'&&numeric(form.pricing?.basePrice)&&form.pricing.basePrice>0&&form.pricing.basePrice<=1000000&&['hour','day','night'].includes(form.pricing.pricingUnit)&&numeric(form.depositPercent)&&form.depositPercent>=0&&form.depositPercent<=(form.depositType==='percentage'?100:1000000)&&numeric(form.securityDeposit)&&form.securityDeposit>=0&&form.securityDeposit<=1000000;
}
export function listingPhotoFileValid(file:{type:string,size:number}):boolean{return ['image/jpeg','image/png','image/webp','image/avif','image/gif'].includes(file.type)&&file.size>0&&file.size<=12*1024*1024;}

export function sanitizedListingForm(form:any):any{return {...form,properties:Object.fromEntries(Object.entries(form.properties||{}).filter(([,v])=>v!==null&&v!==undefined))};}
