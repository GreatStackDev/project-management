// Titles, names and comments are user-written, so they're escaped before going into HTML
const escapeHtml = (value) =>
    String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;')

// Due dates are stored as UTC midnight; formatting in UTC keeps the calendar day the user picked
const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })

const layout = (heading, body) => `
<div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;color:#18181b">
  <h2 style="font-size:18px">${heading}</h2>
  ${body}
  <p style="font-size:12px;color:#71717a;margin-top:24px">Sent by Alkham</p>
</div>`

export const taskAssignedEmail = ({ assignee, title, projectName, dueDate }) => ({
    subject: `You've been assigned: ${title}`,
    text: `Hi ${assignee.name},\n\nYou've been assigned "${title}" in ${projectName}. It's due ${formatDate(dueDate)}.`,
    html: layout(
        `You've been assigned: ${escapeHtml(title)}`,
        `<p>Hi ${escapeHtml(assignee.name)},</p>
  <p>You've been assigned <strong>${escapeHtml(title)}</strong> in ${escapeHtml(projectName)}.</p>
  <p>Due: <strong>${formatDate(dueDate)}</strong></p>`
    ),
})

export const taskDueEmail = ({ assignee, title, projectName, dueDate }) => ({
    subject: `Due tomorrow: ${title}`,
    text: `Hi ${assignee.name},\n\n"${title}" in ${projectName} is due tomorrow (${formatDate(dueDate)}) and isn't marked done yet.`,
    html: layout(
        `Due tomorrow: ${escapeHtml(title)}`,
        `<p>Hi ${escapeHtml(assignee.name)},</p>
  <p><strong>${escapeHtml(title)}</strong> in ${escapeHtml(projectName)} is due tomorrow (${formatDate(dueDate)}) and isn't marked done yet.</p>`
    ),
})

// The author's follow-ups within a few minutes send no email, so this points to the task for the rest
export const commentsEmail = ({ recipient, taskTitle, authorName, preview }) => ({
    subject: `${authorName} commented on ${taskTitle}`,
    text: `Hi ${recipient.name},\n\n${authorName} commented on "${taskTitle}":\n\n"${preview}"\n\nOpen the task to read the discussion.`,
    html: layout(
        `New comment on ${escapeHtml(taskTitle)}`,
        `<p>Hi ${escapeHtml(recipient.name)},</p>
  <p>${escapeHtml(authorName)} commented on <strong>${escapeHtml(taskTitle)}</strong>:</p>
  <blockquote style="margin:0;padding:8px 12px;border-left:3px solid #3b82f6;background:#f4f4f5">${escapeHtml(preview)}</blockquote>
  <p>Open the task to read the discussion.</p>`
    ),
})
