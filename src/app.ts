import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";
import path from "path";
import {errorHandler} from "./middleware/errorHandler";
import {swaggerDocument} from "./swagger";
import {authRoutes} from "./routes/authRoutes";
import {bookRoutes} from "./routes/bookRoutes";
import {loanRoutes} from "./routes/loanRoutes";
import {userRoutes} from "./routes/userRoutes";
import {UserRepository} from "./repositories/UserRepository";
import {BookRepository} from "./repositories/BookRepository";
import {LoanRepository} from "./repositories/LoanRepository";
import {AuditRepository} from "./repositories/AuditRepository";
import {EmailService} from "./services/EmailService";
import {OtpService} from "./services/OtpService";
import {AuthService} from "./services/AuthService";
import {BookService} from "./services/BookService";
import {LoanService} from "./services/LoanService";
import {AuthController} from "./controllers/AuthController";
import {BookController} from "./controllers/BookController";
import {LoanController} from "./controllers/LoanController";
import {UserController} from "./controllers/UserController";

export function createApp(){
  const app=express();
  app.set("trust proxy",1);
  app.use(helmet({contentSecurityPolicy:false}));
  app.use(cors({origin:true}));
  app.use(compression());
  app.use(express.json({limit:"1mb"}));

  const general=rateLimit({
    windowMs:Number(process.env.RATE_LIMIT_WINDOW_MS||900000),
    limit:Number(process.env.RATE_LIMIT_MAX||100),
    standardHeaders:true,legacyHeaders:false
  });
  const authLimit=rateLimit({
    windowMs:Number(process.env.RATE_LIMIT_WINDOW_MS||900000),
    limit:Number(process.env.AUTH_RATE_LIMIT_MAX||20),
    standardHeaders:true,legacyHeaders:false
  });

  app.use("/api",general);
  app.use("/api/auth",authLimit);

  app.use(express.static(path.join(process.cwd(),"public")));
  app.get("/api/health",(_req,res)=>res.json({status:"ok",service:"library-management-system",version:"2.0.0"}));
  app.use("/api/docs",swaggerUi.serve,swaggerUi.setup(swaggerDocument));

  const users=new UserRepository(),books=new BookRepository(),loans=new LoanRepository(),audit=new AuditRepository();
  const otp=new OtpService(new EmailService());
  const auth=new AuthController(new AuthService(users,otp,audit));
  const book=new BookController(new BookService(books,audit));
  const loan=new LoanController(new LoanService(users,books,loans,audit));
  const user=new UserController(users,audit);

  app.use("/api/auth",authRoutes(auth));
  app.use("/api/books",bookRoutes(book));
  app.use("/api/loans",loanRoutes(loan));
  app.use("/api/users",userRoutes(user));

  app.get("*",(_req,res)=>res.sendFile(path.join(process.cwd(),"public","index.html")));
  app.use(errorHandler);
  return app;
}
