import { prisma } from '../../shared/db/prisma.js'
import { inngest } from '../../shared/inngest/client.js'
import { findTaskInWorkspace } from '../tasks/index.js'

// Only what the discussion shows: no email, so less can leak
const withAuthor = { user: { select: { id: true, name: true, image: true } } }

const PREVIEW_LENGTH = 300

// Any member of the active workspace may read and comment; the token's orgId already proves membership,
// so the only check is that the task belongs to that workspace (404 otherwise)
export const listComments = async (auth, taskId) => {
    await findTaskInWorkspace(auth, taskId)
    return prisma.comment.findMany({ where: { taskId }, include: withAuthor, orderBy: { createdAt: 'asc' } })
}

// The assignee plus everyone who has commented, minus the author. Computed per comment, so when debounce
// keeps only the latest event, its list already includes people who commented earlier in the burst.
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

export const createComment = async (auth, taskId, { content }) => {
    const task = await findTaskInWorkspace(auth, taskId)
    const comment = await prisma.comment.create({ data: { content, taskId, userId: auth.userId }, include: withAuthor })

    // The comment is already saved, so a failed send is logged rather than turned into a 500
    try {
        const recipients = await findRecipients(task, auth.userId)
        if (recipients.length > 0) {
            await inngest.send({
                name: 'app/comment.created',
                data: {
                    taskId,
                    taskTitle: task.title,
                    authorName: comment.user.name,
                    preview: content.slice(0, PREVIEW_LENGTH),
                    recipients,
                },
            })
        }
    } catch (error) {
        console.error('Failed to send app/comment.created', error)
    }
    return comment
}
