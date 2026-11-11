import { Router } from 'express'
import { requireAuth } from '../../shared/middleware/require-auth.js'
import { validate } from '../../shared/middleware/validate.js'
import { createCommentSchema } from './schemas.js'
import { listComments, createComment } from './controller.js'

// Mounted at /api/tasks/:taskId/comments; mergeParams lets this router see the parent's :taskId
export const router = Router({ mergeParams: true })

router.get('/', requireAuth, listComments)
router.post('/', requireAuth, validate(createCommentSchema), createComment)
