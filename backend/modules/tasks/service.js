import { prisma } from '../../shared/db/prisma.js'
import { HttpError } from '../../shared/http-error.js'
import { ADMIN, activeWorkspaceId } from '../../shared/active-workspace.js'
import { findManageableProject, isProjectMember } from '../projects/index.js'
import { sendTaskAssignedEmail, sendDueReminders } from '../notifications/index.js'

// Same shape GET /api/workspaces returns per task, so the frontend can drop it straight into Redux
const withAssignee = { assignee: true }

export const createTask = async (auth, input) => {
    // 404 if the project is in another workspace, 403 if the caller isn't an admin or its lead
    const project = await findManageableProject(auth, input.projectId)
    if (!(await isProjectMember(input.assigneeId, input.projectId))) {
        throw new HttpError(400, 'The assignee must be a member of this project')
    }
    const task = await prisma.task.create({ data: input, include: withAssignee })

    // Awaited because Vercel may stop the function once the response is sent; it never throws, so the save stands
    await sendTaskAssignedEmail({
        taskId: task.id,
        projectId: task.projectId,
        title: task.title,
        dueDate: task.due_date,
        projectName: project.name,
        assignee: task.assignee,
        assignedBy: auth.userId,
    })
    return task
}

// Lets other modules check that a task is in the caller's workspace without querying Task themselves
export const findTaskInWorkspace = async (auth, taskId) => {
    const workspaceId = activeWorkspaceId(auth)
    const task = await prisma.task.findFirst({
        where: { id: taskId, project: { workspaceId } },
        select: { id: true, title: true, projectId: true, assignee: { select: { id: true, email: true, name: true } } },
    })
    if (!task) throw new HttpError(404, 'Task not found')
    return task
}

const DAY_MS = 24 * 60 * 60 * 1000

// Due dates are stored as UTC midnight, so "tomorrow" is the exact range [tomorrow 00:00 UTC, +1 day).
// Done and deleted tasks never match, which is why the reminder needs no cancel logic.
export const findTasksDueTomorrow = async (now = new Date()) => {
    const tomorrow = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1)
    const tasks = await prisma.task.findMany({
        where: { status: { not: 'DONE' }, due_date: { gte: new Date(tomorrow), lt: new Date(tomorrow + DAY_MS) } },
        select: {
            id: true,
            projectId: true,
            title: true,
            due_date: true,
            assignee: { select: { email: true, name: true } },
            project: { select: { name: true } },
        },
    })
    return tasks.map((task) => ({
        taskId: task.id,
        projectId: task.projectId,
        title: task.title,
        dueDate: task.due_date,
        projectName: task.project.name,
        assignee: task.assignee,
    }))
}

// Run daily by Vercel Cron. It lives here, not in notifications, because tasks owns the query:
// that keeps every import pointing one way (tasks → notifications)
export const sendDueTomorrowReminders = async () => sendDueReminders(await findTasksDueTomorrow())

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
