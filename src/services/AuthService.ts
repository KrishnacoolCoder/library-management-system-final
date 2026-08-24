import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserRepository } from "../repositories/UserRepository";
import { OtpService } from "./OtpService";
import { AuditRepository } from "../repositories/AuditRepository";

export class AuthService {
  constructor(
    private readonly users: UserRepository,
    private readonly otp: OtpService,
    private readonly audit: AuditRepository
  ) {}

  async register(name: string, email: string, password: string) {
    if (await this.users.findByEmail(email)) throw new Error("EMAIL_ALREADY_REGISTERED");
    const hash = await bcrypt.hash(password, 12);
    const id = await this.users.create(name, email, hash);
    await this.otp.issue(email, "VERIFY_EMAIL");
    await this.audit.log(id, "REGISTER", "USER", id);
    return { id, email, message: "Registration successful. Verify your email." };
  }

  async verifyEmail(email: string, otp: string) {
    if (!(await this.otp.verify(email, otp, "VERIFY_EMAIL"))) throw new Error("INVALID_OR_EXPIRED_OTP");
    await this.users.markVerified(email);
    return { message: "Email verified successfully." };
  }

  async login(email: string, password: string) {
    const user = await this.users.findByEmail(email);
    if (!user) throw new Error("INVALID_CREDENTIALS");
    if (!user.is_active) throw new Error("ACCOUNT_DISABLED");
    if (!user.is_verified) throw new Error("EMAIL_NOT_VERIFIED");
    if (!(await bcrypt.compare(password, user.password_hash))) throw new Error("INVALID_CREDENTIALS");

    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET_NOT_CONFIGURED");
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      secret,
      { expiresIn: (process.env.JWT_EXPIRES_IN || "1d") as any }
    );
    await this.audit.log(user.id, "LOGIN", "USER", user.id);
    return { token, user: { id:user.id,name:user.name,email:user.email,role:user.role } };
  }
}
