"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpService = void 0;
const crypto_1 = __importDefault(require("crypto"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const database_1 = require("../config/database");
class OtpService {
    email;
    constructor(email) {
        this.email = email;
    }
    async issue(email, purpose) {
        const otp = String(crypto_1.default.randomInt(100000, 1000000));
        const hash = await bcryptjs_1.default.hash(otp, 10);
        await database_1.Database.getPool().execute(`INSERT INTO otp_codes (email,code_hash,purpose,expires_at)
       VALUES (?,?,?,DATE_ADD(NOW(),INTERVAL 10 MINUTE))`, [email, hash, purpose]);
        await this.email.sendOtp(email, otp);
    }
    async verify(email, otp, purpose) {
        const [rows] = await database_1.Database.getPool().query(`SELECT * FROM otp_codes WHERE email=? AND purpose=? AND used=FALSE
       AND expires_at>NOW() ORDER BY created_at DESC LIMIT 1`, [email, purpose]);
        const record = rows[0];
        if (!record || !(await bcryptjs_1.default.compare(otp, record.code_hash)))
            return false;
        await database_1.Database.getPool().execute("UPDATE otp_codes SET used=TRUE WHERE id=?", [record.id]);
        return true;
    }
}
exports.OtpService = OtpService;
