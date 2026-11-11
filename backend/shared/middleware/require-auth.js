import { getAuth } from '@clerk/express'
import { HttpError } from '../http-error.js'

// clerkMiddleware has already verified the token; this rejects requests that have none.
// Clerk's own requireAuth() redirects to a sign-in page, which is wrong for a JSON API.
export const requireAuth = (req, res, next) => {
    const { userId, orgId, orgRole } = getAuth(req)
    if (!userId) return next(new HttpError(401, 'Please sign in'))
    req.auth = { userId, orgId, orgRole }
    next()
}
