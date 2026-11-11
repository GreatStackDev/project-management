import { Router } from 'express'
import { requireAuth } from '../../shared/middleware/require-auth.js'
import { requireCronSecret } from '../../shared/middleware/require-cron-secret.js'
import { validate } from '../../shared/middleware/validate.js'
import { createTaskSchema, updateTaskStatusSchema, deleteTasksSchema } from './schemas.js'
import { createTask, updateTaskStatus, deleteTasks, sendDueReminders } from './controller.js'

export const router = Router()

router.post('/', requireAuth, validate(createTaskSchema), createTask)
router.put('/:id', requireAuth, validate(updateTaskStatusSchema), updateTaskStatus)
// Bulk delete sends the ids in the body: a list doesn't fit in a URL path
router.delete('/', requireAuth, validate(deleteTasksSchema), deleteTasks)
// Called by Vercel Cron (see vercel.json), not by users, so it checks the cron secret instead of a Clerk token
router.get('/due-reminders', requireCronSecret, sendDueReminders)
