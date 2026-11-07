import { Router } from 'express'
import { requireAuth } from '../../shared/middleware/require-auth.js'
import { listWorkspaces } from './controller.js'

export const router = Router()

router.get('/', requireAuth, listWorkspaces)
