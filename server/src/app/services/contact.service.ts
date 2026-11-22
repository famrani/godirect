import {Request,Response} from 'express';
export const CONTACT_RECIPIENT='famrani@alldigitalnetwork.com';
export const CONTACT_PHONE='+33685266510';
const emailPattern=/^[^\s@<>\r\n]+@[^\s@<>\r\n]+\.[^\s@<>\r\n]+$/;
export type ContactInput={name:string,email:string,message:string,topic:'general'|'listing'|'payment',language:string};
export function validateContact(body:any):ContactInput|null{
 if(!body||typeof body!=='object'||Array.isArray(body)||!['name','email','message'].every(k=>typeof body[k]==='string'))return null;
 const name=body.name.trim(),email=body.email.trim(),message=body.message.trim();
 if(name.length<2||name.length>100||/[\r\n\x00-\x1f\x7f]/.test(name)||email.length>254||!emailPattern.test(email)||!message||message.length>5000||message.includes('\0')||!['general','listing','payment'].includes(body.topic)||!['fr','en','es','it','de','nl','ru'].includes(body.language))return null;
 return{name,email,message,topic:body.topic,language:body.language};
}
export function buildContactMail(input:ContactInput,from:string){return{from:{name:'GoDirect — All Digital Network',address:from},to:CONTACT_RECIPIENT,replyTo:{name:input.name,address:input.email},subject:'[GoDirect] '+({general:'Contact',listing:'Annonce / Listing',payment:'Paiement / Payment'}[input.topic]),text:['Nouveau message depuis GoDirect','',`Nom: ${input.name}`,`Email: ${input.email}`,`Sujet: ${input.topic}`,`Langue: ${input.language}`,'',input.message].join('\n'),disableFileAccess:true,disableUrlAccess:true};}
export type ContactSender=(mail:ReturnType<typeof buildContactMail>)=>Promise<{accepted?:readonly unknown[]}>;
export async function smtpSender():Promise<ContactSender|undefined>{
 const{SMTP_HOST,SMTP_USER,SMTP_PASS}=process.env;if(!SMTP_HOST||!SMTP_USER||!SMTP_PASS)return undefined;
 const port=Number(process.env.SMTP_PORT||587);if(!Number.isInteger(port)||port<1||port>65535)throw Error('invalid_smtp_port');
 const secure=process.env.SMTP_SECURE==='true'||(process.env.SMTP_SECURE===undefined&&port===465);
 // Same SMTP/Nodemailer mechanism as alldigitalnetwork.com; load only when configured.
 const moduleName='nodemailer';const loaded=await import(moduleName);const nodemailer=loaded.default||loaded;
 const transport=nodemailer.createTransport({host:SMTP_HOST,port,secure,requireTLS:!secure,auth:{user:SMTP_USER,pass:SMTP_PASS},connectionTimeout:15000,greetingTimeout:10000,socketTimeout:20000});
 return mail=>transport.sendMail(mail);
}
export function contactOriginAllowed(origin:string){try{const u=new URL(origin);const configured=(process.env.CONTACT_ALLOWED_ORIGINS||'').split(',').map(s=>s.trim()).filter(Boolean);return configured.includes(u.origin)||(u.protocol==='https:'&&(u.hostname==='godirect.fr'||u.hostname.endsWith('.godirect.fr'))&&!u.port)||(['localhost','127.0.0.1'].includes(u.hostname)&&['2000','4200','8100'].includes(u.port)&&['http:','https:'].includes(u.protocol));}catch{return false;}}
export function createContactHandler(sender?:ContactSender){
 const limits=new Map<string,{start:number,count:number}>();let smtpPromise:Promise<ContactSender|undefined>|undefined;
 return async(req:Request,res:Response)=>{
  res.setHeader('Cache-Control','no-store');const origin=req.get('origin');if(origin&&!contactOriginAllowed(origin))return res.status(403).json({ok:false,code:'origin_not_allowed'});
  const now=Date.now();for(const[k,v]of limits)if(now-v.start>900000)limits.delete(k);const ip=req.ip||req.socket.remoteAddress||'unknown';const bucket=limits.get(ip)||{start:now,count:0};if(limits.size>=10000&&!limits.has(ip)||++bucket.count>5)return res.status(429).json({ok:false,code:'too_many_requests'});limits.set(ip,bucket);
  if(!req.is('application/json'))return res.status(415).json({ok:false,code:'json_required'});
  if(typeof req.body?.website==='string'&&req.body.website.trim())return res.status(202).json({ok:true});
  const input=validateContact(req.body);if(!input)return res.status(400).json({ok:false,code:'invalid_contact'});
  const from=process.env.CONTACT_FROM_ADDRESS||process.env.SMTP_USER||CONTACT_RECIPIENT;if(!emailPattern.test(from))return res.status(503).json({ok:false,code:'mail_not_configured'});
  let send:ContactSender|undefined;try{if(sender)send=sender;else{smtpPromise ||= smtpSender().catch(e=>{smtpPromise=undefined;throw e;});send=await smtpPromise;}}catch{return res.status(503).json({ok:false,code:'mail_not_configured'});}
  if(!send)return res.status(503).json({ok:false,code:'mail_not_configured'});
  try{const result=await send(buildContactMail(input,from));if(!result.accepted?.some(v=>String(v).toLowerCase()===CONTACT_RECIPIENT))throw Error('recipient_not_accepted');return res.status(202).json({ok:true});}catch{console.error('[GoDirect contact] SMTP delivery failed');return res.status(502).json({ok:false,code:'mail_send_failed'});}
 };
}
