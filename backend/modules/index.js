import { functions as userFunctions } from './users/index.js'

// Every module's Inngest functions, served together at /api/inngest
export const functions = [...userFunctions]
