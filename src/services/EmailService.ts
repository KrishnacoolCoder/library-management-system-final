import nodemailer from "nodemailer";

export class EmailService {
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    if (process.env.SMTP_HOST) {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: Number(process.env.SMTP_PORT || 587) === 465,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD }
      });
    }
  }

  async sendOtp(email: string, otp: string) {
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
