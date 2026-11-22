import {Injectable,NgZone} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {StoreDbService} from 'godigital-lib';
import {BehaviorSubject,Subject,firstValueFrom,timeout} from 'rxjs';
import {MessageNotificationState,MessageSummary,MessageNotice} from './message-notification-state';
@Injectable({providedIn:'root'})
export class MessageNotificationsService {
 readonly summary=new BehaviorSubject<MessageSummary>({unreadMessages:0,unreadThreads:0,latest:[]});
 readonly notice=new BehaviorSubject<MessageNotice|null>(null);
 readonly changes=new Subject<void>();readonly connection=new BehaviorSubject('offline');
 uid='';private state=new MessageNotificationState();private socket?:WebSocket;private running=false;private generation=0;private authInstance:any;private unsubscribe?:()=>void;
 private watcher:any;private poll:any;private retry:any;private debounce:any;private toastTimer:any;private pending=false;private queued=false;private delay=1000;private inFlight=0;
 constructor(private http:HttpClient,private store:StoreDbService,private zone:NgZone){}
 private auth(){const s:any=this.store;return s.firebaseauth||s.firebaseAuth||s.auth;}
 private user(){return this.auth()?.currentUser;}
 private readonly onForeground=()=>{if(typeof document!=='undefined'&&document.visibilityState==='visible')void this.refresh();};
 start(){if(this.running)return;this.running=true;if(typeof window!=='undefined')window.addEventListener('focus',this.onForeground);if(typeof document!=='undefined')document.addEventListener('visibilitychange',this.onForeground);this.reconcile();this.watcher=setInterval(()=>this.reconcile(),1000);this.poll=setInterval(()=>{if(this.uid)void this.refresh();},15000);}
 stop(){this.running=false;if(typeof window!=='undefined')window.removeEventListener('focus',this.onForeground);if(typeof document!=='undefined')document.removeEventListener('visibilitychange',this.onForeground);clearInterval(this.watcher);clearInterval(this.poll);this.unsubscribe?.();this.authInstance=null;this.switchUser('');}
 private reconcile(){const auth=this.auth();if(auth&&auth!==this.authInstance){this.unsubscribe?.();this.authInstance=auth;if(typeof auth.onAuthStateChanged==='function')this.unsubscribe=auth.onAuthStateChanged(()=>this.zone.run(()=>this.switchUser(this.user()?.uid||'')));}this.switchUser(this.user()?.uid||'');}
 private switchUser(uid:string){if(uid===this.uid)return;this.generation++;this.uid=uid;this.socket?.close();this.socket=undefined;clearTimeout(this.retry);clearTimeout(this.debounce);clearTimeout(this.toastTimer);this.state.reset();this.pending=false;this.queued=false;this.summary.next({unreadMessages:0,unreadThreads:0,latest:[]});this.notice.next(null);this.connection.next('offline');this.delay=1000;if(uid&&this.running){void this.refresh();void this.connect();}}
 async refresh(){if(!this.uid||!this.running)return;if(this.pending){this.queued=true;return;}const generation=this.generation,uid=this.uid,user=this.user(),request=++this.inFlight;if(user?.uid!==uid){this.reconcile();return;}this.pending=true;
  try{const token=await user.getIdToken();if(generation!==this.generation)return;const result=await firstValueFrom(this.http.get<MessageSummary>('/api/messaging/unread',{headers:{Authorization:'Bearer '+token}}).pipe(timeout(10000)));if(generation!==this.generation||this.user()?.uid!==uid)return;const notice=this.state.accept(result);this.summary.next(result);if(notice){this.notice.next(notice);clearTimeout(this.toastTimer);this.toastTimer=setTimeout(()=>this.notice.next(null),8000);}this.changes.next();}
  catch(e:any){if(generation===this.generation&&[401,403,503].includes(e.status)){this.state.reset();this.summary.next({unreadMessages:0,unreadThreads:0,latest:[]});this.notice.next(null);}}
  finally{if(generation===this.generation&&request===this.inFlight){this.pending=false;if(this.queued){this.queued=false;void this.refresh();}}}
 }
 dismiss(){clearTimeout(this.toastTimer);this.notice.next(null);}
 private async connect(){const generation=this.generation,uid=this.uid;this.connection.next('connecting');try{const user=this.user();if(user?.uid!==uid)throw Error('session');const token=await user.getIdToken();if(generation!==this.generation||!this.running)return;const ws=new WebSocket(`${location.protocol==='https:'?'wss:':'ws:'}//${location.host}/api/messaging/ws`);this.socket=ws;
 const current=()=>generation===this.generation&&this.socket===ws&&this.running;
 ws.onopen=()=>{if(current())ws.send(JSON.stringify({type:'auth',token}));else ws.close();};
 ws.onmessage=e=>this.zone.run(()=>{if(!current())return;let m:any;try{m=JSON.parse(e.data);}catch{return;}if(m.type==='ready'){this.connection.next('live');this.delay=1000;}if(m.type==='ready'||m.type==='changed'){clearTimeout(this.debounce);this.debounce=setTimeout(()=>void this.refresh(),200);}});
 ws.onerror=()=>this.zone.run(()=>{if(current())this.connection.next('offline');});
 ws.onclose=()=>this.zone.run(()=>{if(current())this.scheduleReconnect(generation);});
 }catch{if(generation===this.generation)this.scheduleReconnect(generation);}}
 private scheduleReconnect(generation:number){this.connection.next('offline');if(!this.running||!this.uid)return;clearTimeout(this.retry);this.retry=setTimeout(()=>{if(generation===this.generation)void this.connect();},this.delay);this.delay=Math.min(30000,this.delay*2);}
}
