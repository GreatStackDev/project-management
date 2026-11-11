import * as service from './service.js'

export const createTask = async (req, res) => {
    res.status(201).json(await service.createTask(req.auth, req.body))
}

export const updateTaskStatus = async (req, res) => {
    res.json(await service.updateTaskStatus(req.auth, req.params.id, req.body))
}

export const deleteTasks = async (req, res) => {
    res.json(await service.deleteTasks(req.auth, req.body))
}

export const sendDueReminders = async (req, res) => {
    res.json(await service.sendDueTomorrowReminders())
}
