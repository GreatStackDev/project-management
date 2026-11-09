import { functions as userFunctions } from './users/index.js'
import { functions as workspaceFunctions } from './workspaces/index.js'
import { functions as notificationFunctions } from './notifications/index.js'

// Every module's Inngest functions, served together at /api/inngest
export const functions = [...userFunctions, ...workspaceFunctions, ...notificationFunctions]
