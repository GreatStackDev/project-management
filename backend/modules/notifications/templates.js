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

// FRONTEND_URL is the same value CORS allows. Without it (e.g. local dev) the email just has no link,
// which beats a link to localhost that opens nothing for the recipient.
const taskUrl = ({ projectId, taskId }) => {
    const base = process.env.FRONTEND_URL?.replace(/\/+$/, '')
    if (!base || !projectId || !taskId) return null
    return `${base}/taskDetails?${new URLSearchParams({ projectId, taskId })}`
}

const linkHtml = (url) =>
    url
        ? `<p style="margin-top:20px"><a href="${escapeHtml(url)}" style="display:inline-block;background:#3b82f6;color:#ffffff;text-decoration:none;padding:10px 16px;border-radius:6px;font-size:14px">Open task</a></p>`
        : ''

const linkText = (url) => (url ? `\n\nOpen the task: ${url}` : '')

const layout = (heading, body) => `
<div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;color:#18181b">
  <h2 style="font-size:18px">${heading}</h2>
  ${body}
  <p style="font-size:12px;color:#71717a;margin-top:24px">Sent by Alkham</p>
</div>`

export const taskAssignedEmail = ({ assignee, title, projectName, dueDate, projectId, taskId }) => {
    const url = taskUrl({ projectId, taskId })
    return {
        subject: `You've been assigned: ${title}`,
        text: `Hi ${assignee.name},\n\nYou've been assigned "${title}" in ${projectName}. It's due ${formatDate(dueDate)}.${linkText(url)}`,
        html: layout(
            `You've been assigned: ${escapeHtml(title)}`,
            `<p>Hi ${escapeHtml(assignee.name)},</p>
  <p>You've been assigned <strong>${escapeHtml(title)}</strong> in ${escapeHtml(projectName)}.</p>
  <p>Due: <strong>${formatDate(dueDate)}</strong></p>${linkHtml(url)}`
        ),
    }
}

export const taskDueEmail = ({ assignee, title, projectName, dueDate, projectId, taskId }) => {
    const url = taskUrl({ projectId, taskId })
    return {
        subject: `Due tomorrow: ${title}`,
        text: `Hi ${assignee.name},\n\n"${title}" in ${projectName} is due tomorrow (${formatDate(dueDate)}) and isn't marked done yet.${linkText(url)}`,
        html: layout(
            `Due tomorrow: ${escapeHtml(title)}`,
            `<p>Hi ${escapeHtml(assignee.name)},</p>
  <p><strong>${escapeHtml(title)}</strong> in ${escapeHtml(projectName)} is due tomorrow (${formatDate(dueDate)}) and isn't marked done yet.</p>${linkHtml(url)}`
        ),
    }
}

// The author's follow-ups within a few minutes send no email, so this points to the task for the rest
export const commentsEmail = ({ recipient, taskTitle, authorName, preview, projectId, taskId }) => {
    const url = taskUrl({ projectId, taskId })
    return {
        subject: `${authorName} commented on ${taskTitle}`,
        text: `Hi ${recipient.name},\n\n${authorName} commented on "${taskTitle}":\n\n"${preview}"\n\nOpen the task to read the discussion.${linkText(url)}`,
        html: layout(
            `New comment on ${escapeHtml(taskTitle)}`,
            `<p>Hi ${escapeHtml(recipient.name)},</p>
  <p>${escapeHtml(authorName)} commented on <strong>${escapeHtml(taskTitle)}</strong>:</p>
  <blockquote style="margin:0;padding:8px 12px;border-left:3px solid #3b82f6;background:#f4f4f5">${escapeHtml(preview)}</blockquote>
  <p>Open the task to read the discussion.</p>${linkHtml(url)}`
        ),
    }
}
