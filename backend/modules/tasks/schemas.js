import { z } from 'zod'

const status = z.enum(['TODO', 'IN_PROGRESS', 'DONE'])

// assigneeId and due_date are NOT NULL in the schema, so both are required here too
export const createTaskSchema = z.object({
    projectId: z.string().min(1, { error: 'Project is required' }),
    title: z.string().trim().min(1, { error: 'Task title is required' }).max(200),
    description: z.string().trim().max(5000).optional().default(''),
    type: z.enum(['TASK', 'BUG', 'FEATURE', 'IMPROVEMENT', 'OTHER']),
    status,
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
    assigneeId: z.string().min(1, { error: 'Pick an assignee' }),
    due_date: z.coerce.date({ error: 'Pick a due date' }),
})

// Only the status can change: unknown fields are stripped, so a title can't be edited through this route
export const updateTaskStatusSchema = z.object({ status })

export const deleteTasksSchema = z.object({
    ids: z.array(z.string().min(1)).min(1, { error: 'Select at least one task' }).max(100),
})
