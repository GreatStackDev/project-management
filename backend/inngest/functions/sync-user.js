import { inngest } from '../client.js'
import { prisma } from '../../lib/prisma.js'

// Clerk sends a list of emails; the primary one is matched by id, there is no plain `email` field
const toUserFields = (data) => {
    const email = data.email_addresses.find((e) => e.id === data.primary_email_address_id)?.email_address
    // Email-only signups have null first/last names, but User.name is required
    const name = [data.first_name, data.last_name].filter(Boolean).join(' ') || email

    return { email, name, image: data.image_url ?? '' }
}

// Upsert instead of create/update: webhooks can be delivered more than once, and upsert gives the same result every time
const upsertUser = (data) => {
    const fields = toUserFields(data)
    return prisma.user.upsert({
        where: { id: data.id },
        create: { id: data.id, ...fields },
        update: fields,
    })
}

export const syncUserCreated = inngest.createFunction(
    { id: 'sync-user-created', triggers: { event: 'clerk/user.created' } },
    async ({ event, step }) => {
        await step.run('save-user', () => upsertUser(event.data))
    }
)

export const syncUserUpdated = inngest.createFunction(
    { id: 'sync-user-updated', triggers: { event: 'clerk/user.updated' } },
    async ({ event, step }) => {
        await step.run('update-user', () => upsertUser(event.data))
    }
)

export const syncUserDeleted = inngest.createFunction(
    { id: 'sync-user-deleted', triggers: { event: 'clerk/user.deleted' } },
    async ({ event, step }) => {
        // deleteMany doesn't throw when the user was never saved, so Inngest won't retry for nothing
        await step.run('delete-user', () => prisma.user.deleteMany({ where: { id: event.data.id } }))
    }
)
