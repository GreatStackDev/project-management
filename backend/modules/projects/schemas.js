import { z } from 'zod'

// <input type="date"> sends "" when empty; the column is nullable, so "" means "no date"
const optionalDate = z.preprocess(
    (value) => (value === '' || value === undefined ? null : value),
    z.coerce.date({ error: 'Invalid date' }).nullable(),
)

const endAfterStart = (data) => !data.start_date || !data.end_date || data.end_date >= data.start_date
const endAfterStartError = { error: 'End date must be on or after the start date', path: ['end_date'] }

const projectFields = {
    name: z.string().trim().min(1, { error: 'Project name is required' }).max(100),
    description: z.string().trim().max(2000).optional().default(''),
    status: z.enum(['ACTIVE', 'PLANNING', 'COMPLETED', 'ON_HOLD', 'CANCELLED']),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
    start_date: optionalDate,
    end_date: optionalDate,
    progress: z.coerce.number().int().min(0).max(100),
}

export const createProjectSchema = z
    .object({
        ...projectFields,
        // Optional: the creator becomes the lead when none is picked, because Project.team_lead is required
        team_lead: z.string().min(1).optional(),
        team_members: z.array(z.string().min(1)).max(100).default([]),
        progress: projectFields.progress.default(0),
    })
    .refine(endAfterStart, endAfterStartError)

export const updateProjectSchema = z.object(projectFields).refine(endAfterStart, endAfterStartError)

export const addMemberSchema = z.object({
    userId: z.string().min(1, { error: 'Pick a member to add' }),
})
