"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
class EmailService {
    transporter = null;
    constructor() {
        if (process.env.SMTP_HOST) {
            this.transporter = nodemailer_1.default.createTransport({
                host: process.env.SMTP_HOST,
                port: Number(process.env.SMTP_PORT || 587),
                secure: Number(process.env.SMTP_PORT || 587) === 465,
                auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD }
            });
        }
    }
    async sendOtp(email, otp) {
        if (!this.transporter) {
            console.log(`[DEV OTP] ${email}: ${otp}`);
            return;
        }
        await this.transporter.sendMail({
            from: process.env.SMTP_FROM,
            to: email,
            subject: "Library Manager OTP",
            text: `Your OTP is ${otp}. It expires in 10 minutes.`
        });
    }
}
exports.EmailService = EmailService;
