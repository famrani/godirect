import type {Request,Response} from 'express';import type {FirebaseService} from './firebase.service.js';
const fail=(status:number,code:string)=>Object.assign(Error(code),{status});
const blocked=(p:any)=>['disabled','blocked','suspended','deleted'].includes(String(p?.state||'').toLowerCase());
/** Authentication metadata only. Business roles, Stripe links and legal acceptance are never client inputs. */
export class AuthSessionService {
 constructor(private store:FirebaseService){}
 sync=async(req:Request,res:Response)=>{
  res.setHeader('Cache-Control','no-store');const token=/^Bearer\s+(.+)$/i.exec(String(req.headers.authorization||''))?.[1];if(!token)throw fail(401,'authentication_required');let identity:any;
  try{identity=await this.store.auth.verifyIdToken(token,true);}catch{throw fail(401,'invalid_authentication');}
  const user=await this.store.auth.getUser(identity.uid);if(user.disabled)throw fail(403,'account_disabled');const ref=this.store.db.ref(`backendusers/${identity.uid}`);await ref.once('value');const now=Date.now();
  const result=await ref.transaction((old:any)=>{if(blocked(old))return;const base=old||{role:'customer',state:'active',createdTS:now};const name=String(base.displayName||[base.firstname||base.firstName,base.lastname||base.lastName].filter(Boolean).join(' ')||user.displayName||'').slice(0,240);
   return {...base,userId:identity.uid,uid:identity.uid,email:String(user.email||base.email||''),emailverified:user.emailVerified===true,displayName:name,photoURL:String(base.photoURL||user.photoURL||'').slice(0,2000),provider:base.provider||identity.firebase?.sign_in_provider||'firebase',modifiedTS:now};
  },undefined,false);
  if(!result.committed)throw fail(403,'account_disabled');return res.json(result.snapshot.val());
 };
}
