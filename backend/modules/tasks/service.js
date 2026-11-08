import { prisma } from '../../shared/db/prisma.js'
import { HttpError } from '../../shared/http-error.js'
import { ADMIN, activeWorkspaceId } from '../../shared/active-workspace.js'
import { findManageableProject, isProjectMember } from '../projects/index.js'

// Same shape GET /api/workspaces returns per task, so the frontend can drop it straight into Redux
const withAssignee = { assignee: true }

export const createTask = async (auth, input) => {
    // 404 if the project is in another workspace, 403 if the caller isn't an admin or its lead
    await findManageableProject(auth, input.projectId)
    if (!(await isProjectMember(input.assigneeId, input.projectId))) {
        throw new HttpError(400, 'The assignee must be a member of this project')
    }
    return prisma.task.create({ data: input, include: withAssignee })
}

// Lets other modules check that a task is in the caller's workspace without querying Task themselves
export const findTaskInWorkspace = async (auth, taskId) => {
    const workspaceId = activeWorkspaceId(auth)
    const task = await prisma.task.findFirst({ where: { id: taskId, project: { workspaceId } }, select: { id: true } })
    if (!task) throw new HttpError(404, 'Task not found')
    return task
}

export const updateTaskStatus = async (auth, taskId, { status }) => {
    const workspaceId = activeWorkspaceId(auth)
    // Scoped to the active workspace, so another workspace's task is a 404 and its existence isn't confirmed
    const task = await prisma.task.findFirst({
        where: { id: taskId, project: { workspaceId } },
        select: { assigneeId: true, project: { select: { team_lead: true } } },
    })
    if (!task) throw new HttpError(404, 'Task not found')

    const allowed = auth.orgRole === ADMIN || task.project.team_lead === auth.userId || task.assigneeId === auth.userId
    if (!allowed) throw new HttpError(403, 'Only admins, the team lead or the assignee can change this task')

    return prisma.task.update({ where: { id: taskId }, data: { status }, include: withAssignee })
}

// All or nothing: every task is checked before any is deleted, so a mixed selection never half-deletes
export const deleteTasks = async (auth, { ids }) => {
    const workspaceId = activeWorkspaceId(auth)
    const unique = [...new Set(ids)]
    const tasks = await prisma.task.findMany({
        where: { id: { in: unique }, project: { workspaceId } },
        select: { project: { select: { team_lead: true } } },
    })
    if (tasks.length !== unique.length) throw new HttpError(404, 'Some tasks were not found')

    if (auth.orgRole !== ADMIN && tasks.some((task) => task.project.team_lead !== auth.userId)) {
        throw new HttpError(403, 'Only workspace admins or the team lead can delete these tasks')
    }

    const { count } = await prisma.task.deleteMany({ where: { id: { in: unique }, project: { workspaceId } } })
    return { deleted: count }
}
