import crypto from "crypto";
import bcrypt from "bcryptjs";
import { Database } from "../config/database";
import { EmailService } from "./EmailService";

export class OtpService {
  constructor(private readonly email: EmailService) {}

  async issue(email: string, purpose: "VERIFY_EMAIL" | "LOGIN") {
    const otp = String(crypto.randomInt(100000, 1000000));
    const hash = await bcrypt.hash(otp, 10);
    await Database.getPool().execute(
      `INSERT INTO otp_codes (email,code_hash,purpose,expires_at)
       VALUES (?,?,?,DATE_ADD(NOW(),INTERVAL 10 MINUTE))`,
      [email, hash, purpose]
    );
    await this.email.sendOtp(email, otp);
  }

  async verify(email: string, otp: string, purpose: "VERIFY_EMAIL" | "LOGIN") {
    const [rows] = await Database.getPool().query(
      `SELECT * FROM otp_codes WHERE email=? AND purpose=? AND used=FALSE
       AND expires_at>NOW() ORDER BY created_at DESC LIMIT 1`,
      [email, purpose]
    );
    const record = (rows as any[])[0];
    if (!record || !(await bcrypt.compare(otp, record.code_hash))) return false;
    await Database.getPool().execute("UPDATE otp_codes SET used=TRUE WHERE id=?", [record.id]);
    return true;
  }
}
