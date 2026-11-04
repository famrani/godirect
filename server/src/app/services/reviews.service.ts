import { Request, Response } from 'express';
import { z } from 'zod';
import { FirebaseService } from './firebase.service.js';
const schema=z.object({assetId:z.string(),customerId:z.string(),bookingId:z.string(),rating:z.number().int().min(1).max(5),comment:z.string().max(3000).default('')});
export class ReviewsService {
 constructor(private readonly firebase:FirebaseService){}
 create=async(req:Request,res:Response)=>{const p=schema.parse(req.body); const existing=await this.firebase.db.ref('reviews').orderByChild('bookingId').equalTo(p.bookingId).once('value'); if(existing.exists())return res.status(409).json({error:'review_already_exists'}); const ref=this.firebase.db.ref('reviews').push(); const id=String(ref.key); const row={id,...p,createdAt:new Date().toISOString()}; await this.firebase.db.ref().update({[`reviews/${id}`]:row,[`reviewsByAsset/${p.assetId}/${id}`]:true}); return res.status(201).json(row)};
 byAsset=async(req:Request,res:Response)=>{const assetId=String(req.params.assetId); const s=await this.firebase.db.ref('reviews').orderByChild('assetId').equalTo(assetId).once('value'); return res.json(Object.values(s.val()||{}));};
}
