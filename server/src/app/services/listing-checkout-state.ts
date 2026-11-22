export interface CheckoutScope {type:string;id:string;ownerId:string;mode:string;}
export function checkoutSessionMatches(session:any,scope:CheckoutScope):boolean {
 const m=session?.metadata||{};
 return session?.mode==='subscription'&&session.livemode===(scope.mode==='live')&&
  m.platform==='godirect-listing'&&m.assetType===scope.type&&m.assetId===scope.id&&m.ownerId===scope.ownerId;
}
export function expiredCheckoutUpdate(current:any,session:any,scope:CheckoutScope,now:number):any {
 if(!current||!checkoutSessionMatches(session,scope)||session.status!=='expired'||
  session.payment_status!=='unpaid'||session.subscription||current.subscriptionId||current.paid===true||
  current.ownerId!==scope.ownerId||current.mode!==scope.mode||current.sessionId!==session.id||
  !['checkout_pending','checkout_expired'].includes(current.status))return undefined;
 return {...current,status:'checkout_expired',busyUntil:0,
  checkoutExpiredAt:current.checkoutExpiredAt||now,
  checkoutHistory:{...(current.checkoutHistory||{}),[session.id]:{
   status:'expired',paymentStatus:'unpaid',requestId:current.requestId||null,
   expiredAt:Number(session.expires_at)||null,checkedAt:now
  }}};
}
