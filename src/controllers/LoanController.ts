import { Response } from "express";
import { z } from "zod";
import { AuthRequest } from "../middleware/auth";
import { LoanService } from "../services/LoanService";
const schema=z.object({bookId:z.number().int().positive()});
export class LoanController {
  constructor(private readonly service:LoanService){}
  borrow=async(req:AuthRequest,res:Response)=>{const b=schema.parse(req.body);res.status(201).json(await this.service.borrow(req.user!.id,b.bookId,req.ip));};
  returnBook=async(req:AuthRequest,res:Response)=>res.json(await this.service.returnBook(req.user!.id,Number(req.params.id),req.ip));
  mine=async(req:AuthRequest,res:Response)=>res.json(await this.service.myLoans(req.user!.id));
  all=async(_req:AuthRequest,res:Response)=>res.json(await this.service.allLoans());
}
