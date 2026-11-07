import { prisma } from '../../shared/db/prisma.js'
import { ensureUser } from '../users/index.js'

const toWorkspaceFields = (org) => ({
    name: org.name,
    // Clerk can have slugs turned off, but Workspace.slug is required and unique; the org id is both
    slug: org.slug || org.id,
    image_url: org.image_url ?? '',
})

const toRole = (clerkRole) => (clerkRole === 'org:admin' ? 'ADMIN' : 'MEMBER')

// Workspaces created through Clerk's API have no created_by, so callers can name a fallback owner
const saveWorkspace = async (org, { fallbackOwnerId, updateExisting }) => {
    const ownerId = org.created_by ?? fallbackOwnerId
    // No owner known yet: the membership event that follows will create the workspace instead
    if (!ownerId) return null

    await ensureUser(ownerId)
    const fields = toWorkspaceFields(org)
    return prisma.workspace.upsert({
        where: { id: org.id },
        create: { id: org.id, ownerId, ...fields },
        update: updateExisting ? fields : {},
    })
}

export const upsertWorkspace = (org) => saveWorkspace(org, { updateExisting: true })

// Cascades to members, projects and tasks through the schema's onDelete rules
export const deleteWorkspace = (id) => prisma.workspace.deleteMany({ where: { id } })

export const upsertMember = async (membership) => {
    const userId = membership.public_user_data.user_id
    const workspaceId = membership.organization.id

    // Events can arrive in any order; only create the workspace here so an old copy can't overwrite newer data
    await saveWorkspace(membership.organization, { fallbackOwnerId: userId, updateExisting: false })
    await ensureUser(userId)

    const role = toRole(membership.role)
    // Clerk sends a membership event for the creator too; upserting on the pair makes that harmless
    return prisma.workspaceMember.upsert({
        where: { userId_workspaceId: { userId, workspaceId } },
        create: { userId, workspaceId, role },
        update: { role },
    })
}

export const deleteMember = (membership) =>
    prisma.workspaceMember.deleteMany({
        where: { userId: membership.public_user_data.user_id, workspaceId: membership.organization.id },
    })
