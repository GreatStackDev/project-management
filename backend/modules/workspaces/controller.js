import { listWorkspacesForUser } from './service.js'

export const listWorkspaces = async (req, res) => {
    res.json(await listWorkspacesForUser(req.auth.userId))
}
