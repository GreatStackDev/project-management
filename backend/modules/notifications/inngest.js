// Listens to events from other modules and emails people; nothing here writes to the database
import { inngest } from '../../shared/inngest/client.js'
import { sendMail } from './mailer.js'
import { taskAssignedEmail, taskDueEmail } from './templates.js'
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
        // One step per email: a failed send retries alone and never re-emails people who already got theirs
        for (const task of tasks) {
            await step.run(`send-email-${task.taskId}`, () => sendMail({ to: task.assignee.email, ...taskDueEmail(task) }))
        }
        return { sent: tasks.length }
    }
)

export const functions = [emailTaskAssigned, emailTasksDueTomorrow]
