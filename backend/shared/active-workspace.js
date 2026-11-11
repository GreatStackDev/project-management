import { HttpError } from './http-error.js'

export const ADMIN = 'org:admin'

// The workspace always comes from the verified token, never from the request body
export const activeWorkspaceId = (auth) => {
    if (!auth.orgId) throw new HttpError(400, 'Select a workspace first')
    return auth.orgId
}
