import { Response } from "express";
import { z } from "zod";
import { AuthRequest } from "../middleware/auth";
import { BookService } from "../services/BookService";
const schema=z.object({isbn:z.string().min(5).max(20),title:z.string().min(1).max(200),author:z.string().min(1).max(150),category:z.string().min(1).max(100),totalCopies:z.number().int().min(1),publishedYear:z.number().int().min(1000).max(2100).optional()});
export class BookController {
  constructor(private readonly service:BookService){}
  list=async(req:AuthRequest,res:Response)=>{const page=Math.max(1,Number(req.query.page||1));const limit=Math.min(100,Math.max(1,Number(req.query.limit||20)));res.json(await this.service.list(String(req.query.q||""),page,limit,String(req.query.sort||"title")));};
  get=async(req:AuthRequest,res:Response)=>{const b=await this.service.get(Number(req.params.id));if(!b)return res.status(404).json({error:"Book not found."});res.json(b);};
  create=async(req:AuthRequest,res:Response)=>{const b=schema.parse(req.body);const id=await this.service.create(b,req.user!.id);res.status(201).json({id,message:"Book created."});};
  update=async(req:AuthRequest,res:Response)=>{const b=schema.parse(req.body);await this.service.update(Number(req.params.id),b,req.user!.id);res.json({message:"Book updated."});};
  delete=async(req:AuthRequest,res:Response)=>{await this.service.delete(Number(req.params.id),req.user!.id);res.json({message:"Book deleted."});};
}
