import { clerkClient } from '@clerk/express'
import { prisma } from '../../shared/db/prisma.js'

// Clerk sends a list of emails; the primary one is matched by id, there is no plain `email` field
const toUserFields = (data) => {
    const email = data.email_addresses.find((e) => e.id === data.primary_email_address_id)?.email_address
    // Email-only signups have null first/last names, but User.name is required
    const name = [data.first_name, data.last_name].filter(Boolean).join(' ') || email

    return { email, name, image: data.image_url ?? '' }
}

// Upsert instead of create/update: webhooks can be delivered more than once, and upsert gives the same result every time
export const upsertUser = (data) => {
    const fields = toUserFields(data)
    return prisma.user.upsert({
        where: { id: data.id },
        create: { id: data.id, ...fields },
        update: fields,
    })
}

// deleteMany doesn't throw when the user was never saved, so Inngest won't retry for nothing
export const deleteUser = (id) => prisma.user.deleteMany({ where: { id } })

// The row can be missing: accounts made before the webhook existed never got a user.created event
export const ensureUser = async (id) => {
    const existing = await prisma.user.findUnique({ where: { id }, select: { id: true } })
    if (existing) return

    const user = await clerkClient.users.getUser(id)
    // .raw is the same JSON shape as the webhook payload, so the same mapping applies
    await upsertUser(user.raw)
}
