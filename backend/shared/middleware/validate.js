import { HttpError } from '../http-error.js'

// Never trust the browser: the body is checked against the schema, and only the parsed result
// (unknown fields stripped, values coerced) reaches the controller
export const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body ?? {})
    if (!result.success) return next(new HttpError(400, result.error.issues[0].message))
    req.body = result.data
    next()
}
