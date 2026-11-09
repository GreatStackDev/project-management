import 'dotenv/config'
import { Resend } from 'resend'

// Resend's batch endpoint accepts at most 100 emails per call
const BATCH_LIMIT = 100

// Created on first send: new Resend() throws without RESEND_API_KEY, and at import time that would crash the whole server
let client
const resend = () => (client ??= new Resend(process.env.RESEND_API_KEY))

const sender = () => {
    if (!process.env.MAIL_FROM) throw new Error('MAIL_FROM is not set')
    return process.env.MAIL_FROM
}

// Each email is { to, subject, html, text }. Permissive validation means one bad address is reported
// on its own instead of rejecting the whole batch. Resend returns failures as values, not exceptions.
export const sendEmails = async (emails) => {
    let sent = 0
    let failed = 0
    for (let i = 0; i < emails.length; i += BATCH_LIMIT) {
        const chunk = emails.slice(i, i + BATCH_LIMIT).map((email) => ({ from: sender(), ...email }))
        const { data, error } = await resend().batch.send(chunk, { batchValidation: 'permissive' })
        if (error) {
            console.error('Resend batch failed:', error.name, error.message)
            failed += chunk.length
            continue
        }
        for (const { index, message } of data.errors ?? []) {
            console.error(`Resend rejected the email to ${chunk[index].to}:`, message)
        }
        failed += data.errors?.length ?? 0
        sent += chunk.length - (data.errors?.length ?? 0)
    }
    return { sent, failed }
}
