// Listens to events from other modules and emails people; nothing here writes to the database
import { inngest } from '../../shared/inngest/client.js'
import { sendMail } from './mailer.js'
import { taskAssignedEmail, taskDueEmail, commentsEmail } from './templates.js'
// Read-only: a cron has no event to carry the data, so it asks the module that owns tasks
import { findTasksDueTomorrow } from '../tasks/index.js'

const emailTaskAssigned = inngest.createFunction(
    { id: 'email-task-assigned', triggers: { event: 'app/task.assigned' } },
    async ({ event, step }) => {
        const { assignee, assignedBy } = event.data
        // You don't need an email about a task you just gave yourself
        if (assignee.id === assignedBy) return { skipped: 'self-assigned' }
        await step.run('send-email', () => sendMail({ to: assignee.email, ...taskAssignedEmail(event.data) }))
    }
)

const emailTasksDueTomorrow = inngest.createFunction(
    { id: 'email-tasks-due-tomorrow', triggers: { cron: '0 6 * * *' } },
    async ({ step }) => {
        const tasks = await step.run('find-due-tasks', () => findTasksDueTomorrow())
        // One step per email, started in parallel: each retries on its own, and allSettled means one address that
        // keeps failing can't stop everyone else's reminder (a sequential loop would block on it, then give up)
        const results = await Promise.allSettled(
            tasks.map((task) =>
                step.run(`send-email-${task.taskId}`, () => sendMail({ to: task.assignee.email, ...taskDueEmail(task) }))
            )
        )
        return { sent: results.filter((r) => r.status === 'fulfilled').length, failed: results.filter((r) => r.status === 'rejected').length }
    }
)

const emailCommentActivity = inngest.createFunction(
    {
        id: 'email-comment-activity',
        triggers: { event: 'app/comment.created' },
        // A burst of comments on one task becomes one email: each new comment restarts the 2-minute wait,
        // and timeout caps it so a busy thread still emails at least every 10 minutes
        debounce: { key: 'event.data.taskId', period: '2m', timeout: '10m' },
    },
    async ({ event, step }) => {
        const { recipients, ...comment } = event.data
        // Parallel and settled for the same reason as the reminders: one bad address can't block the others
        const results = await Promise.allSettled(
            recipients.map((recipient) =>
                step.run(`send-email-${recipient.email}`, () =>
                    sendMail({ to: recipient.email, ...commentsEmail({ recipient, ...comment }) })
                )
            )
        )
        return { sent: results.filter((r) => r.status === 'fulfilled').length, failed: results.filter((r) => r.status === 'rejected').length }
    }
)

export const functions = [emailTaskAssigned, emailTasksDueTomorrow, emailCommentActivity]
