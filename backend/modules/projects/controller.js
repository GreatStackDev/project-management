import * as service from './service.js'

export const createProject = async (req, res) => {
    res.status(201).json(await service.createProject(req.auth, req.body))
}

export const updateProject = async (req, res) => {
    res.json(await service.updateProject(req.auth, req.params.id, req.body))
}

export const addProjectMember = async (req, res) => {
    res.status(201).json(await service.addProjectMember(req.auth, req.params.id, req.body))
}
