import { timingSafeEqual } from 'node:crypto'
import { HttpError } from '../http-error.js'

// Vercel Cron sends "Authorization: Bearer <CRON_SECRET>". Fails closed: with no secret configured,
// nobody can trigger the job, so a missing env var can't turn it into a public "email everyone" button.
export const requireCronSecret = (req, res, next) => {
    const secret = process.env.CRON_SECRET
    const expected = Buffer.from(`Bearer ${secret}`)
    const received = Buffer.from(req.get('authorization') ?? '')
    // Constant-time compare, so response timing doesn't reveal how much of a guess was right
    const valid = Boolean(secret) && received.length === expected.length && timingSafeEqual(received, expected)
    if (!valid) return next(new HttpError(401, 'Unauthorized'))
    next()
}
