import 'dotenv/config'
import nodemailer from 'nodemailer'

// Any SMTP provider works here; Brevo is only the values in .env
const port = Number(process.env.SMTP_PORT)

const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    // 465 is TLS from the first byte; 587 starts plain and upgrades with STARTTLS
    secure: port === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
})

export const sendMail = ({ to, subject, html, text }) =>
    transport.sendMail({ from: process.env.MAIL_FROM, to, subject, html, text })
