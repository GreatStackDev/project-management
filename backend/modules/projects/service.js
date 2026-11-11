import { prisma } from '../../shared/db/prisma.js'
import { HttpError } from '../../shared/http-error.js'
import { ADMIN, activeWorkspaceId } from '../../shared/active-workspace.js'
import { areWorkspaceMembers } from '../workspaces/index.js'

// Same nested shape GET /api/workspaces returns per project, so the frontend can drop it straight into Redux
const projectTree = {
    tasks: { include: { assignee: true } },
    members: { include: { user: true } },
}

const assertWorkspaceMembers = async (userIds, workspaceId) => {
    if (!(await areWorkspaceMembers(userIds, workspaceId))) {
        throw new HttpError(400, 'Everyone on the project must be a member of this workspace')
    }
}

export const createProject = async (auth, input) => {
    const workspaceId = activeWorkspaceId(auth)
    if (auth.orgRole !== ADMIN) throw new HttpError(403, 'Only workspace admins can create projects')

    const { team_members, team_lead = auth.userId, ...fields } = input
    // The lead is always part of the team
    const memberIds = [...new Set([team_lead, ...team_members])]
    await assertWorkspaceMembers(memberIds, workspaceId)

    return prisma.project.create({
        data: { ...fields, team_lead, workspaceId, members: { create: memberIds.map((userId) => ({ userId })) } },
        include: projectTree,
    })
}

// Looks only inside the caller's active workspace, so another workspace's project is a 404, not a 403:
// a 403 would confirm that the project exists
export const findManageableProject = async (auth, projectId) => {
    const workspaceId = activeWorkspaceId(auth)
    const project = await prisma.project.findFirst({
        where: { id: projectId, workspaceId },
        select: { id: true, name: true, team_lead: true, workspaceId: true },
    })
    if (!project) throw new HttpError(404, 'Project not found')
    if (auth.orgRole !== ADMIN && project.team_lead !== auth.userId) {
        throw new HttpError(403, 'Only workspace admins or the team lead can change this project')
    }
    return project
}

export const updateProject = async (auth, projectId, input) => {
    await findManageableProject(auth, projectId)
    return prisma.project.update({ where: { id: projectId }, data: input, include: projectTree })
}

// Lets other modules check project membership without touching ProjectMember themselves
export const isProjectMember = async (userId, projectId) =>
    (await prisma.projectMember.count({ where: { userId, projectId } })) > 0

export const addProjectMember = async (auth, projectId, { userId }) => {
    const project = await findManageableProject(auth, projectId)
    await assertWorkspaceMembers([userId], project.workspaceId)
    try {
        await prisma.projectMember.create({ data: { userId, projectId } })
    } catch (error) {
        // P2002 = unique constraint; catching it (instead of checking first) is also safe when two requests race
        if (error.code === 'P2002') throw new HttpError(409, 'Already a member of this project')
        throw error
    }
    return prisma.project.findUnique({ where: { id: projectId }, include: projectTree })
}
