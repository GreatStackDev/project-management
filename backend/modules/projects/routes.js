import { Router } from 'express'
import { requireAuth } from '../../shared/middleware/require-auth.js'
import { validate } from '../../shared/middleware/validate.js'
import { createProjectSchema, updateProjectSchema, addMemberSchema } from './schemas.js'
import { createProject, updateProject, addProjectMember } from './controller.js'

export const router = Router()

router.post('/', requireAuth, validate(createProjectSchema), createProject)
router.put('/:id', requireAuth, validate(updateProjectSchema), updateProject)
router.post('/:id/members', requireAuth, validate(addMemberSchema), addProjectMember)
