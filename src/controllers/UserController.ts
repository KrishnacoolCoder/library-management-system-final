import { Response } from "express";
import { z } from "zod";
import { AuthRequest } from "../middleware/auth";
import { UserRepository } from "../repositories/UserRepository";
import { AuditRepository } from "../repositories/AuditRepository";
export class UserController {
  constructor(private readonly users:UserRepository,private readonly audit:AuditRepository){}
  list=async(_req:AuthRequest,res:Response)=>res.json(await this.users.list());
  setStatus=async(req:AuthRequest,res:Response)=>{const b=z.object({active:z.boolean()}).parse(req.body);const id=Number(req.params.id);await this.users.setActive(id,b.active);await this.audit.log(req.user!.id,"UPDATE_STATUS","USER",id,b);res.json({message:"User status updated."});};
  audits=async(req:AuthRequest,res:Response)=>res.json(await this.audit.list(Math.min(500,Math.max(1,Number(req.query.limit||100)))));
}
