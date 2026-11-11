import * as service from './service.js'

export const listComments = async (req, res) => {
    res.json(await service.listComments(req.auth, req.params.taskId))
}

export const createComment = async (req, res) => {
    res.status(201).json(await service.createComment(req.auth, req.params.taskId, req.body))
}
