import { syncUserCreated, syncUserUpdated, syncUserDeleted } from './functions/sync-user.js'

export { inngest } from './client.js'

export const functions = [syncUserCreated, syncUserUpdated, syncUserDeleted]
