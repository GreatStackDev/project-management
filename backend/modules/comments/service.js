import { prisma } from '../../shared/db/prisma.js'
import { findTaskInWorkspace } from '../tasks/index.js'

// Only what the discussion shows: no email, so less can leak
const withAuthor = { user: { select: { id: true, name: true, image: true } } }

// Any member of the active workspace may read and comment; the token's orgId already proves membership,
// so the only check is that the task belongs to that workspace (404 otherwise)
export const listComments = async (auth, taskId) => {
    await findTaskInWorkspace(auth, taskId)
    return prisma.comment.findMany({ where: { taskId }, include: withAuthor, orderBy: { createdAt: 'asc' } })
}

export const createComment = async (auth, taskId, { content }) => {
    await findTaskInWorkspace(auth, taskId)
    return prisma.comment.create({ data: { content, taskId, userId: auth.userId }, include: withAuthor })
}
