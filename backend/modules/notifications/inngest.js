// Listens to events from other modules and emails people; nothing here writes to the database
import { inngest } from '../../shared/inngest/client.js'
import { sendMail } from './mailer.js'
import { taskAssignedEmail } from './templates.js'

const emailTaskAssigned = inngest.createFunction(
    { id: 'email-task-assigned', triggers: { event: 'app/task.assigned' } },
    async ({ event, step }) => {
        const { assignee, assignedBy } = event.data
        // You don't need an email about a task you just gave yourself
        if (assignee.id === assignedBy) return { skipped: 'self-assigned' }
        await step.run('send-email', () => sendMail({ to: assignee.email, ...taskAssignedEmail(event.data) }))
    }
)

export const functions = [emailTaskAssigned]
