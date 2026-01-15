// @ts-nocheck
import nodemailer from 'nodemailer';

export class EmailService {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST, // masalan: smtp.gmail.com
            port: Number(process.env.SMTP_PORT) || 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER, // email@gmail.com
                pass: process.env.SMTP_PASS, // ilova paroli (app password)
            },
        });
    }

    async sendMail(to: string, subject: string, html: string) {
        try {
            const info = await this.transporter.sendMail({
                from: `"My App Support" <${process.env.SMTP_USER}>`, // Kimdan
                to: to, // Kimga
                subject: subject, // Mavzu
                html: html, // HTML formatidagi xat
            });

            console.log("Message sent: %s", info.messageId);
            return true;
        } catch (error) {
            console.error("SMTP Error:", error);
            return false;
        }
    }
}