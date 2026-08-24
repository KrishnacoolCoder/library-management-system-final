"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AuthService {
    users;
    otp;
    audit;
    constructor(users, otp, audit) {
        this.users = users;
        this.otp = otp;
        this.audit = audit;
    }
    async register(name, email, password) {
        if (await this.users.findByEmail(email))
            throw new Error("EMAIL_ALREADY_REGISTERED");
        const hash = await bcryptjs_1.default.hash(password, 12);
        const id = await this.users.create(name, email, hash);
        await this.otp.issue(email, "VERIFY_EMAIL");
        await this.audit.log(id, "REGISTER", "USER", id);
        return { id, email, message: "Registration successful. Verify your email." };
    }
    async verifyEmail(email, otp) {
        if (!(await this.otp.verify(email, otp, "VERIFY_EMAIL")))
            throw new Error("INVALID_OR_EXPIRED_OTP");
        await this.users.markVerified(email);
        return { message: "Email verified successfully." };
    }
    async login(email, password) {
        const user = await this.users.findByEmail(email);
        if (!user)
            throw new Error("INVALID_CREDENTIALS");
        if (!user.is_active)
            throw new Error("ACCOUNT_DISABLED");
        if (!user.is_verified)
            throw new Error("EMAIL_NOT_VERIFIED");
        if (!(await bcryptjs_1.default.compare(password, user.password_hash)))
            throw new Error("INVALID_CREDENTIALS");
        const secret = process.env.JWT_SECRET;
        if (!secret)
            throw new Error("JWT_SECRET_NOT_CONFIGURED");
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, secret, { expiresIn: (process.env.JWT_EXPIRES_IN || "1d") });
        await this.audit.log(user.id, "LOGIN", "USER", user.id);
        return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
    }
}
exports.AuthService = AuthService;
