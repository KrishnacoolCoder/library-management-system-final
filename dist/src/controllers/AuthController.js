"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const zod_1 = require("zod");
const register = zod_1.z.object({ name: zod_1.z.string().min(2).max(100), email: zod_1.z.string().email(), password: zod_1.z.string().min(8).max(100) });
const login = zod_1.z.object({ email: zod_1.z.string().email(), password: zod_1.z.string().min(1) });
const otp = zod_1.z.object({ email: zod_1.z.string().email(), otp: zod_1.z.string().regex(/^\d{6}$/) });
class AuthController {
    service;
    constructor(service) {
        this.service = service;
    }
    register = async (req, res) => { const b = register.parse(req.body); res.status(201).json(await this.service.register(b.name, b.email, b.password)); };
    verifyEmail = async (req, res) => { const b = otp.parse(req.body); res.json(await this.service.verifyEmail(b.email, b.otp)); };
    login = async (req, res) => { const b = login.parse(req.body); res.json(await this.service.login(b.email, b.password)); };
}
exports.AuthController = AuthController;
