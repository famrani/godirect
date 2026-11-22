// Firebase key boundaries must never be empty. Use inclusive boundaries and
// exclude the cursor in callers, preserving compatibility with RTDB backends.
export function messageCursor(value:any):string{return typeof value==='string'&&/^[-\w]{20}$/.test(value)?value:'';}
export function messageQuery(db:any,threadId:string,after:string):any{
 const query=db.ref(`messageMessages/${threadId}`).orderByKey();
 const cursor=messageCursor(after);return cursor?query.startAt(cursor):query;
}
