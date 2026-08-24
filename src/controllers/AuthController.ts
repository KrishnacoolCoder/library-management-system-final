import { Request, Response } from "express";
import { z } from "zod";
import { AuthService } from "../services/AuthService";
const register = z.object({name:z.string().min(2).max(100),email:z.string().email(),password:z.string().min(8).max(100)});
const login = z.object({email:z.string().email(),password:z.string().min(1)});
const otp = z.object({email:z.string().email(),otp:z.string().regex(/^\d{6}$/)});
export class AuthController {
  constructor(private readonly service:AuthService){}
  register=async(req:Request,res:Response)=>{const b=register.parse(req.body);res.status(201).json(await this.service.register(b.name,b.email,b.password));};
  verifyEmail=async(req:Request,res:Response)=>{const b=otp.parse(req.body);res.json(await this.service.verifyEmail(b.email,b.otp));};
  login=async(req:Request,res:Response)=>{const b=login.parse(req.body);res.json(await this.service.login(b.email,b.password));};
}
