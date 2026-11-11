import { HttpError } from '../http-error.js'

// Express recognises an error handler by its 4 arguments, so `next` must stay even though it's unused
export const errorHandler = (err, req, res, next) => {
    // Our HttpErrors, and Express's own `expose` errors (e.g. malformed JSON), are safe to show.
    // Anything else (Prisma, Clerk, bugs) may leak internals, so it's logged and hidden.
    if (err instanceof HttpError || err.expose) return res.status(err.status).json({ message: err.message })
    console.error(err)
    res.status(500).json({ message: 'Something went wrong' })
}
