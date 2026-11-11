import { z } from 'zod'

// Only the text comes from the browser; the author and task come from the token and the URL
export const createCommentSchema = z.object({
    content: z.string().trim().min(1, { error: 'Write a comment first' }).max(2000, { error: 'Comments can be at most 2000 characters' }),
})
