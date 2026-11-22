// A null callback value can be a cold Firebase transaction cache. Returning
// null lets Firebase compare with the server and retry on a nonempty record;
// returning undefined would abort before that comparison.
export function claimNotification(q:any,token:string,now:number):any {
 if(q===null)return null;
 if(!q||q.attempts>=8||q.leaseUntil>now||q.nextAttemptAt>now)return undefined;
 return {...q,lease:token,leaseUntil:now+300000};
}
export function renewNotification(q:any,token:string,now:number):any {
 if(q===null)return null;
 return q?.lease===token?{...q,leaseUntil:now+300000}:undefined;
}
export function failNotification(q:any,token:string,now:number,code:string,responseCode:number|null):any {
 if(q===null)return null;
 return q?.lease===token?{...q,attempts:q.attempts+1,nextAttemptAt:now+Math.min(3600000,30000*2**q.attempts),leaseUntil:0,lease:null,lastError:code,responseCode}:undefined;
}
export function retryNotification(q:any,uid:string,now:number):any {
 if(q===null)return null;
 return q&&q.leaseUntil<now?{...q,attempts:0,nextAttemptAt:now,retriedBy:uid,retriedAt:now}:undefined;
}
