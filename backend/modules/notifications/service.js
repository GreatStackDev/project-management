import { sendEmails } from './mailer.js'
import { taskAssignedEmail, taskDueEmail, commentsEmail } from './templates.js'

// Email is a side effect of a save that already happened, so nothing here ever throws:
// a missing key or a Resend outage is logged, never turned into a failed request
const deliver = async (label, buildEmails) => {
    let emails = []
    try {
        emails = buildEmails()
        return await sendEmails(emails)
    } catch (error) {
        console.error(`Failed to send ${label} email:`, error.message)
        return { sent: 0, failed: emails.length }
    }
}

export const sendTaskAssignedEmail = async (data) => {
    // You don't need an email about a task you just gave yourself
    if (data.assignee.id === data.assignedBy) return { sent: 0, failed: 0 }
    return deliver('task-assigned', () => [{ to: data.assignee.email, ...taskAssignedEmail(data) }])
}

export const sendCommentEmails = ({ recipients, ...comment }) =>
    deliver('comment', () => recipients.map((recipient) => ({ to: recipient.email, ...commentsEmail({ recipient, ...comment }) })))

export const sendDueReminders = (tasks) =>
    deliver('due-reminder', () => tasks.map((task) => ({ to: task.assignee.email, ...taskDueEmail(task) })))
