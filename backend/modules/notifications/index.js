// Public API of the notifications module: other modules import only from this file.
// It imports no other module, so tasks and comments can call it without creating an import cycle.
export { sendTaskAssignedEmail, sendCommentEmails, sendDueReminders } from './service.js'
