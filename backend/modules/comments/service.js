import { prisma } from '../../shared/db/prisma.js'
import { findTaskInWorkspace } from '../tasks/index.js'
import { sendCommentEmails } from '../notifications/index.js'

// Only what the discussion shows: no email, so less can leak
const withAuthor = { user: { select: { id: true, name: true, image: true } } }

const PREVIEW_LENGTH = 300
// Someone posting several comments in a row sends one email, not one per message
const QUIET_PERIOD_MS = 5 * 60 * 1000

// Any member of the active workspace may read and comment; the token's orgId already proves membership,
// so the only check is that the task belongs to that workspace (404 otherwise)
export const listComments = async (auth, taskId) => {
    await findTaskInWorkspace(auth, taskId)
    return prisma.comment.findMany({ where: { taskId }, include: withAuthor, orderBy: { createdAt: 'asc' } })
}

// The assignee plus everyone who has commented, minus the author
const findRecipients = async (task, authorId) => {
    const commenters = await prisma.comment.findMany({
        where: { taskId: task.id },
        distinct: ['userId'],
        select: { user: { select: { id: true, email: true, name: true } } },
    })
    const people = new Map([task.assignee, ...commenters.map((c) => c.user)].map((p) => [p.id, p]))
    people.delete(authorId)
    return [...people.values()].map(({ email, name }) => ({ email, name }))
}

// Checked before saving, so the new comment doesn't count against itself
const commentedRecently = async (taskId, userId) =>
    (await prisma.comment.count({
        where: { taskId, userId, createdAt: { gte: new Date(Date.now() - QUIET_PERIOD_MS) } },
    })) > 0

export const createComment = async (auth, taskId, { content }) => {
    const task = await findTaskInWorkspace(auth, taskId)
    const skipEmail = await commentedRecently(taskId, auth.userId)
    const comment = await prisma.comment.create({ data: { content, taskId, userId: auth.userId }, include: withAuthor })

    if (!skipEmail) {
        const recipients = await findRecipients(task, auth.userId)
        if (recipients.length > 0) {
            // Awaited because Vercel may stop the function once the response is sent; it never throws
            await sendCommentEmails({
                taskTitle: task.title,
                authorName: comment.user.name,
                preview: content.slice(0, PREVIEW_LENGTH),
                recipients,
            })
        }
    }
    return comment
}
