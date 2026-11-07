import { inngest } from '../../shared/inngest/client.js'
import { upsertWorkspace, deleteWorkspace, upsertMember, deleteMember } from './service.js'

const syncWorkspace = inngest.createFunction(
    {
        id: 'sync-workspace',
        triggers: [{ event: 'clerk/organization.created' }, { event: 'clerk/organization.updated' }],
    },
    async ({ event, step }) => {
        await step.run('save-workspace', () => upsertWorkspace(event.data))
    }
)

const syncWorkspaceDeleted = inngest.createFunction(
    { id: 'sync-workspace-deleted', triggers: { event: 'clerk/organization.deleted' } },
    async ({ event, step }) => {
        await step.run('delete-workspace', () => deleteWorkspace(event.data.id))
    }
)

const syncWorkspaceMember = inngest.createFunction(
    {
        id: 'sync-workspace-member',
        triggers: [
            { event: 'clerk/organizationMembership.created' },
            { event: 'clerk/organizationMembership.updated' },
        ],
    },
    async ({ event, step }) => {
        await step.run('save-member', () => upsertMember(event.data))
    }
)

const syncWorkspaceMemberDeleted = inngest.createFunction(
    { id: 'sync-workspace-member-deleted', triggers: { event: 'clerk/organizationMembership.deleted' } },
    async ({ event, step }) => {
        await step.run('delete-member', () => deleteMember(event.data))
    }
)

export const functions = [syncWorkspace, syncWorkspaceDeleted, syncWorkspaceMember, syncWorkspaceMemberDeleted]
