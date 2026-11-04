import { FirebaseService } from './firebase.service.js';
export const ASSET_TYPES = ['boat','car','parking','property','pool'] as const;
export type AssetType = typeof ASSET_TYPES[number];
export function isAssetType(type:string): type is AssetType { return (ASSET_TYPES as readonly string[]).includes(type); }
export function assetPath(type:string,id:string):string {
 if(!isAssetType(type)|| !/^[a-zA-Z0-9_-]+$/.test(id)) throw new Error('invalid_asset_scope');
 return `assets/${type}/${id}`;
}
export async function findAsset(firebase:FirebaseService,id:string, type?:string):Promise<any|null> {
 if(!/^[a-zA-Z0-9_-]+$/.test(id))return null;
 if(type){if(!isAssetType(type))return null;const a=(await firebase.db.ref(assetPath(type,id)).once('value')).val();return a?{...a,id,assetType:type}:null;}
 for(const candidate of ASSET_TYPES){const asset=(await firebase.db.ref(assetPath(candidate,id)).once('value')).val();if(asset)return {...asset,id,assetType:candidate};}
 return null;
}
export function bookingIndexPaths(booking:any,path:string):Record<string,string>{
 const {assetType:t,assetId:a,id,customerId:c,ownerId:o}=booking;
 if(!isAssetType(t)|| !/^[a-zA-Z0-9_-]+$/.test(a)|| !/^[a-zA-Z0-9_-]+$/.test(id))throw new Error('invalid_booking_scope');
 return {[`bookingsByAsset/${t}/${a}/${id}`]:path,[`bookingsByCustomer/${c}/${t}/${id}`]:path,[`bookingsByOwner/${o}/${t}/${a}/${id}`]:path};
}
