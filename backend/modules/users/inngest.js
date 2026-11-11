import { inngest } from '../../shared/inngest/client.js'
import { upsertUser, deleteUser } from './service.js'

const syncUserCreated = inngest.createFunction(
    { id: 'sync-user-created', triggers: { event: 'clerk/user.created' } },
    async ({ event, step }) => {
        await step.run('save-user', () => upsertUser(event.data))
    }
)

const syncUserUpdated = inngest.createFunction(
    { id: 'sync-user-updated', triggers: { event: 'clerk/user.updated' } },
    async ({ event, step }) => {
        await step.run('update-user', () => upsertUser(event.data))
    }
)

const syncUserDeleted = inngest.createFunction(
    { id: 'sync-user-deleted', triggers: { event: 'clerk/user.deleted' } },
    async ({ event, step }) => {
        await step.run('delete-user', () => deleteUser(event.data.id))
    }
)

export const functions = [syncUserCreated, syncUserUpdated, syncUserDeleted]
