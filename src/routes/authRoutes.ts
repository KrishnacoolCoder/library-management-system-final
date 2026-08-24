import {Router} from "express"; import {AuthController} from "../controllers/AuthController";
export function authRoutes(c:AuthController){const r=Router();r.post("/register",c.register);r.post("/verify-email",c.verifyEmail);r.post("/login",c.login);return r;}
