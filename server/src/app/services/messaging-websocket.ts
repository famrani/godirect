import {WebSocketServer,WebSocket,type RawData} from 'ws';
import type {IncomingMessage} from 'node:http';
import type {Duplex} from 'node:stream';
import type {MessagingService} from './messaging.service.js';
export class MessagingWebSocket{
 private wss=new WebSocketServer({noServer:true,maxPayload:16384,perMessageDeflate:false});
 private counts=new Map<string,number>();
 constructor(private service:MessagingService){}
 attach(server:any){
  server.on('upgrade',(req:IncomingMessage,socket:Duplex,head:Buffer)=>{
   socket.on('error',()=>{});
   if(req.url!=='/api/messaging/ws'||this.wss.clients.size>=1000){socket.destroy();return;}
   try{const origin=new URL(String(req.headers.origin||''));if(origin.host!==req.headers.host||!(origin.protocol==='https:'||(origin.protocol==='http:'&&['localhost','127.0.0.1'].includes(origin.hostname))))throw Error('origin');}catch{socket.write('HTTP/1.1 403 Forbidden\r\nConnection: close\r\n\r\n');socket.destroy();return;}
   this.wss.handleUpgrade(req,socket,head,ws=>this.accept(ws));
  });
  server.on('close',()=>{for(const ws of this.wss.clients)ws.terminate();this.wss.close();});
 }
 private accept(ws:WebSocket){
  let uid='',ref:any=null,listener:any=null,token='',alive=true,checking=false;let pulse:ReturnType<typeof setInterval>|undefined;
  const deadline=setTimeout(()=>ws.close(4001,'Authentication required'),10000);
  const lifetime=setTimeout(()=>ws.close(4001,'Refresh authentication'),10*60*1000);
  ws.on('error',()=>{});ws.on('pong',()=>alive=true);
  ws.on('close',()=>{clearTimeout(deadline);clearTimeout(lifetime);if(pulse)clearInterval(pulse);if(ref&&listener)ref.off('value',listener);if(uid){const n=(this.counts.get(uid)||1)-1;if(n)this.counts.set(uid,n);else this.counts.delete(uid);}});
  ws.once('message',(raw:RawData)=>{void(async()=>{
   const message=JSON.parse(raw.toString());if(message.type!=='auth'||typeof message.token!=='string'||message.token.length>12000)throw Error('auth');
   token=message.token;const u=await this.service.identity(token);if(ws.readyState!==WebSocket.OPEN)return;
   if((this.counts.get(u.uid)||0)>=5)throw Error('limit');uid=u.uid;this.counts.set(uid,(this.counts.get(uid)||0)+1);clearTimeout(deadline);
   ws.send(JSON.stringify({type:'ready'}));
   ref=this.service.store.db.ref(`messageSignals/${uid}`);listener=()=>{if(ws.readyState===WebSocket.OPEN){if(ws.bufferedAmount>65536){ws.close(4008,'Slow client');return;}ws.send(JSON.stringify({type:'changed'}));}};ref.on('value',listener,()=>ws.close(1011,'Messaging unavailable'));
   pulse=setInterval(()=>{if(checking)return;if(!alive){ws.terminate();return;}alive=false;ws.ping();checking=true;void this.service.identity(token).then(u=>{if(u.uid!==uid)ws.close(4001,'Authentication changed');}).catch(()=>ws.close(4001,'Authentication expired')).finally(()=>checking=false);},30000);pulse.unref();
  })().catch(()=>ws.close(4001,'Authentication failed'));});
 }
}
