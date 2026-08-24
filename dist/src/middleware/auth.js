"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
exports.authorize = authorize;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function authenticate(req, res, next) {
    try {
        const header = req.headers.authorization;
        if (!header?.startsWith("Bearer "))
            return res.status(401).json({ error: "Authentication required." });
        const secret = process.env.JWT_SECRET;
        if (!secret)
            throw new Error("JWT secret missing");
        const payload = jsonwebtoken_1.default.verify(header.slice(7), secret);
        req.user = { id: payload.id, email: payload.email, role: payload.role };
        next();
    }
    catch {
        return res.status(401).json({ error: "Invalid or expired token." });
    }
}
function authorize(...roles) {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role))
            return res.status(403).json({ error: "Insufficient permissions." });
        next();
    };
}
